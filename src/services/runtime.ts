import type {DisplayGroup} from '../models/types';
export class ContentError extends Error {constructor(public code:string,message:string){super(message)}}
function fail(code:string,message:string):never{throw new ContentError(code,message)}
export function safePath(value:unknown):value is string{return typeof value==='string'&&/^[a-zA-Z0-9_./-]+$/.test(value)&&!value.startsWith('/')&&!value.split('/').includes('..')&&!value.includes('\\')}
function time(n:unknown){return typeof n==='number'&&Number.isFinite(n)&&n>=0}
export function validateManifest(m:any){
 if(m?.schemaVersion!=='rechant-content-pack-1'||m.contentProfile!=='rechant-web-runtime-1'||m.packPurpose!=='web-runtime')fail('PROFILE','지원하지 않는 웹 콘텐츠 프로필입니다.');
 if(!Array.isArray(m.songs)||!m.songs.length||typeof m.packVersion!=='string')fail('MANIFEST','콘텐츠 매니페스트가 손상되었습니다.');
 const ids=new Set();for(const e of m.songs){if(typeof e.songId!=='string'||ids.has(e.songId))fail('MANIFEST','곡 식별자가 없거나 중복되었습니다.');ids.add(e.songId)}return m;
}
export function validateSong(s:any,id:string){
 if(s?.schemaVersion!=='rechant-song-content-1'||s.contentProfile!=='rechant-web-runtime-1'||s.performanceSchema!=='rechant-performance-1')fail('PROFILE','지원하지 않는 곡 프로필입니다.');
 if(s.songId!==id||typeof s.title!=='string'||!Array.isArray(s.lines)||!Array.isArray(s.displayGroups)||!Array.isArray(s.chantEvents))fail('FIELDS','곡 필수 정보가 누락되었습니다.');
 if(!time(s.durationMs)||!time(s.practiceDurationMs)||s.practiceDurationMs<s.durationMs||!time(s.outroHoldMs)||!Number.isFinite(s.defaultOffsetMs))fail('TIME','잘못된 곡 시간값입니다.');
 const ids=new Set<string>();for(const e of s.chantEvents){if(!e.id||ids.has(e.id)||typeof e.text!=='string')fail('FIELDS','응원 이벤트 식별자가 잘못되었습니다.');ids.add(e.id);if(!time(e.startMs)||!time(e.leadMs))fail('TIME','응원 이벤트 시간값이 잘못되었습니다.')}
 const groupIds=new Set();for(const g of s.displayGroups){if(!g.id||groupIds.has(g.id)||!Array.isArray(g.rows))fail('FIELDS','표시 그룹이 잘못되었습니다.');groupIds.add(g.id);if(!time(g.startMs)||g.startMs>s.practiceDurationMs)fail('TIME','표시 그룹 시간값이 잘못되었습니다.');for(const r of g.rows){if(!r.id||typeof r.text!=='string'||!Array.isArray(r.spans))fail('FIELDS','표시 행이 잘못되었습니다.');if(r.startMs!==null&&!time(r.startMs))fail('TIME','표시 행 시간값이 잘못되었습니다.');for(const p of r.spans){if(typeof p.text!=='string'||typeof p.chant!=='boolean'||(p.chant&&(!ids.has(p.eventId)||typeof p.hintDisplay!=='string')))fail('FIELDS','응원 힌트 또는 연결 정보가 누락되었습니다.')}}}
 for(const l of s.lines){if(!l.id||typeof l.lyric!=='string'||!Number.isInteger(l.index))fail('FIELDS','원본 가사가 잘못되었습니다.');if(!time(l.startMs)||!time(l.endMs)||l.endMs<l.startMs)fail('TIME','원본 가사 시간값이 잘못되었습니다.')}return s;
}
export function activeStarts(items:readonly {startMs:number}[],timeMs:number){let latest=-Infinity;for(const x of items)if(x.startMs<=timeMs&&x.startMs>latest)latest=x.startMs;return items.map((x,i)=>x.startMs===latest?i:-1).filter(i=>i>=0)}
export function spanText(span:DisplayGroup['rows'][number]['spans'][number],hint:boolean){return hint&&span.chant?span.hintDisplay??'[힌트 없음]':span.text}
