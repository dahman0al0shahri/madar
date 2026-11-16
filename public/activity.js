(()=>{
 if(new URLSearchParams(location.search).has('contentPreview'))return;
 let actor=null,queue=[],busy=false,stopped=false,retryAfter=0;
 // Last explicitly tagged link in this tab, fixed 30-minute window; never copied to account data.
 const campaignKey='madar-campaign-v1',linkURL=new URL(location.href),tag=linkURL.searchParams.get('via'),tagged=linkURL.searchParams.has('via');
 const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(v);
 let campaign=null;try{campaign=JSON.parse(sessionStorage.getItem(campaignKey)||'null');}catch{}
 if(tagged){campaign=uuid(tag)?{id:tag,expires:Date.now()+1800000}:null;try{if(campaign)sessionStorage.setItem(campaignKey,JSON.stringify(campaign));else sessionStorage.removeItem(campaignKey);}catch{}linkURL.searchParams.delete('via');try{history.replaceState(history.state,'',linkURL.pathname+linkURL.search+linkURL.hash);}catch{}}
 function currentCampaign(){if(!campaign||!uuid(campaign.id)||!Number.isFinite(campaign.expires)||campaign.expires<=Date.now()||campaign.expires>Date.now()+1800000){campaign=null;try{sessionStorage.removeItem(campaignKey);}catch{}return null;}return campaign.id;}
 const page=()=>/^(home|courses|network|os1|learn|quiz|saved|mistakes|about|session|results|account|excel|access)$/.test(document.body.dataset.view||'')?document.body.dataset.view:'home';
 function emit(type,fields={}){
  if(stopped)return;
  const event={id:crypto.randomUUID(),type,page:page(),at:new Date().toISOString(),...fields};
  const source=currentCampaign();if(source)event.campaign=source;
  if(queue.length<100)queue.push(event);
  if(queue.length>=10)void flush();
 }
 async function flush(){
  if(!actor||busy||!queue.length||stopped||Date.now()<retryAfter)return;busy=true;const batch=queue.slice(0,20);
  try{const r=await fetch('/api/activity',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({actor,events:batch}),keepalive:true,signal:AbortSignal.timeout(8000)});
   if(r.ok)queue.splice(0,batch.length);
   else if([400,409,401,403].includes(r.status)){queue=[];stopped=true;}
   else retryAfter=Date.now()+(r.status===429?60000:30000);
  }catch{retryAfter=Date.now()+30000;}finally{busy=false;}
 }
 window.MADAR_ACTIVITY={emit,flush};
 if(tagged&&currentCampaign())emit('campaign_arrival');
 // No text inputs, click coordinates, passwords, feedback bodies or external URLs.
 document.addEventListener('click',e=>{
  const el=e.target.closest('button,a');if(!el||el.disabled)return;
  const id=el.id;
  if(el.matches('a[href*="signin-with-chatgpt"]'))emit('login_click');
  else if(el.matches('a[href*="signout"]'))emit('logout_click');
  else if(el.dataset.retry||id==='retry')emit('quiz_retry',el.dataset.retry?{question:el.dataset.retry}:{});
  else if(['select-all','select-none'].includes(id))emit('scope_change');
  else if(id==='export-progress')emit('progress_export');
  else if(id==='refresh-cloud')emit('progress_refresh');
  else if(el.matches('a[target="_blank"]'))emit('source_open');
  else if(el.classList.contains('ambient-toggle'))setTimeout(()=>emit('motion_change',{value:document.body.dataset.skyRunning==='false'?'off':'on'}),0);
 });
 document.addEventListener('change',e=>{if(e.target.matches('#quiz-form input'))emit('scope_change');});
 document.addEventListener('toggle',e=>{if(e.target.tagName==='DETAILS')emit(e.target.open?'detail_open':'detail_close');},true);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')void flush();});
 window.addEventListener('pagehide',()=>void flush());window.addEventListener('online',()=>void flush());
 setInterval(()=>void flush(),5000);
 window.MADAR_ACTIVITY.ready=fetch('/api/activity',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{actor=data.actor;void flush();return actor;}).catch(()=>{stopped=true;queue=[];});
 // The official player API reports play/pause/end, not proof of lesson completion.
 let apiLoading=false,player=null,boundFrame=null,ready=false,videoLesson=null;
 window.MADAR_VIDEO={time(lesson){if(!ready||videoLesson!==lesson||!boundFrame?.isConnected)return null;const value=player.getCurrentTime();return Number.isFinite(value)?value:null;},seek(lesson,seconds){if(!ready||videoLesson!==lesson||!boundFrame?.isConnected||!Number.isFinite(seconds)||seconds<0)return false;player.seekTo(seconds,true);player.playVideo();return true;}};
 function watchVideo(){
  if(boundFrame&&!boundFrame.isConnected){try{player?.destroy();}catch{}player=null;boundFrame=null;ready=false;videoLesson=null;}
  const frame=document.querySelector('#main iframe[src*="youtube-nocookie.com"]');if(!frame||frame.dataset.activityBound)return;
  if(!window.YT?.Player){if(!apiLoading){apiLoading=true;const old=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{old?.();watchVideo();};const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';document.head.append(script);}return;}
  frame.dataset.activityBound='true';const lesson=frame.dataset.lesson||location.hash.split('/')[1];let previous=null;
  if(!/^(?:v\d{2,3}|access-(?:u\d{2}-\d{2}|custom-\d{3})|excel-(?:[A-Za-z0-9_-]{11}|workbook-\d{2}|custom-\d{3}))$/.test(lesson||''))return;
  try{boundFrame=frame;videoLesson=lesson;ready=false;player=new YT.Player(frame,{events:{onReady:()=>{if(boundFrame===frame)ready=true;},onStateChange:e=>{if(e.data===previous)return;previous=e.data;const type=({1:'video_play',2:'video_pause',0:'video_end'})[e.data];if(type)emit(type,{lesson});}}});}catch{}
 }
 new MutationObserver(watchVideo).observe(document.getElementById('main')||document.getElementById('mh-main')||document.body,{childList:true,subtree:true});
})();

