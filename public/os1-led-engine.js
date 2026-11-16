/* Representative PowerEdge semantics, not hardware telemetry. See LED-RESEARCH.md.
   Activity timings describe this simulated workload, not Dell timing specifications. */
(()=>{
 const mod=(n,d)=>((n%d)+d)%d;
 const hash=n=>{n=Math.imul(n^0x45d9f3b,0x45d9f3b);return (n^(n>>>16))>>>0;};
 function workload(t,device,channel=0){
   const seed=hash(device*97+channel*733+41),period=1700+seed%2701,clock=t+seed%10009;
   const block=Math.floor(clock/period),p=mod(clock,period),job=hash(seed+block*31),busy=350+job%1400;
   const io=p<busy,network=mod(clock+371,2900+(seed%1703))<650+job%1100;
   return {kind:io?(job%2?'read':'write'):(network?'network':'idle'),io,network,
     pulsePeriod:181+seed%237,pulsePhase:seed%997,pulseWidth:.28+(seed%31)/100};
 }
 // Device maintenance timelines are offset and have different lengths. Only one
 // drive per enclosure takes part; unrelated drives retain independent workloads.
 function deviceState(t,device){
   const period=195000+device*1231,offset=device===2?12000:device*13129;
   const clock=t+offset,phase=mod(clock,period),cycle=Math.floor(clock/period);
   const target=mod(cycle+device,device===0||device===2?8:1);
   let drive='online',start=0;
   for(const [a,b,kind] of [[6000,12000,'predicted-failure'],[12000,18000,'failed'],[18000,22000,'identify'],[22000,26000,'ready-removal'],[26000,30000,'initializing'],[30000,48000,'rebuilding'],[48000,72000,'rebuild-stopped'],[72000,92000,'rebuilding']])if(phase>=a&&phase<b){drive=kind;start=a;break;}
   const power=!(phase>=124000&&phase<130000),boot=phase>=130000&&phase<134000;
   const fault=['predicted-failure','failed','ready-removal','initializing','rebuilding','rebuild-stopped'].includes(drive);
   const net=mod(t+device*2903,37000+device*413);
   return {power,boot,drive,driveTime:phase-start,target,fault,identify:phase>=104000&&phase<112000,
     failSafe:phase>=116000&&phase<124000,healthTime:phase,link:power&&!boot&&!(net>=13000&&net<16000),
     maxSpeed:!(net>=18000&&net<22000),nicIdentify:net>=26000&&net<30000};
 }
 function stateFor(t,l){const d=deviceState(t,l.device),w=workload(t,l.device,l.channel);
   const drive=d.boot?'initializing':(l.drive===d.target?d.drive:'online');
   const online=['online','predicted-failure','identify','rebuilding'].includes(drive);
   return {...d,...w,drive,online,io:d.power&&!d.failSafe&&online&&(drive==='rebuilding'||w.io),network:w.network&&!d.failSafe};
 }
 function indicator(type,t,state){
   if(!state.power)return {on:false,color:'green'};
   const healthClock=state.healthTime??t,driveClock=state.driveTime??t;
   if(type==='health'){if(state.failSafe)return {on:true,color:'amber'};return {on:state.fault||state.identify?mod(healthClock,1000)<500:true,color:state.fault?'amber':'blue'};}
   if(type==='status'){
     switch(state.drive){
       case 'identify':return {on:mod(driveClock,500)<250,color:'green'};
       case 'failed':return {on:mod(driveClock,250)<125,color:'amber'};
       case 'predicted-failure':{const p=mod(driveClock,1500);return {on:p<1000,color:p<500?'green':'amber'};}
       case 'rebuilding':return {on:mod(driveClock,2000)<1000,color:'green'};
       case 'rebuild-stopped':{const p=mod(driveClock,12000);return {on:p<6000,color:p<3000?'green':'amber'};}
       case 'ready-removal':case 'initializing':return {on:false,color:'green'};
       default:return {on:state.online,color:'green'};
     }
   }
   if(type==='link')return {on:state.link&&(!state.nicIdentify||mod(t,1000)<500),color:state.nicIdentify||state.maxSpeed?'green':'amber'};
   const pulse=mod(t+(state.pulsePhase??0),state.pulsePeriod??310)<(state.pulsePeriod??310)*(state.pulseWidth??.46);
   if(type==='network')return {on:state.link&&!state.nicIdentify&&state.network&&pulse,color:'green'};
   if(type==='activity')return {on:state.online&&state.io&&pulse,color:'green'};
   return {on:true,color:'green'};
 }
 // Positions registered to the photographic asset; no floating decorative lights.
 const lamps=[];
 const add=(x,y,type,device,r=1.5,drive=0)=>lamps.push({x,y,type,device,r,drive,channel:Math.round(x*13+y*31)});
 add(253,220,'power',0,2.7);add(638,285,'link',0,2);add(652,287,'network',0,2);
 [[281,274],[279,320],[445,294],[444,337],[578,311],[579,352],[760,326],[760,365]].forEach(([x,y],i)=>{add(x,y,'activity',0,1.3,i);add(x,y+6,'status',0,1,i)});
 [[449,577],[479,574],[449,620],[480,619],[448,664],[587,606],[682,597],[785,569]].forEach(([x,y],i)=>{add(x,y,'activity',2,1.6,i);add(x,y+6,'status',2,1.2,i)});
 add(777,480,'health',2,2.2);add(274,768,'health',3,2.3);add(275,783,'power',3,2.1);
 [[926,170],[926,181],[970,412],[970,421],[1003,414],[1003,430],[1003,447],[1025,121],[1025,307],[1025,751],[1096,436],[1096,493],[1112,578],[1175,370],[1175,390],[1183,415],[1176,439],[1183,711],[1594,444],[1594,460],[1609,443]].forEach(([x,y],i)=>add(x,y,i%3===0?'status':'activity',5+i%8,1.4));
 [[1019,308],[1113,522],[1174,219],[1246,336],[1567,526],[1647,443]].forEach(([x,y],i)=>add(x,y,'health',5+i,1.5));
 const colors={green:'#90ff7e',blue:'#68c6ff',amber:'#ffb64a'};
 function markup(){return lamps.map((l,i)=>`<g data-lamp="${i}" data-kind="${l.type}" transform="translate(${l.x} ${l.y})"><circle class="led-seat" r="${l.r+1.7}" fill="#101b20"/><g class="led-light"><circle class="led-halo" r="${l.r*2.8}" opacity=".32"/><circle r="${l.r}"/><circle r="${l.r*.42}" fill="#efffff"/></g></g>`).join('');}
 document.querySelectorAll('.room svg').forEach(svg=>{svg.innerHTML=`<g class="leds">${markup()}</g>`});
 const nodes=[...document.querySelectorAll('[data-lamp]')];let elapsed=0,last=performance.now();
 function sample(t,l){const state=stateFor(t,l);return {...indicator(l.type,t+l.channel*17,state),state};}
 function draw(){nodes.forEach(node=>{const l=lamps[+node.dataset.lamp],result=sample(elapsed,l);node.dataset.on=String(result.on);node.dataset.workload=result.state.kind;node.dataset.state=result.state.drive;node.dataset.color=result.color;node.style.setProperty('--lamp',colors[result.color]);});}
 draw();
 setInterval(()=>{const now=performance.now(),dt=now-last;last=now;if(document.hidden||document.body.classList.contains('paused'))return;elapsed+=Math.min(dt,100);draw();},40);
 window.serverLighting={workload,indicator,deviceState,stateFor,sample,lamps,getTime:()=>elapsed};
})();
