function toast(t){$('#ml-toast').textContent=t;$('#ml-toast').hidden=false;}
// A tall embedded lab has a much larger viewport than the portion its user sees.
// Keep dialogs inside the intersection with the host viewport, not iframe centre.
function dialogViewport(){
 const v=window.visualViewport;let left=v?.offsetLeft||0,top=v?.offsetTop||0,right=left+(v?.width||innerWidth),bottom=top+(v?.height||innerHeight);
 try{if(window.frameElement&&parent!==window){const r=frameElement.getBoundingClientRect(),pv=parent.visualViewport,px=pv?.offsetLeft||0,py=pv?.offsetTop||0;left=Math.max(left,px-r.left);top=Math.max(top,py-r.top);right=Math.min(right,px+(pv?.width||parent.innerWidth)-r.left);bottom=Math.min(bottom,py+(pv?.height||parent.innerHeight)-r.top);}}catch{/* Independent previews can have a cross-origin host. */}
 return {left:left+12,top:top+12,width:Math.max(160,right-left-24),height:Math.max(80,bottom-top-24)};
}
function positionDialog(){
 const v=dialogViewport(),menu=!!body.querySelector('#ml-new-empty'),width=Math.min(menu?420:680,v.width);dialog.style.width=width+'px';dialog.style.maxHeight=v.height+'px';
 const height=Math.min(dialog.offsetHeight||320,v.height),anchor=lastFocus?.isConnected?lastFocus.getBoundingClientRect():null;
 let left=v.left+(v.width-width)/2,top=v.top+(v.height-height)/2;
 if(anchor&&v.width>540){left=Math.max(v.left,Math.min(anchor.right-width,v.left+v.width-width));if(anchor.bottom+10+height<=v.top+v.height)top=Math.max(v.top,anchor.bottom+10);else if(anchor.top-10-height>=v.top)top=anchor.top-10-height;}
 dialog.style.left=left+'px';dialog.style.top=Math.max(v.top,top)+'px';
}
let dialogPositionFrame=0;
function queueDialogPosition(){if(!dialog.open||dialogPositionFrame)return;dialogPositionFrame=requestAnimationFrame(()=>{dialogPositionFrame=0;positionDialog();});}
for(const target of [window,window.visualViewport])if(target){target.addEventListener('resize',queueDialogPosition);target.addEventListener('scroll',queueDialogPosition,{passive:true});}
try{if(parent!==window){parent.addEventListener('scroll',queueDialogPosition,{passive:true});parent.addEventListener('resize',queueDialogPosition);parent.visualViewport?.addEventListener('resize',queueDialogPosition);parent.visualViewport?.addEventListener('scroll',queueDialogPosition,{passive:true});}}catch{}
const dialogResizeObserver=new ResizeObserver(queueDialogPosition);dialogResizeObserver.observe(dialog);
window.addEventListener('pagehide',()=>{dialogResizeObserver.disconnect();cancelAnimationFrame(dialogPositionFrame);try{if(parent!==window){parent.removeEventListener('scroll',queueDialogPosition);parent.removeEventListener('resize',queueDialogPosition);parent.visualViewport?.removeEventListener('resize',queueDialogPosition);parent.visualViewport?.removeEventListener('scroll',queueDialogPosition);}}catch{}},{once:true});
function modal(title,html){dialog.removeAttribute('aria-describedby');const fresh=!dialog.open;if(fresh)lastFocus=document.activeElement;$('#ml-dialog-title').textContent=title;body.innerHTML=html;dialog.dataset.menu=String(!!body.querySelector('#ml-new-empty'));icons();positionDialog();if(fresh)dialog.showModal();positionDialog();$('#ml-dialog-close').focus({preventScroll:true});}
function close(){dialog.close();lastFocus?.isConnected&&lastFocus.focus({preventScroll:true});}
$('#ml-dialog-close').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();});
