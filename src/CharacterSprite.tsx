import {useEffect,useRef,useState} from 'react';
import {cosmetics,normalizeCharacter,type Character} from './character-model';
import skinPalettes from './lpc-body-palette.json';
import hairPalettes from './lpc-hair-palette.json';
const cache=new Map<string,Promise<HTMLCanvasElement>>();
function rgb(hex:string){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
function sheet(file:string,palette?:{from:string[];to:string[]}){
 const key=file+JSON.stringify(palette??null);let promise=cache.get(key);if(promise)return promise;
 promise=new Promise<HTMLCanvasElement>((resolve,reject)=>{const image=new Image();image.onload=()=>{try{const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d')!;ctx.drawImage(image,0,0);
 if(palette){const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);const lookup=new Map(palette.from.map((c,i)=>[rgb(c).join(','),rgb(palette.to[i])]));for(let i=0;i<pixels.data.length;i+=4){if(!pixels.data[i+3])continue;const color=lookup.get([pixels.data[i],pixels.data[i+1],pixels.data[i+2]].join(','));if(color){pixels.data[i]=color[0];pixels.data[i+1]=color[1];pixels.data[i+2]=color[2];}}ctx.putImageData(pixels,0,0);}resolve(canvas);}catch(error){reject(error);}};image.onerror=()=>reject(new Error('Não foi possível carregar o personagem.'));image.src='./lpc/'+file;});cache.set(key,promise);return promise;
}
export default function CharacterSprite({character,size=192,direction=2,animate=false}:{character:Character;size?:number;direction?:number;animate?:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);const [error,setError]=useState('');
 useEffect(()=>{let cancelled=false,timer:ReturnType<typeof setInterval>|undefined;let frame=0;setError('');const c=normalizeCharacter(character,cosmetics.map(i=>i.id));const layers=[{file:`body-${c.body}.png`,z:10,palette:{from:skinPalettes.light,to:skinPalettes[c.skin]}},{file:`head-${c.body}.png`,z:100,palette:{from:skinPalettes.light,to:skinPalettes[c.skin]}},{file:`hair-${c.hair}.png`,z:120,palette:{from:hairPalettes.orange,to:hairPalettes[c.hairColor]}},...Object.values(c.equipment).flatMap(id=>cosmetics.find(i=>i.id===id)?.layers[c.body]??[])].sort((a,b)=>a.z-b.z);
 Promise.all(layers.map(l=>sheet(l.file,'palette' in l?l.palette:undefined))).then(images=>{if(cancelled)return;const draw=()=>{const context=ref.current?.getContext('2d');if(!context)return;context.clearRect(0,0,64,64);context.imageSmoothingEnabled=false;for(const image of images)context.drawImage(image,frame*64,direction*64,64,64,0,0,64,64);};draw();if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>{frame=frame>=8?1:frame+1;draw();},120);}).catch(()=>{if(!cancelled)setError('Arte indisponível');});
 return ()=>{cancelled=true;if(timer)clearInterval(timer);};
 },[character,direction,animate]);
 return <span className="lpc-sprite" style={{width:size,height:size}}>{error?<span role="alert">{error}</span>:<canvas ref={ref} width={64} height={64} style={{width:size,height:size}} role="img" aria-label={`Personagem ${character.name}`}/>}</span>;
}
