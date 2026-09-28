import { app, BrowserWindow, ipcMain } from 'electron';
import { readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, randomInt } from 'node:crypto';
import { initialState, reduce, stateSchema } from '../src/domain';
let window:BrowserWindow|null=null;
let queue:Promise<unknown>=Promise.resolve();
const file=()=>path.join(app.getPath('userData'),'questdesk-v1.json');
async function load(){try{return stateSchema.parse(JSON.parse(await readFile(file(),'utf8')));}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return initialState();throw Error('Não foi possível ler o progresso. O arquivo original foi preservado.');}}
function verify(event:Electron.IpcMainInvokeEvent){if(!window||event.sender!==window.webContents||event.senderFrame!==window.webContents.mainFrame)throw Error('Origem inválida.');}
const locked=app.requestSingleInstanceLock();
if(!locked)app.quit();else{
 app.on('second-instance',()=>{window?.show();window?.focus();});
 app.whenReady().then(()=>{
  ipcMain.handle('questdesk:load',event=>{verify(event);return queue.then(load);});
  ipcMain.handle('questdesk:dispatch',(event,action)=>{verify(event);const operation=queue.then(async()=>{
   const result=reduce(await load(),action,()=>randomInt(1000000)/1000000,randomUUID);
   await writeFile(file()+'.tmp',JSON.stringify(result.state),'utf8');await rename(file()+'.tmp',file());return result;
  });queue=operation.catch(()=>{});return operation;});
  const create=()=>{window=new BrowserWindow({width:1440,height:940,minWidth:1000,minHeight:700,backgroundColor:'#101419',autoHideMenuBar:true,title:'QuestDesk',webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
   window.webContents.setWindowOpenHandler(()=>({action:'deny'}));window.webContents.on('will-navigate',event=>event.preventDefault());
   window.on('closed',()=>{window=null;});window.loadFile(path.join(__dirname,'../dist/index.html'));
  };create();app.on('activate',()=>{if(!window)create();});
 });
 app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
}
