(()=>{
'use strict';
let accessBankCompatible=null;
let root=null,D=null,generation=0,request=null,listeners=null,events=[],saveError=false;
const track=(type,fields={})=>window.MADAR_ACTIVITY?.emit(type,{page:'access',...fields});
 let pendingSaves=[];const pendingKey=()=>window.MADAR_ACCOUNT?.user?'madar-access-pending:'+window.MADAR_ACCOUNT.user.id:null;
 try{const key=pendingKey();if(key)pendingSaves=JSON.parse(sessionStorage.getItem(key)||'[]');}catch{}
 function persistPending(){try{const key=pendingKey();if(key)sessionStorage.setItem(key,JSON.stringify(pendingSaves));}catch{}}
 let pendingOwner=pendingKey();
 function hydratePending(){const k=pendingKey();if(k!==pendingOwner){pendingSaves=[];pendingOwner=k;try{if(k){const saved=JSON.parse(sessionStorage.getItem(k)||'[]');if(Array.isArray(saved))pendingSaves=saved;}}catch{}}return pendingSaves;}
 async function retryPending(){hydratePending();for(const p of [...pendingSaves]){if(!await save(p))break;}}
 window.MADAR_ACCESS_SYNC={retry:retryPending,hasPending:()=>hydratePending().length>0,snapshot:()=>({events,pending:hydratePending()}),discard:()=>{pendingSaves=[];persistPending();},refresh:async()=>{const r=await fetch('/api/access-study',{cache:'no-store'});if(!r.ok)throw Error();const d=await r.json();if(d.owner!==window.MADAR_ACCOUNT.user?.id)throw Error();events=d.events;saveError=false;}};
 addEventListener('online',()=>void retryPending());addEventListener('beforeunload',e=>{if(pendingSaves.length){e.preventDefault();e.returnValue='';}});
 const guestKey='madar-access-guest-v1';let guestEvents=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ar=n=>Number(n).toLocaleString('ar-SA'),href=l=>'#access/'+l.id,unit=u=>u==='workbook'?'ملفات التمارين':'الوحدة '+ar(u)+(D?.unitNames?.[Number(u)-1]&&!/^الوحدة\s+\d+$/.test(D.unitNames[Number(u)-1])?' · '+esc(D.unitNames[Number(u)-1]):''),groups=()=>[...new Set((D?.lessons||[]).map(l=>l.unit))].sort((a,b)=>a-b);
const $=s=>root?.querySelector(s),all=s=>[...(root?.querySelectorAll(s)||[])];
const last=(kind,key)=>events.find(e=>e.kind===kind&&(kind==='attempt'?e.payload.question===key:e.lesson===key));
const marked=id=>last('bookmark',id)?.payload.value===true,due=id=>last('review',id)?.payload.due;
const prose=s=>String(s).replace(/([\u0621-\u064a])(\d)/g,"$1 $2").replace(/(\d)([\u0621-\u064a])/g,"$1 $2").split(/(-?\d+(?:\.\d+)?)/g).map((v,i)=>i%2?'<bdi dir="ltr">'+esc(v)+'</bdi>':esc(v)).join('');
