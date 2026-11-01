/** Media time followed by a monotonic silent-tail clock. */
export class AudioEngine {
 readonly element:HTMLAudioElement;
 private tail:number|null=null;private anchor=0;private running=false;private total=0;private duration=0;
 constructor(private now=()=>performance.now(),element?:HTMLAudioElement){this.element=element??new Audio();this.element.preload='metadata';this.element.addEventListener('ended',this.onEnded)}
 private onEnded=()=>{this.tail=this.duration;this.anchor=this.now();this.running=this.total>this.duration};
 load(src:string,durationMs=0,practiceDurationMs=durationMs){this.duration=durationMs;this.total=practiceDurationMs;this.tail=null;this.running=false;this.element.src=src;this.element.load()}
 async play(){if(this.positionMs>=this.total)this.seek(0);if(this.tail!==null){this.anchor=this.now();this.running=true}else await this.element.play()}
 pause(){if(this.tail!==null)this.tail=this.positionMs;this.running=false;this.element.pause()}
 seek(ms:number){const t=Math.max(0,Math.min(this.total,ms)),resume=this.isPlaying;if(t>=this.duration){this.element.pause();this.tail=t;this.anchor=this.now();this.running=resume&&t<this.total}else{this.tail=null;this.running=false;this.element.currentTime=t/1000;if(resume)void this.element.play().catch(()=>{})}}
 get positionMs(){if(this.tail===null)return Math.min(this.total,this.element.currentTime*1000);const t=Math.min(this.total,this.tail+(this.running?this.now()-this.anchor:0));if(t>=this.total){this.tail=this.total;this.running=false}return t}
 get isPlaying(){if(this.tail!==null)return this.positionMs<this.total&&this.running;return !this.element.paused&&!this.element.ended&&this.element.readyState>=3&&!this.element.seeking}
 dispose(){this.running=false;this.element.removeEventListener('ended',this.onEnded);this.element.pause();this.element.removeAttribute('src');this.element.load()}
}
