function seed(n){
 const r={ous:{},users:{},groups:{},computers:{},settings:{},roles:{},interfaces:{},dhcp:{},scopes:{},reservations:{},leases:{},relay:{},disks:{},volumes:{},folders:{},shares:{},ports:{},printers:{},clientPrinters:{},starters:{},gpos:{},delegations:{},domains:{},domainOptions:{},servers:{},zones:{},records:{},dnsCopies:{},dnsSettings:{}};
 for(const name of ['IT','Development','Managers','Marketing','Research','Sales','Computers','Users'])r.ous[name]={name,parent:'Adatum.com',protected:true};
 const names=['Holly','Bart','Ed','Connie','Barbara','Arlene','Bernard'],ous=['IT','Development','Managers','Marketing','Research','Sales','Development'];
 names.forEach((name,i)=>r.users[name]={name,ou:ous[i],enabled:true,passwordSet:true});
 for(const name of ['Server Operators','Development','Marketing','Research','Sales'])r.groups[name]={name,scope:'Global',type:'Security',members:name==='Development'?['Bernard']:[]};
 for(const name of ['LON-CL1','LON-CL2','LON-CORE'])r.computers[name]={name,ou:'Computers',trust:true,domain:'Adatum.com'};
 for(const [name,mac,subnet] of [['LON-CL1','00-15-5D-01-00-01','172.16.0'],['LON-CORE','00-15-5D-01-00-02','172.16.0'],['LON-CL2','00-15-5D-01-00-03','10.10.0']])r.interfaces[name]={name,mac,subnet,auto:false,autoDNS:false};
 r.interfaces['Ethernet 2']={ip:'10.10.0.1',mask:'255.255.0.0',up:true};r.interfaces['LON-SVR1']={ip:'172.16.0.11',dns:'172.16.0.10',mask:'255.255.0.0',auto:false};
 if([6,7,8].includes(n)){r.ous['Branch Office 1']={name:'Branch Office 1',parent:'Adatum.com',protected:true};for(const k of names.slice(0,6))r.users[k].ou='Branch Office 1';r.computers['LON-CL1'].ou='Branch Office 1';for(const g of ['Branch 1 Help Desk','Branch 1 Administrators','Branch 1 Users'])r.groups[g]={name:g,ou:'Branch Office 1',scope:'Global',type:'Security',members:[]};}
 if(n===6)r.users.DelegationTestUser={name:'DelegationTestUser',ou:'Branch Office 1',enabled:true,passwordSet:true};
 if(n===7)delete r.users.Ed; // Separate clean checkpoint, explicitly declared in the UI.
 if(n===8){r.groups['Branch 1 Administrators'].members=['Holly'];r.groups['Server Operators'].members=['Branch 1 Administrators'];r.delegations.computers={principal:'Branch 1 Administrators',ou:'Branch Office 1',objects:'Computer',tasks:['full-control']};}
 if([12,13].includes(n)){r.roles.DHCP={installed:true,features:true,server:'LON-SVR1'};r.dhcp.server={authorized:true};r.scopes.CTE={name:'CTE',start:'172.16.0.100',end:'172.16.0.200',mask:'255.255.0.0',exclusions:'100-110',leaseDays:8,gateway:'172.16.0.1',dns:'172.16.0.10',domain:'Adatum.com',active:true};r.interfaces['LON-CORE'].auto=true;r.interfaces['LON-CORE'].autoDNS=true;r.leases['LON-CORE']={ip:'172.16.0.111',mask:'255.255.0.0',server:'172.16.0.11',mac:r.interfaces['LON-CORE'].mac,gateway:'172.16.0.1',dns:'172.16.0.10',scope:'CTE'};}
 for(let d=0;d<6;d++)r.disks[d]={online:d<2,style:d<2?'GPT':'RAW',dynamic:false,capacity:d<2?65536:32768,protected:d<2,extents:[]};
 r.servers['LON-DC1']={dc:true,dns:true,domain:'Adatum.com'};r.zones['Adatum.com']={name:'Adatum.com',type:'Primary',integrated:true,dynamic:'Secure'};r.dnsSettings['LON-DC1']={rootHints:['a.root-servers.net','b.root-servers.net'],forwarders:[]};
 return r;
}
const def=id=>catalog.find(x=>x.id===id);
function create(id,v){if(!def(id))return base.create(id,v);const s=base.create(id,0),t=def(id);s.name=t.host;s.domain='Adatum.com';s.lab={version:1,resources:seed(t.lesson),actor:'Administrator',device:t.host,proofs:{},events:[],output:'اختر الأداة ثم العملية. الحالة الابتدائية مستقلة لهذا الدرس؛ لا تغيّر تطبيقًا آخر.',passwordStage:null};return s;}
