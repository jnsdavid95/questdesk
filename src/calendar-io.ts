import ICAL from 'ical.js';
import type {EventInput} from '@fullcalendar/core';
import type {Task} from './domain';
import type {Schedule} from './calendar-model';
export function localDate(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function taskEvent(task:Task):EventInput|null{
 const s=task.schedule;if(!s)return null;
 const start=s.time?`${s.date}T${s.time}:00`:s.date;
 return {id:`task:${task.id}`,title:task.title,start,end:s.time?new Date(new Date(start).getTime()+s.minutes*60000):undefined,allDay:!s.time,editable:true,extendedProps:{taskId:task.id,origin:'Missão'},classNames:task.status==='done'?['calendar-done']:[],backgroundColor:task.status==='done'?'#497c72':'#a4e0cf',borderColor:'transparent',textColor:'#14262b'};
}
export function scheduleFromEvent(start:Date,allDay:boolean,end:Date|null):Schedule{return {date:localDate(start),time:allDay?undefined:`${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}`,minutes:allDay?60:Math.max(15,Math.min(1440,Math.round(((end?.getTime()??start.getTime()+3600000)-start.getTime())/60000)))};}
export function exportTasks(tasks:Task[]){
 const calendar=new ICAL.Component(['vcalendar',[],[]]);calendar.addPropertyWithValue('version','2.0');calendar.addPropertyWithValue('prodid','-//QuestDesk//Agenda 0.3//PT-BR');
 for(const task of tasks){if(!task.schedule)continue;const s=task.schedule;const component=new ICAL.Component('vevent');component.addPropertyWithValue('uid',`${task.id}@questdesk.local`);component.addPropertyWithValue('dtstamp',ICAL.Time.fromJSDate(new Date(),true));component.addPropertyWithValue('summary',task.title);component.addPropertyWithValue('description',task.description);
 if(s.time){const start=new Date(`${s.date}T${s.time}:00`);component.addPropertyWithValue('dtstart',ICAL.Time.fromJSDate(start,true));component.addPropertyWithValue('dtend',ICAL.Time.fromJSDate(new Date(start.getTime()+s.minutes*60000),true));}
 else {const start=ICAL.Time.fromDateString(s.date),end=start.clone();end.adjust(1,0,0,0);component.addPropertyWithValue('dtstart',start);component.addPropertyWithValue('dtend',end);}
 calendar.addSubcomponent(component);
 }return calendar.toString()+'\r\n';
}
export function parseCalendar(text:string){
 if(text.length>1000000)throw Error('O arquivo deve ter até 1 MB.');
 let root:ICAL.Component;try{root=new ICAL.Component(ICAL.parse(text));}catch{throw Error('Arquivo iCalendar inválido. Escolha um arquivo .ics.');}
 if(root.name!=='vcalendar'||!root.getAllSubcomponents('vevent').length)throw Error('O arquivo não contém eventos VEVENT.');
 ICAL.TimezoneService.reset();for(const zone of root.getAllSubcomponents('vtimezone'))ICAL.TimezoneService.register(zone);
 for(const event of root.getAllSubcomponents('vevent'))for(const field of ['dtstart','dtend','recurrence-id']){const property=event.getFirstProperty(field);const tz=property?.getParameter('tzid');if(tz&&typeof tz==='string'&&!ICAL.TimezoneService.has(tz))throw Error(`Fuso ${tz} sem definição VTIMEZONE. Exporte a agenda em UTC ou inclua os fusos.`);}
 return root;
}
export function importEvents(text:string,sourceId:string,sourceName:string,rangeStart:Date,rangeEnd:Date):EventInput[]{
 const root=parseCalendar(text),result:EventInput[]=[];const seen=new Set<string>();let steps=0;
 const add=(event:ICAL.Event,start:ICAL.Time,end:ICAL.Time,identity:string)=>{
  if(event.component.getFirstPropertyValue('status')==='CANCELLED')return;
  const from=start.toJSDate(),to=end.toJSDate();if(from>=rangeEnd||(to>from?to<=rangeStart:from<rangeStart))return;
  const id=`ics:${sourceId}:${event.uid}:${identity}`;if(seen.has(id))return;seen.add(id);
  if(result.length>=2000)throw Error('Muitos eventos nesta visualização. Use uma agenda menor.');
  result.push({id,title:event.summary||'Evento sem título',start:start.isDate?start.toString():from,end:end.isDate?end.toString():to,allDay:start.isDate,editable:false,backgroundColor:'#b5a3df',borderColor:'transparent',textColor:'#20172f',extendedProps:{origin:sourceName,description:event.description||''}});
 };
 const components=root.getAllSubcomponents('vevent');
 // Exceptions are evaluated independently, including occurrences moved into the visible range.
 for(const component of components){const e=new ICAL.Event(component);if(e.isRecurrenceException()&&component.getFirstPropertyValue('status')!=='CANCELLED')add(e,e.startDate,e.endDate,e.recurrenceId.toString());}
 for(const component of components){const event=new ICAL.Event(component);if(event.isRecurrenceException()||component.getFirstPropertyValue('status')==='CANCELLED')continue;
 if(!event.isRecurring()){add(event,event.startDate,event.endDate,event.startDate.toString());continue;}
 const iterator=event.iterator();let occurrence;
 while((occurrence=iterator.next())){if(++steps>20000)throw Error('Recorrência extensa demais para esta versão. Exporte um intervalo menor.');if(occurrence.toJSDate()>=rangeEnd)break;const detail=event.getOccurrenceDetails(occurrence);add(detail.item,detail.startDate,detail.endDate,occurrence.toString());}
 }return result;
}
export function downloadICS(tasks:Task[]){const url=URL.createObjectURL(new Blob([exportTasks(tasks)],{type:'text/calendar;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='QuestDesk_Missoes.ics';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
