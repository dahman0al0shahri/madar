// Shared by every current/future lab. Resizing never recreates the renderer or lab state.
const expandWorkspace=document.createElement('button');
expandWorkspace.id='ml-workspace-fullscreen';expandWorkspace.type='button';
expandWorkspace.setAttribute('aria-controls','ml-workspace');
workspaceBar.prepend(expandWorkspace);
let workspaceExpanded=false,workspaceNative=false,workspaceScroll=0,previousBodyOverflow='';
function workspaceDisplayLabel(){
 expandWorkspace.textContent=workspaceExpanded?'↙ رجوع':'⛶ ملء الشاشة';
 expandWorkspace.setAttribute('aria-label',workspaceExpanded?'الخروج من ملء الشاشة':'ملء الشاشة لمساحة المحاكي');
 expandWorkspace.setAttribute('aria-pressed',String(workspaceExpanded));
 expandWorkspace.title=workspaceExpanded?'الخروج من ملء الشاشة — Esc':'توسيع مساحة المحاكي';
}
function setWorkspaceExpanded(value){
 if(workspaceExpanded===value)return;
 if(value){workspaceScroll=window.scrollY;previousBodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}
 workspaceExpanded=value;root.classList.toggle('ml-workspace-expanded',value);
 if(!value){document.body.style.overflow=previousBodyOverflow;workspaceNative=false;}
 workspaceDisplayLabel();
 if(window.parent!==window)window.parent.postMessage({type:'madar-workspace-expanded',expanded:value},location.origin);
 if(value)root.scrollTop=0;
 else {window.scrollTo(0,workspaceScroll);expandWorkspace.focus({preventScroll:true});}
}
expandWorkspace.addEventListener('click',async()=>{
 if(workspaceExpanded){
  if(document.fullscreenElement===root){try{await document.exitFullscreen();}catch{setWorkspaceExpanded(false);}}
  else setWorkspaceExpanded(false);
  return;
 }
 setWorkspaceExpanded(true);
 // Fullscreen on the common root retains dialogs, device controls and their handlers.
 if(root.requestFullscreen&&document.fullscreenEnabled){
  try{await root.requestFullscreen();workspaceNative=document.fullscreenElement===root;}
  catch{/* Fixed viewport is the supported fallback, including mobile browsers. */}
 }
});
document.addEventListener('fullscreenchange',()=>{
 if(document.fullscreenElement===root){workspaceNative=true;setWorkspaceExpanded(true);}
 else if(workspaceNative)setWorkspaceExpanded(false);
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&workspaceExpanded&&!root.querySelector('dialog[open]')){
  e.preventDefault();
  if(document.fullscreenElement===root)document.exitFullscreen().catch(()=>setWorkspaceExpanded(false));
  else setWorkspaceExpanded(false);
 }
});
workspaceDisplayLabel();
