import {z} from 'zod';
import catalog from './lpc-catalog.json';
export type Body='male'|'female'|'child';
export type Slot='outfit'|'legs'|'feet'|'back'|'head';
export type Cosmetic={id:string;name:string;slot:Slot;rarity:'common'|'rare'|'epic';starter:boolean;layers:Partial<Record<Body,{file:string;z:number;palette?:{from:string[];to:string[]}}[]>>};
export const cosmetics=catalog as Cosmetic[];
export const slots:Record<Slot,string>={outfit:'Trajes',legs:'Calças',feet:'Botas',back:'Capas',head:'Chapéus'};
export const rarityLabels={common:'Comum',rare:'Raro',epic:'Épico'};
export const bodies={child:'Infantil',male:'Adulta A',female:'Adulta B'};
export const skinLabels={light:'Clara',amber:'Âmbar',olive:'Oliva',brown:'Castanha',black:'Escura'};
export const hairColors={black:'Preto',light_brown:'Castanho',blonde:'Loiro',redhead:'Ruivo',white:'Branco',purple:'Violeta'};
export const hairStyles={messy1:'Despojado',plain:'Curto',bob:'Chanel',afro:'Afro',wavy:'Ondulado'};
export const starterWardrobe=cosmetics.filter(i=>i.starter).map(i=>i.id);
const cosmeticId=z.string().refine(id=>cosmetics.some(i=>i.id===id),'Peça desconhecida.');
export const appearanceSchema=z.object({name:z.string().trim().min(1).max(30),body:z.enum(['male','female','child']),skin:z.enum(['light','amber','olive','brown','black']),hair:z.enum(['messy1','plain','bob','afro','wavy']),hairColor:z.enum(['black','light_brown','blonde','redhead','white','purple'])});
export const characterSchema=appearanceSchema.extend({equipment:z.object({outfit:cosmeticId.optional(),legs:cosmeticId.optional(),feet:cosmeticId.optional(),back:cosmeticId.optional(),head:cosmeticId.optional()})});
export type Character=z.infer<typeof characterSchema>;
export const wardrobeSchema=z.array(cosmeticId).max(1000);
export function defaultCharacter():Character{return {name:'Aventureiro',body:'child',skin:'light',hair:'wavy',hairColor:'black',equipment:{outfit:'outfit-blue',legs:'legs-black'}};}
export function fits(item:Cosmetic,body:Body){return !!item.layers[body]?.length;}
export function normalizeCharacter(character:Character,owned:string[]):Character{
 const next=structuredClone(character);if(next.body==='child')next.hair='wavy';else if(next.hair==='wavy')next.hair='messy1';
 for(const slot of Object.keys(slots) as Slot[]){if(!next.equipment[slot]&&!['outfit','legs'].includes(slot))continue;const item=cosmetics.find(i=>i.id===next.equipment[slot]);if(!item||item.slot!==slot||!fits(item,next.body)||!owned.includes(item.id)){next.equipment[slot]=['outfit','legs'].includes(slot)?cosmetics.find(i=>i.starter&&i.slot===slot&&fits(i,next.body)&&owned.includes(i.id))?.id:undefined;}}
 return next;
}
export function drawCosmetic(owned:string[],body:Body,roll:number,pick:number){
 if(roll>=.30)return null;
 const remaining=cosmetics.filter(i=>!i.starter&&!owned.includes(i.id)&&fits(i,body));
 if(!remaining.length)return {bonusGold:20,item:null};
 const rarity=roll<.02?'epic':roll<.10?'rare':'common';let pool=remaining.filter(i=>i.rarity===rarity);if(!pool.length)pool=remaining;
 return {bonusGold:0,item:pool[Math.min(pool.length-1,Math.max(0,Math.floor(pick*pool.length)))]};
}
