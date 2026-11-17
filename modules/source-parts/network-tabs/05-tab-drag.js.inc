function dragPosition(){
 const d=dragTab;if(!d?.started)return;
 const v=$('#ml-viewport').getBoundingClientRect(),bar=tabBar.getBoundingClientRect();
 d.valid=d.y>=bar.top-24&&d.y<=bar.bottom+24&&d.x>=v.left-$('#ml-next').offsetWidth&&d.x<=v.right+$('#ml-back').offsetWidth;
 dropMark.hidden=!d.valid;d.ghost.hidden=!d.valid;if(!d.valid)return;
 const x=Math.max(v.left,Math.min(v.right,d.x)),nodes=[...$('#ml-track').children].filter(b=>b.dataset.id!==d.id);
 // DOM order is right-to-left: the right half inserts before, the left half after.
 let index=nodes.findIndex(b=>{const r=b.getBoundingClientRect();return x>r.left+r.width/2;});
 if(index<0)index=nodes.length;d.index=index;
 const edge=index<nodes.length?nodes[index].getBoundingClientRect().right+4:nodes.length?nodes.at(-1).getBoundingClientRect().left-4:v.right;
 dropMark.style.left=(Math.max(v.left+2,Math.min(v.right-2,edge))-bar.left)+'px';
 d.ghost.style.left=(Math.max(0,Math.min(bar.width-d.ghost.offsetWidth,x-bar.left-d.ghost.offsetWidth/2)))+'px';
 d.ghost.style.top=(bar.height+5)+'px';
}
function dragScroll(now){
 const d=dragTab;if(!d?.started)return;
 dragPosition();const v=$('#ml-viewport').getBoundingClientRect(),edge=Math.min(24,v.width/4);
 const delta=d.valid?(d.x<v.left+edge?1:d.x>v.right-edge?-1:0):0;
 if(delta&&now-d.lastScroll>420){offset+=delta;scrollTabs(true);d.lastScroll=now;dragPosition();}
 d.frame=requestAnimationFrame(dragScroll);
}
function finishTabDrag(commit=false){
 const d=dragTab;if(!d)return;dragTab=null;cancelAnimationFrame(d.frame);
 d.button.classList.remove('ml-drag-source');root.classList.remove('ml-dragging');d.ghost?.remove();dropMark.hidden=true;
 if(d.button.hasPointerCapture(d.pointer))d.button.releasePointerCapture(d.pointer);
 if(!d.started)return;suppressTabClickUntil=performance.now()+500;
 if(commit&&d.valid){
  const before=visible(),after=before.filter(x=>x.id!==d.id);after.splice(d.index,0,lab(d.id));
  if(before.some((x,i)=>x.id!==after[i].id)){
   let i=0;state.labs=state.labs.map(x=>x.kind==='scratch'&&!x.hidden?after[i++]:x);
   changed();renderTabs();ensureVisible(d.id,true);toast('تم ترتيب التبويب؛ جارٍ حفظ ترتيب مختبراتك.');
  }
 }
}
function beginTabDrag(e,b){
 if(!e.isPrimary||e.button!==0||dragTab)return;
 dragTab={id:b.dataset.id,button:b,pointer:e.pointerId,x0:e.clientX,y0:e.clientY,x:e.clientX,y:e.clientY,started:false,lastScroll:performance.now()};
 b.setPointerCapture(e.pointerId);
}
function moveTabDrag(e){
 const d=dragTab;if(!d||e.pointerId!==d.pointer)return;d.x=e.clientX;d.y=e.clientY;
 if(!d.started){
  const dx=Math.abs(d.x-d.x0),dy=Math.abs(d.y-d.y0);
  if(dy>10&&dy>dx){finishTabDrag();return;}if(dx<7)return;
  d.started=true;d.button.classList.add('ml-drag-source');root.classList.add('ml-dragging');
  d.ghost=document.createElement('div');d.ghost.className='ml-drag-ghost';d.ghost.textContent=lab(d.id).name;d.ghost.setAttribute('aria-hidden','true');tabBar.append(d.ghost);
  d.frame=requestAnimationFrame(dragScroll);
 }
 e.preventDefault();dragPosition();
}
tabBar.addEventListener('click',e=>{if(performance.now()<suppressTabClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dragTab){e.preventDefault();finishTabDrag();}});
window.addEventListener('blur',()=>finishTabDrag());
