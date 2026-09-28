import { z } from 'zod';
import {appearanceSchema,characterSchema,wardrobeSchema,starterWardrobe,defaultCharacter,normalizeCharacter,cosmetics,fits,drawCosmetic} from './character-model';
import {scheduleSchema,calendarSchema,calendarImportSchema} from './calendar-model';
export const statuses = ['todo','doing','done'] as const;
export const labels = {todo:'A fazer',doing:'Em progresso',done:'Concluído'};
export const defaultColumns=()=>statuses.map(status=>({id:status,title:labels[status]}));
export const reward = {easy:{xp:25,gold:10,label:'Leve'},medium:{xp:60,gold:25,label:'Média'},hard:{xp:120,gold:50,label:'Desafiadora'}};
const hex=z.string().regex(/^#[0-9a-fA-F]{6}$/);
export const themeSchema=z.object({background:hex,surface:hex,card:hex,accent:hex,text:hex,radius:z.number().int().min(0).max(24)});
export const presets={
  guild:{background:'#141a30',surface:'#1c2741',card:'#293653',accent:'#a4e0cf',text:'#eef0fa',radius:14},
  forest:{background:'#14262b',surface:'#1c363b',card:'#29474b',accent:'#dfcc93',text:'#edf3e9',radius:12},
  arcane:{background:'#241b36',surface:'#312744',card:'#433454',accent:'#dcadd5',text:'#f8edf4',radius:18}
};
export const items=[
{id:'ember',name:'Cristal de brasa',rarity:'Comum',color:'#f2ad6d',shape:'gem',price:60},
{id:'moon',name:'Fragmento lunar',rarity:'Raro',color:'#94bafa',shape:'moon',price:150},
{id:'crown',name:'Coroa do foco',rarity:'Épico',color:'#c7a0ff',shape:'crown',price:350}
] as const;
const id=z.string().min(1).max(100);
const difficulty=z.enum(['easy','medium','hard']);
const columnSchema=z.object({id,title:z.string().trim().min(1).max(40)});
const taskSchema=z.object({id,title:z.string().trim().min(1).max(120),description:z.string().max(2000),difficulty,status:id,rewarded:z.boolean(),schedule:scheduleSchema.optional()});
export const stateSchema=z.object({version:z.literal(1),tasks:z.array(taskSchema).max(10000),columns:z.array(columnSchema).min(2).max(12).default(defaultColumns),xp:z.number().int().nonnegative(),gold:z.number().int().nonnegative(),inventory:z.array(z.object({id:z.enum(['ember','moon','crown']),quantity:z.number().int().positive()})),theme:themeSchema,calendar:calendarSchema.default({imports:[]}),character:characterSchema.default(defaultCharacter),wardrobe:wardrobeSchema.default(()=>[...starterWardrobe])}).superRefine((state,ctx)=>{
 const ids=state.columns.map(c=>c.id);if(new Set(ids).size!==ids.length||!ids.includes('todo')||!ids.includes('done'))ctx.addIssue({code:'custom',message:'Colunas do quadro inválidas.',path:['columns']});
 if(state.tasks.some(t=>!ids.includes(t.status)))ctx.addIssue({code:'custom',message:'Uma missão está em uma coluna inexistente.',path:['tasks']});
});
export type State=z.infer<typeof stateSchema>;
export type Task=z.infer<typeof taskSchema>;
export const actionSchema=z.discriminatedUnion('type',[
 z.object({type:z.literal('add'),title:taskSchema.shape.title,description:taskSchema.shape.description,difficulty,status:id.optional(),schedule:scheduleSchema.optional()}),
 z.object({type:z.literal('edit'),id,title:taskSchema.shape.title,description:taskSchema.shape.description,difficulty,schedule:scheduleSchema.optional()}),
 z.object({type:z.literal('move'),id,status:id,beforeId:id.optional()}),
 z.object({type:z.literal('columnAdd'),title:columnSchema.shape.title}),
 z.object({type:z.literal('columnRename'),id,title:columnSchema.shape.title}),
 z.object({type:z.literal('columnMove'),id,beforeId:id.optional()}),
 z.object({type:z.literal('columnRemove'),id}),
 z.object({type:z.literal('schedule'),id,schedule:scheduleSchema.optional()}),
 z.object({type:z.literal('calendarImport'),source:calendarImportSchema}),
 z.object({type:z.literal('calendarRemove'),id}),
 z.object({type:z.literal('googleCalendar'),google:calendarSchema.shape.google}),
 z.object({type:z.literal('buy'),id:z.enum(['ember','moon','crown'])}),
 z.object({type:z.literal('character'),appearance:appearanceSchema}),
 z.object({type:z.literal('equip'),id:z.string()}),
 z.object({type:z.literal('unequip'),slot:z.enum(['head','back','feet'])}),
 z.object({type:z.literal('theme'),theme:themeSchema})
]);
export type Action=z.infer<typeof actionSchema>;
export function initialState():State{return {version:1,columns:defaultColumns(),character:defaultCharacter(),wardrobe:[...starterWardrobe],xp:0,gold:0,inventory:[],calendar:{imports:[]},theme:{...presets.guild},tasks:[
{id:'welcome-1',title:'Escolher a missão mais importante de hoje',description:'Edite este exemplo ou conclua para experimentar a progressão.',difficulty:'easy',status:'todo',rewarded:false},
{id:'welcome-2',title:'Reservar um bloco de concentração',description:'Defina uma tarefa concreta que caiba em uma sessão de foco.',difficulty:'medium',status:'doing',rewarded:false}
]};}
export function progression(xp:number){let level=1,remaining=xp,goal=100;while(remaining>=goal){remaining-=goal;level++;goal=100+(level-1)*50;}return {level,current:remaining,goal};}
export function reduce(state:State,input:Action,rng:()=>number=Math.random,uuid:()=>string=()=>crypto.randomUUID()):{state:State;message:string}{
 const action=actionSchema.parse(input);const next=structuredClone(state);let message='Alterações salvas.';
 const addItem=(itemId:string)=>{const entry=next.inventory.find(i=>i.id===itemId);if(entry)entry.quantity++;else next.inventory.push({id:itemId as State['inventory'][number]['id'],quantity:1});};
 if(action.type==='add'){const status=action.status??'todo';if(!next.columns.some(c=>c.id===status)||status==='done')throw Error('Escolha uma etapa ativa para criar a missão.');next.tasks.push({id:uuid(),title:action.title,description:action.description,difficulty:action.difficulty,status,rewarded:false,schedule:action.schedule});message='Nova missão criada.';}
 if(action.type==='edit'){const task=next.tasks.find(t=>t.id===action.id);if(!task)throw Error('Tarefa não encontrada.');Object.assign(task,{title:action.title,description:action.description,schedule:action.schedule});if(!task.rewarded)task.difficulty=action.difficulty;}
 if(action.type==='move'){
  const task=next.tasks.find(t=>t.id===action.id);if(!task)throw Error('Tarefa não encontrada.');
  if(!next.columns.some(c=>c.id===action.status))throw Error('Etapa de destino não encontrada.');
  if(action.beforeId===action.id)return {state,message:'Posição mantida.'};
  if(action.beforeId&&!next.tasks.some(t=>t.id===action.beforeId&&t.status===action.status))throw Error('Destino inválido.');
  task.status=action.status;
  if(action.status==='done'&&!task.rewarded){task.rewarded=true;const value=reward[task.difficulty];next.xp+=value.xp;next.gold+=value.gold;message=`Missão concluída! +${value.xp} EXP e +${value.gold} Gold.`;
   const roll=rng();const drop=drawCosmetic(next.wardrobe,next.character.body,roll,roll<.30?rng():0);
   if(drop?.item){next.wardrobe.push(drop.item.id);message+=` Novo cosmético: ${drop.item.name}! Veja no Personagem.`;}
   else if(drop?.bonusGold){next.gold+=drop.bonusGold;message+=` Coleção completa! +${drop.bonusGold} Gold extra.`;}
  }else if(action.status==='done')message='Concluída. A recompensa desta missão já foi recebida.';
  next.tasks=next.tasks.filter(t=>t.id!==task.id);const index=action.beforeId?next.tasks.findIndex(t=>t.id===action.beforeId):-1;
  if(index>=0)next.tasks.splice(index,0,task);else next.tasks.push(task);
 }
 if(action.type==='columnAdd'){if(next.columns.length>=12)throw Error('Limite de 12 etapas alcançado.');next.columns.push({id:uuid(),title:action.title});message='Etapa criada.';}
 if(action.type==='columnRename'){const column=next.columns.find(c=>c.id===action.id);if(!column)throw Error('Etapa não encontrada.');column.title=action.title;message='Nome da etapa salvo.';}
 if(action.type==='columnMove'){const index=next.columns.findIndex(c=>c.id===action.id);if(index<0)throw Error('Etapa não encontrada.');if(action.beforeId===action.id)return {state,message:'Posição mantida.'};const column=next.columns.splice(index,1)[0];const target=action.beforeId?next.columns.findIndex(c=>c.id===action.beforeId):-1;if(action.beforeId&&target<0)throw Error('Posição de destino inválida.');next.columns.splice(target<0?next.columns.length:target,0,column);message='Etapa reorganizada.';}
 if(action.type==='columnRemove'){if(statuses.includes(action.id as typeof statuses[number]))throw Error('As etapas principais não podem ser removidas.');if(next.tasks.some(t=>t.status===action.id))throw Error('Mova as missões desta etapa antes de removê-la.');const count=next.columns.length;next.columns=next.columns.filter(c=>c.id!==action.id);if(next.columns.length===count)throw Error('Etapa não encontrada.');message='Etapa removida.';}
 if(action.type==='schedule'){const task=next.tasks.find(t=>t.id===action.id);if(!task)throw Error('Tarefa não encontrada.');task.schedule=action.schedule;message=action.schedule?'Missão agendada.':'Agendamento removido.';}
 if(action.type==='calendarImport'){if(next.calendar.imports.some(s=>s.text===action.source.text))throw Error('Este arquivo já foi importado.');if(next.calendar.imports.length>=5)throw Error('Remova uma agenda antes de importar outra (limite: 5).');next.calendar.imports.push(action.source);message='Agenda importada. Eventos externos não concedem recompensas.';}
 if(action.type==='calendarRemove'){next.calendar.imports=next.calendar.imports.filter(s=>s.id!==action.id);message='Agenda importada removida.';}
 if(action.type==='googleCalendar'){next.calendar.google=action.google;message=action.google?'Agenda pública configurada.':'Agenda Google desconectada.';}
 if(action.type==='buy'){const item=items.find(i=>i.id===action.id)!;if(next.gold<item.price)throw Error('Gold insuficiente para esta compra.');next.gold-=item.price;addItem(item.id);message=`${item.name} adicionado ao inventário.`;}
 if(action.type==='character'){next.character=normalizeCharacter({...next.character,...action.appearance},next.wardrobe);message='Personagem salvo.';}
 if(action.type==='equip'){const item=cosmetics.find(i=>i.id===action.id);if(!item||!next.wardrobe.includes(item.id))throw Error('Conquiste esta peça antes de equipá-la.');if(!fits(item,next.character.body))throw Error('Esta peça não é compatível com a base atual.');next.character.equipment[item.slot]=item.id;message=`${item.name} equipado.`;}
 if(action.type==='unequip'){next.character.equipment[action.slot]=undefined;message='Peça removida.';}
 if(action.type==='theme'){next.theme=action.theme;message='Tema personalizado salvo.';}
 return {state:stateSchema.parse(next),message};
}
