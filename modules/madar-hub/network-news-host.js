function createNetworkNewsPlayer(frame){
  if(!frame)return null;
  let showing=false;
  const send=()=>frame.contentWindow?.postMessage({type:'madar-news-scene',active:showing,paused:paused||motionPreference.matches},location.origin);
  const observer=new IntersectionObserver(entries=>{showing=entries[0].isIntersecting;send();});observer.observe(frame);
  const ready=e=>{if(e.source===frame.contentWindow&&e.origin===location.origin&&e.data?.type==='madar-news-ready')send();};
  frame.addEventListener('load',send);addEventListener('message',ready);
  return {sync:send,dispose(){observer.disconnect();frame.removeEventListener('load',send);removeEventListener('message',ready);}};
}
