(async()=>{
'use strict';
const root=document.getElementById('madar-labs'),engine=document.getElementById('madar-free'),$=s=>root.querySelector(s),clone=x=>JSON.parse(JSON.stringify(x)),uid=()=>crypto.randomUUID(),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>`<i data-lucide="${n}" aria-hidden="true"></i>`,icons=()=>window.lucide?.createIcons({attrs:{width:18,height:18}});
if(!engine.labsBridge)await new Promise(resolve=>engine.addEventListener('labs:ready',resolve,{once:true}));
const B=engine.labsBridge,dialog=$('#ml-dialog'),body=$('#ml-dialog-body');
let state,loading=true,dirty=false,saving=false,saveTimer,version=0,savedVersion=0,offset=0,selected=new Set(),clipboard=null,placing=false,dragTab=null,pendingPings=new Map(),lastFocus=null,search='',lastOwnPayload='',restoreFailure=null,recoveryPayload=null;
const courseNames={vlan:'إنشاء VLAN',ports:'فحص المنافذ'};
B.prepare();const baseline=B.capture();baseline.ui.cliOpen=true;
const makeLab=(id,name,kind,data,course=null)=>({id,name,kind,description:'',hidden:false,data:clone(data),course,aliases:{},logs:[],logOpen:false,undo:null,savedAt:null,custom:false,revision:0,results:[],resultSeen:0,verdict:'',copied:false});
function initial(){return{schema:1,copyNumberingVersion:2,labLifecycleVersion:1,helperUseSequence:0,course:'vlan',active:'original-vlan',labs:[makeLab('original-vlan','مختبر التمرين','original',baseline,'vlan'),makeLab('original-ports','مختبر التمرين','original',baseline,'ports')],copyCounters:{}};}
state=initial();const lab=id=>state.labs.find(x=>x.id===id),active=()=>lab(state.active),original=()=>lab('original-'+state.course);
