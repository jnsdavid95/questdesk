import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,reduce,progression,stateSchema} from '../src/domain';
test('conclusão credita EXP/Gold uma vez, inclusive após reabrir e recarregar',()=>{
 let s=initialState();s=reduce(s,{type:'move',id:'welcome-1',status:'done'},()=>.5).state;
 assert.equal(s.xp,25);assert.equal(s.gold,10);
 s=stateSchema.parse(JSON.parse(JSON.stringify(s)));s=reduce(s,{type:'move',id:'welcome-1',status:'todo'}).state;
 s=reduce(s,{type:'move',id:'welcome-1',status:'done'},()=>0).state;
 assert.equal(s.xp,25);assert.equal(s.gold,10);assert.equal(s.inventory.length,0);
});
test('múltiplos níveis preservam experiência excedente',()=>{assert.deepEqual(progression(250),{level:3,current:0,goal:200});assert.deepEqual(progression(270),{level:3,current:20,goal:200});});
test('compra não permite saldo negativo nem altera estado ao falhar',()=>{const s=initialState();assert.throws(()=>reduce(s,{type:'buy',id:'ember'}));assert.equal(s.gold,0);s.gold=120;const result=reduce(reduce(s,{type:'buy',id:'ember'}).state,{type:'buy',id:'ember'}).state;assert.equal(result.gold,0);assert.equal(result.inventory[0].quantity,2);});
test('ordenação move card antes do destino e não duplica tarefas',()=>{const s=reduce(initialState(),{type:'move',id:'welcome-2',status:'todo',beforeId:'welcome-1'}).state;assert.deepEqual(s.tasks.map(t=>t.id),['welcome-2','welcome-1']);assert.equal(s.xp,0);});
test('entrada inválida é rejeitada e dificuldade fica congelada após recompensa',()=>{const original=initialState();assert.throws(()=>reduce(original,{type:'add',title:' ',description:'',difficulty:'easy'}));let s=reduce(original,{type:'move',id:'welcome-1',status:'done'},()=>.5).state;s=reduce(s,{type:'edit',id:'welcome-1',title:'Novo título',description:'',difficulty:'hard'}).state;assert.equal(s.tasks.find(t=>t.id==='welcome-1')?.difficulty,'easy');assert.throws(()=>stateSchema.parse({...s,version:2}));});
