// A script-free, local visual copy of the live viewport. Never captures the desktop.
// New same-origin UI is mirrored automatically; no duplicate application or storage runs.
window.MadarPageReflection=(()=>{
 let host=null,view=null,active=false,timer=0,last=0,revision=0;
 const documents=new Map(),canvasTargets=new Map(),glPatches=[],stats={updates:0,documents:0,canvases:0,lastMs:0};
 const blocked=new Set(['SCRIPT','TEMPLATE','NOSCRIPT','OBJECT','EMBED','BASE']);
 function attrs(source,target){
  const names=new Set(target.tagName==='CANVAS'?['width','height']:[]);
  for(const a of source.attributes){const k=a.name.toLowerCase();if((target.tagName==='CANVAS'&&['width','height'].includes(k))||k.startsWith('on')||k==='autofocus'||k==='srcdoc'||k==='nonce'||k==='integrity'||k==='autoplay'||k==='sandbox'||(source.tagName==='IFRAME'&&k==='src')||(k==='href'&&/^javascript:/i.test(a.value)))continue;names.add(a.name);if(target.getAttribute(a.name)!==a.value)target.setAttribute(a.name,a.value);}
  for(const a of [...target.attributes])if(!names.has(a.name)&&a.name!=='data-reflection-node')target.removeAttribute(a.name);
  if(source.tagName==='IFRAME'){target.setAttribute('sandbox','allow-same-origin');target.setAttribute('tabindex','-1');}
 }
 function paint(source,target){if(!active||!source.isConnected||!target.isConnected||!source.width||!source.height)return;try{const ratio=Math.min(1,960/source.width,720/source.height),w=Math.max(1,Math.round(source.width*ratio)),h=Math.max(1,Math.round(source.height*ratio));if(target.width!==w)target.width=w;if(target.height!==h)target.height=h;const c=target.getContext('2d');c.clearRect(0,0,w,h);c.drawImage(source,0,0,w,h);}catch{/* Cross-origin pixels cannot be copied. */}}
 function watchGL(win){
  if(glPatches.some(p=>p.win===win))return;
  const changes=[];
  for(const type of ['WebGLRenderingContext','WebGL2RenderingContext']){const proto=win[type]?.prototype;if(!proto)continue;
   for(const name of ['clear','drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced','drawRangeElements']){
    if(!Object.hasOwn(proto,name)||typeof proto[name]!=='function')continue;const original=proto[name];
    const wrapped=function(...args){const result=Reflect.apply(original,this,args),entry=canvasTargets.get(this.canvas);if(active&&entry&&!entry.queued&&performance.now()-(entry.last||0)>50){entry.queued=true;win.queueMicrotask(()=>{entry.queued=false;if(canvasTargets.get(this.canvas)===entry){entry.last=performance.now();paint(this.canvas,entry.target);}});}return result;};
    try{proto[name]=wrapped;changes.push({proto,name,original,wrapped});}catch{}
   }
  }
  glPatches.push({win,changes});
 }
 function mirrorDocument(source,target){
  let record=documents.get(source);
  if(!record||record.target!==target){
   record={source,target,map:new WeakMap(),scroll:[]};documents.set(source,record);target.head.replaceChildren();target.body.replaceChildren();
   const base=target.createElement('base');base.href=source.baseURI;target.head.append(base);record.base=base;
   const style=target.createElement('style');style.textContent='html{scroll-behavior:auto!important}body{pointer-events:none!important}*{caret-color:transparent!important}';record.style=style;watchGL(source.defaultView);
  }
  attrs(source.documentElement,target.documentElement);attrs(source.body,target.body);target.body.inert=true;record.scroll=[];
  syncChildren(source.head,target.head,record,[record.base]);target.head.append(record.style);
  syncChildren(source.body,target.body,record);
  for(const [a,b]of record.scroll){b.scrollTop=a.scrollTop;b.scrollLeft=a.scrollLeft;}
  target.defaultView.scrollTo(source.defaultView.scrollX,source.defaultView.scrollY);
  if(record.needsPaint){record.needsPaint=false;source.defaultView.dispatchEvent(new source.defaultView.Event('madar-reflection-refresh'));}
  // Show dialogs/popovers in the same top layer without activating any app logic.
  for(const a of source.querySelectorAll('dialog[open],[popover]')){const b=record.map.get(a);if(!b)continue;try{if(a.matches(':modal')&&!b.matches(':modal')){b.removeAttribute('open');b.showModal();}else if(a.matches(':popover-open')&&!b.matches(':popover-open'))b.showPopover();else if(!a.matches(':popover-open')&&b.matches(':popover-open'))b.hidePopover();}catch{}}
  return record;
 }
 function skip(n){return n.nodeType===1&&(blocked.has(n.tagName)||n.hasAttribute('data-page-reflection')||(n.tagName==='LINK'&&n.rel!=='stylesheet')||(n.tagName==='META'&&n.httpEquiv));}
 function syncChildren(source,target,record,prefix=[]){
  let at=target.firstChild;for(const fixed of prefix){if(at!==fixed)target.insertBefore(fixed,at);at=fixed.nextSibling;}
  for(const n of source.childNodes){if(skip(n)||![1,3].includes(n.nodeType))continue;
   let copy=record.map.get(n);if(!copy){copy=n.nodeType===3?record.target.createTextNode(n.data):record.target.createElementNS(n.namespaceURI,n.tagName==='VIDEO'||n.id==='mh-network-background'?'canvas':n.localName);record.map.set(n,copy);}
   if(at!==copy)target.insertBefore(copy,at);at=copy.nextSibling;
   if(n.nodeType===3){if(copy.data!==n.data)copy.data=n.data;continue;}
   attrs(n,copy);
   if(n.id==='mh-network-background'){
    const background=n.contentDocument?.querySelector('.net-stage>canvas');if(background)paint(background,copy);
   }else if(n.tagName==='IFRAME'){
    try{const doc=n.contentDocument;if(doc?.body&&copy.contentDocument?.body)mirrorDocument(doc,copy.contentDocument);}catch{}
   }else if(n.tagName==='CANVAS'){
    const size=n.ownerDocument.defaultView.getComputedStyle(n);copy.style.width=size.width;copy.style.height=size.height;
    let entry=canvasTargets.get(n);if(!entry||entry.target!==copy){entry={target:copy,queued:false};canvasTargets.set(n,entry);paint(n,copy);record.needsPaint=true;}
    // WebGL pixels are copied at the end of the drawing task, before its buffer is cleared.
    if(n.getContext('2d'))paint(n,copy);
   }else if(n.tagName==='VIDEO'){
    try{copy.width=n.videoWidth||n.clientWidth;copy.height=n.videoHeight||n.clientHeight;copy.getContext('2d').drawImage(n,0,0,copy.width,copy.height);}catch{}
   }else{
    syncChildren(n,copy,record);
    if('value'in n&&n.tagName!=='LI'&&copy.value!==n.value)copy.value=n.value;
    if('checked'in n)copy.checked=n.checked;if('selected'in n)copy.selected=n.selected;
    if(n.shadowRoot){const shadow=copy.shadowRoot||copy.attachShadow({mode:'open'});syncChildren(n.shadowRoot,shadow,record);}
   }
   if(n.scrollHeight>n.clientHeight||n.scrollWidth>n.clientWidth)record.scroll.push([n,copy]);
   // Match animation phase instead of restarting animations on each visual update.
   const animations=n.getAnimations?.()||[],copies=copy.getAnimations?.()||[];animations.forEach((a,i)=>{if(!copies[i])return;try{copies[i].pause();copies[i].currentTime=a.currentTime;}catch{}});
  }
  while(at){const next=at.nextSibling;at.remove();at=next;}
 }
 function layout(){if(!host||!view)return;const w=innerWidth,h=innerHeight,s=Math.min(host.clientWidth/w,host.clientHeight/h);view.style.cssText=`position:absolute;border:0;margin:0;max-width:none;width:${w}px;height:${h}px;left:${(host.clientWidth-w*s)/2}px;top:${(host.clientHeight-h*s)/2}px;transform-origin:0 0;transform:scale(${s});pointer-events:none;z-index:2;background:#090b0e;`;}
 function tick(){timer=0;if(!active||document.hidden||!host?.isConnected)return;const started=performance.now();
  try{layout();if(view.contentDocument?.body){mirrorDocument(document,view.contentDocument);revision++;view.dataset.revision=String(revision);}
   for(const [source,record]of documents)if(source!==document&&(!source.defaultView?.frameElement?.isConnected||source.defaultView.document!==source))documents.delete(source);
   for(const [source,entry]of canvasTargets)if(!source.isConnected||!entry.target.isConnected)canvasTargets.delete(source);
   stats.updates++;stats.documents=documents.size;stats.canvases=canvasTargets.size;stats.lastMs=performance.now()-started;
  }catch(error){console.warn('Page reflection:',error);}
  last=performance.now();timer=setTimeout(tick,Math.max(100,stats.lastMs*4));
 }
 function stop(){active=false;clearTimeout(timer);timer=0;for(const p of glPatches)for(const c of p.changes)if(c.proto[c.name]===c.wrapped)c.proto[c.name]=c.original;glPatches.length=0;canvasTargets.clear();documents.clear();view?.remove();view=null;host=null;}
 function start(frame){const screen=frame.contentDocument?.querySelector('.self-screen');if(!screen)return;if(host!==screen){stop();host=screen;host.querySelector('.mirror-surface').hidden=true;view=host.ownerDocument.createElement('iframe');view.setAttribute('sandbox','allow-same-origin');view.setAttribute('aria-hidden','true');view.setAttribute('tabindex','-1');view.setAttribute('data-page-reflection','');view.title='انعكاس الصفحة';host.append(view);view.onload=()=>{if(active){clearTimeout(timer);tick();}};}
  active=true;clearTimeout(timer);tick();
 }
 document.addEventListener('visibilitychange',()=>{clearTimeout(timer);timer=0;if(active&&!document.hidden)tick();});addEventListener('pagehide',stop);
 return {start,stop,refresh:()=>{if(active&&performance.now()-last>50){clearTimeout(timer);tick();}},stats:()=>({...stats,active,revision})};
}).call(null);
