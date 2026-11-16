import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../modules/madar-hub/global-space.js',import.meta.url),'utf8');
function boot({reduced=false,saved=null,blocked=false}={}){
  const events={},children=[],storage=new Map(saved?[['madar:space-motion:v1',saved]]:[]);
  const ctx={setTransform(){},fillRect(){},beginPath(){},arc(){},fill(){},putImageData(){},drawImage(){},createImageData(w,h){return{data:new Uint8ClampedArray(w*h*4)};}};
  function element(){return{style:{},dataset:{},attributes:{},listeners:{},append(...items){children.push(...items);},replaceChildren(){},remove(){},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,v){this.listeners[k]=v;},getContext(){return ctx;}};}
  const sky=element();sky.clientWidth=20;sky.clientHeight=20;sky.querySelector=()=>null;
  const root=element();root.dataset.course='global';root.querySelector=()=>sky;
  const document={hidden:false,getElementById:()=>root,createElement:element,addEventListener(k,v){events[k]=v;},removeEventListener(){}};
  const preference={matches:reduced,addEventListener(k,v){events.preference=v;},removeEventListener(){}};
  vm.runInNewContext(source,{document,devicePixelRatio:3,matchMedia:()=>preference,localStorage:{getItem(k){if(blocked)throw Error();return storage.get(k);},setItem(k,v){if(blocked)throw Error();storage.set(k,v);}},MutationObserver:class{constructor(cb){events.route=cb;}observe(){}disconnect(){}},addEventListener(k,v){events[k]=v;},removeEventListener(){},setTimeout(fn){fn();return 1;},clearTimeout(){}});
  return{sky,root,document,preference,events,storage,button:children.find(x=>x.className==='mh-space-motion'),canvas:children.find(x=>x.className==='mh-space-field')};
}
const a=boot();assert.equal(a.sky.dataset.motion,'running');assert.equal(a.canvas.width,40);
a.button.listeners.click();assert.equal(a.sky.dataset.motion,'paused');assert.equal(a.storage.get('madar:space-motion:v1'),'paused');
assert.equal(boot({saved:'paused'}).sky.dataset.motion,'paused');
a.button.listeners.click();a.root.dataset.course='network';a.events.route();assert.equal(a.sky.dataset.motion,'paused');assert.equal(a.button.hidden,true);
a.root.dataset.course='global';a.events.route();assert.equal(a.sky.dataset.motion,'running');assert.equal(a.button.hidden,false);
a.document.hidden=true;a.events.visibilitychange();assert.equal(a.sky.dataset.motion,'paused');a.document.hidden=false;a.events.visibilitychange();assert.equal(a.sky.dataset.motion,'running');
const r=boot({reduced:true});assert.equal(r.sky.dataset.motion,'paused');assert.equal(r.button.disabled,true);r.preference.matches=false;r.events.preference();assert.equal(r.sky.dataset.motion,'running');
const b=boot({blocked:true});b.button.listeners.click();assert.equal(b.sky.dataset.motion,'paused');
console.log('PASS: render resolution, manual pause, persisted pause, course isolation, visibility, reduced motion, blocked storage.');
