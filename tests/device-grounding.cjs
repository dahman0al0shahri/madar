const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const three={console:{warn(){}},exports:{},module:{exports:{}}};vm.createContext(three);vm.runInContext(fs.readFileSync('public/vendor/three-0.160.0.min.js','utf8'),three);const T=three.exports;
const html=fs.readFileSync('modules/network-diagnosis-preview/free-workspace.html','utf8');
const start=html.indexOf('window.madarDeviceFactory='),end=html.indexOf('</script>',start);
const ctx=new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{})});
const sandbox={window:{},document:{createElement:()=>({width:0,height:0,getContext:()=>ctx})},T,floor:{position:{y:-.015}},grid:{position:{y:.002}}};vm.createContext(sandbox);vm.runInContext(html.slice(start,end),sandbox);vm.runInContext(fs.readFileSync('modules/network-tabs-preview/device-grounding.js','utf8'),sandbox);
const models=sandbox.window.madarDeviceFactory(T).models,results=[];
for(const [id,base] of Object.entries(models)){
 for(const [name,height] of [['new',0],['legacy-sunken',-.2],['valid-height',2]]){
  const g=base.clone(true);g.position.set(-6,height,4);g.rotation.y=id==='R1'?Math.PI:Math.PI/8;g.updateMatrixWorld(true);
  const before=new T.Box3().setFromObject(g).min.y;sandbox.seatDeviceAboveFloor(g);const after=new T.Box3().setFromObject(g).min.y;
  assert(after>=.004-1e-7,id+' '+name+' must clear floor and grid');assert.equal(g.position.x,-6);assert.equal(g.position.z,4);if(before>=.004)assert.equal(g.position.y,height);
  const saved=g.position.toArray();sandbox.seatDeviceAboveFloor(g);assert.deepEqual(g.position.toArray(),saved,'no cumulative lift on restore');
  // Ports share the same group transform; moving the body must move the endpoint.
  const point=new T.Vector3(.1,.2,.3);assert(Math.abs(g.localToWorld(point.clone()).y-(g.position.y+.2))<1e-7);
  results.push({id,case:name,before,after,height:g.position.y});
 }
}
const built=fs.readFileSync('lib/network-simulator.html','utf8');assert(built.includes('seatDeviceAboveFloor(g);'),'production artifact contains placement repair');
console.log(JSON.stringify({passed:results.length,results},null,2));
