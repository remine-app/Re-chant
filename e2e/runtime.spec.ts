import {test,expect} from '@playwright/test';
import {readFileSync,existsSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('public/content/manifest.json','utf8'));
test('runtime groups, stored hints, original lyrics, tail and persistent audio',async({page})=>{
 await page.addInitScript(async(manifest)=>{
  localStorage.setItem('rechant.welcome.v3','seen');
  await new Promise<void>((resolve,reject)=>{const req=indexedDB.open('rechant.audio.v1',1);req.onupgradeneeded=()=>req.result.createObjectStore('audio',{keyPath:'songId'});req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result,tx=db.transaction('audio','readwrite');for(const e of manifest.songs)tx.objectStore('audio').put({...e.requiredAudio,songId:e.songId,blob:new Blob(['test-only']),installedAt:new Date().toISOString(),fileName:'test.mp3'});tx.oncomplete=()=>{db.close();resolve()}}});
 },manifest);
 for(const entry of manifest.songs){
  const song=JSON.parse(readFileSync('public/content/'+entry.dataFile,'utf8'));
  await page.goto('#/practice/'+entry.songId);await page.getByRole('button',{name:'응원법 전체',exact:true}).click();
  await expect(page.locator('.runtime-row')).toHaveCount(song.displayGroups.flatMap((g:any)=>g.rows).length);
  expect(await page.locator('.runtime-row').allTextContents()).toEqual(song.displayGroups.flatMap((g:any)=>g.rows.map((r:any)=>r.spans.map((p:any)=>p.text).join(''))));
  await page.getByRole('button',{name:'연습 모드',exact:true}).click();await page.getByRole('button',{name:'힌트 표시',exact:true}).click();
  expect(await page.locator('.runtime-row').allTextContents()).toEqual(song.displayGroups.flatMap((g:any)=>g.rows.map((r:any)=>r.spans.map((p:any)=>p.chant?p.hintDisplay:p.text).join(''))));
 }
 await page.goto('#/practice/glow-up');await page.getByRole('button',{name:'응원법 전체',exact:true}).click();
 await expect(page.locator('[data-event-id]').first()).toContainText('원이 리브');
 await page.getByRole('button',{name:'연습 모드',exact:true}).click();await expect(page.locator('[data-event-id]').first()).toContainText('○○');
 await page.getByRole('button',{name:'원본 가사만',exact:true}).click();await expect(page.locator('[data-event-id]')).toHaveCount(0);
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}
 await page.goto('#/practice/pretty-girl');await expect(page.getByRole('button',{name:'응원법 전체',exact:true})).toBeVisible();await page.getByRole('button',{name:'연습 모드',exact:true}).click();await page.getByRole('button',{name:'힌트 표시',exact:true}).click();
 await expect(page.locator('[data-event-id]').filter({hasText:'(함성)'})).toHaveCount(2);
 await page.locator('input[aria-label="재생 위치"]').fill('210181');await expect(page.locator('.is-current')).toContainText('○○');
 await page.getByRole('link',{name:'곡 목록',exact:true}).first().click();await page.getByRole('link',{name:'홈',exact:true}).click();
 await page.locator('.feature-card .primary-button').click();await expect.poll(()=>page.locator('input[aria-label="재생 위치"]').inputValue()).toBe('210181');
 await page.getByRole('link',{name:'곡 목록',exact:true}).first().click();await page.locator('.song-row').filter({hasText:'Pretty Girl'}).click();await expect(page.locator('input[aria-label="재생 위치"]')).toHaveValue('0');
 await page.getByRole('link',{name:'설정',exact:true}).click();await expect(page.getByRole('button',{name:'삭제',exact:true})).toHaveCount(0);await expect(page.getByText('Dropbox에서 받은',{exact:false})).toHaveCount(0);
});
test('real audio pack installs, plays and resumes silent tail after refresh',async({page})=>{
 const audioPack=process.env.RECHANT_AUDIO_PACK??'../project_sources/02-Rechant-Audio-Pack.zip';test.skip(!existsSync(audioPack),'RECHANT_AUDIO_PACK에 실제 음원팩 경로를 지정하세요.');
 await page.addInitScript(()=>localStorage.setItem('rechant.welcome.v3','seen'));
 await page.goto('#/practice/pretty-girl');
 await page.getByLabel('음원팩 ZIP 파일 선택').setInputFiles(audioPack);
 await expect(page.getByRole('button',{name:'재생',exact:true})).toBeVisible({timeout:60000});
 await page.getByRole('button',{name:'재생',exact:true}).click();
 await expect.poll(()=>page.locator('input[aria-label="재생 위치"]').inputValue()).not.toBe('0');
 await page.locator('input[aria-label="재생 위치"]').fill('210181');
 await expect(page.locator('.is-current')).toContainText('우리 모두 프리티걸');
 await page.getByRole('button',{name:'일시정지',exact:true}).click();
 const paused=await page.locator('input[aria-label="재생 위치"]').inputValue();
 await page.getByRole('button',{name:'재생',exact:true}).click();
 await expect.poll(()=>page.locator('input[aria-label="재생 위치"]').inputValue()).not.toBe(paused);
 await page.reload();await expect(page.getByRole('button',{name:'재생',exact:true})).toBeVisible();
});
