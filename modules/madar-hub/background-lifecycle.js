function updateNetworkBackground(course){
 const frame=$('#mh-network-background'),active=course==='network';frame.hidden=!active;
 const send=()=>{
  const showing=root.dataset.course==='network';
  frame.contentWindow?.postMessage({type:'madar-background-active',active:showing},location.origin);
  if(!showing){window.MadarPageReflection?.stop();return;}
  window.MadarPageReflection?.start(frame);
 };
 frame.onload=send;
 if(!active)window.MadarPageReflection?.stop();
 if(active&&!frame.getAttribute('src'))frame.src='/network-background.html';else if(frame.getAttribute('src'))send();
}
