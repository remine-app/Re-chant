import type {Song} from '../models/types';
import {audioMatches,createAudioObjectUrl,listInstalledAudio} from './audioLibrary';
import {CONTENT_ROOT,DROPBOX_AUDIO_PACK_URL} from '../config';
import {ContentError,safePath,validateManifest,validateSong} from './runtime';
async function json(url:string){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new ContentError('FETCH',`콘텐츠를 읽을 수 없습니다 (${r.status}).`);try{return await r.json()}catch{throw new ContentError('JSON','콘텐츠 JSON이 손상되었습니다.')}}
export async function loadSongs():Promise<Song[]>{
 const manifest=validateManifest(await json(CONTENT_ROOT+'manifest.json'));
 const installed=new Map((await listInstalledAudio()).map(x=>[x.songId,x]));
 return Promise.all(manifest.songs.map(async(e:any):Promise<Song>=>{
 const base:Song={songId:e.songId,title:e.title??e.songId,artist:e.artist??'RESCENE',version:e.version,packVersion:manifest.packVersion,durationMs:e.durationMs??0,practiceDurationMs:e.durationMs??0,outroHoldMs:0,defaultOffsetMs:0,chantEvents:[],displayGroups:[],lines:[],lyrics:[],contentReady:false,audioReady:false,requiredAudio:e.requiredAudio,audioDownloadUrl:DROPBOX_AUDIO_PACK_URL};
 try{
 if(!safePath(e.dataFile)||(e.coverFile&&!safePath(e.coverFile)))throw new ContentError('PATH','콘텐츠 파일 경로가 올바르지 않습니다.');
 const s=validateSong(await json(CONTENT_ROOT+e.dataFile+'?pack='+encodeURIComponent(manifest.packVersion)),e.songId);
 const required=e.requiredAudio;if(!required||!Number.isFinite(required.durationMs)||!Number.isInteger(required.byteLength)||!/^[a-f0-9]{64}$/i.test(required.sha256)||typeof required.audioVersion!=='string')throw new ContentError('AUDIO','필수 음원 요구사항이 잘못되었습니다.');
 const meta=installed.get(e.songId),ready=audioMatches(meta,required);
 const audioError=ready?undefined:!meta?'음원 미설치':meta.audioVersion!==required.audioVersion?'음원 버전 불일치':meta.sha256!==required.sha256?'음원 해시 불일치':'음원 길이 또는 크기 불일치';
 return {...base,...s,lines:s.lines,lyrics:s.lines,coverUrl:e.coverFile?CONTENT_ROOT+e.coverFile:undefined,requiredAudio:required,contentReady:true,audioReady:ready,audioError,audioVersion:meta?.audioVersion,audioUrl:ready?await createAudioObjectUrl(e.songId):undefined};
 }catch(error){return {...base,contentError:error instanceof Error?error.message:'콘텐츠 오류'};}
 }));
}
export function revokeSongAudioUrls(songs:Song[]){for(const s of songs)if(s.audioUrl?.startsWith('blob:'))URL.revokeObjectURL(s.audioUrl)}
