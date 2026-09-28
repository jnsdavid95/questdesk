import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('questdesk',{load:()=>ipcRenderer.invoke('questdesk:load'),dispatch:(action:unknown)=>ipcRenderer.invoke('questdesk:dispatch',action)});
