import { initialState, reduce, stateSchema, type Action, type State } from './domain';
export type Result={state:State;message:string};
declare global {interface Window {questdesk?:{load:()=>Promise<State>;dispatch:(action:Action)=>Promise<Result>}}}
const key='questdesk.v1';
function loadLocal(){const raw=localStorage.getItem(key);return raw?stateSchema.parse(JSON.parse(raw)):initialState();}
export const storage={
 load:async()=>window.questdesk?window.questdesk.load():loadLocal(),
 dispatch:async(action:Action)=>{if(window.questdesk)return window.questdesk.dispatch(action);const result=reduce(loadLocal(),action);localStorage.setItem(key,JSON.stringify(result.state));return result;}
};
