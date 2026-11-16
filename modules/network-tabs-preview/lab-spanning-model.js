// Stable per-VLAN STP calculation. No protocol packets or convergence timers are invented.
PM.stpTopology=function(v=1){
 const ids=Object.keys(this.env.types()).filter(d=>this.type(d)==='S'&&this.env.power(d)&&this.ensure(d).vlans[v]),edges=new Map();
 const order=(a,b)=>a.localeCompare(b,undefined,{numeric:true}),bid=id=>[32768+v,id],compare=(a,b)=>a[0]-b[0]||order(a[1],b[1]);
 const portNumber=n=>n.startsWith('Po')?500+Number(n.slice(2)):n.startsWith('G')?24+Number(n.split('/').at(-1)):Number(n.split('/').at(-1));
 const cost=(id,n)=>{const members=n.startsWith('Po')?this.channelMembers(id,+n.slice(2)).filter(p=>this.channelUp(id,p)):[n];const speed=members.reduce((sum,p)=>sum+(Number(this.iface(id,p).speed)|| (p.startsWith('G')?1000:100)),0);return speed>=10000?2:speed>=2000?3:speed>=1000?4:speed>=800?5:speed>=600?6:speed>=400?8:speed>=200?12:speed>=100?19:100;};
 for(const id of ids)for(const n of this.keys(id)){
  const k=id+':'+n,peer=this.env.peer(k);if(!peer||!this.env.up(k))continue;const[d,p]=peer.split(':');if(!ids.includes(d)||!this.carries(id,n,v)||!this.carries(d,p,v))continue;
  const bundled=this.channelUp(id,n),a=bundled?'Po'+this.iface(id,n).channel:n,b=bundled?'Po'+this.iface(d,p).channel:p,token=[id+':'+a,d+':'+b].sort(order).join('|');
  if(!edges.has(token))edges.set(token,{a:id,b:d,ap:a,bp:b,ac:cost(id,a),bc:cost(d,b),ports:new Set()});edges.get(token).ports.add(k);edges.get(token).ports.add(peer);
 }
 const rows={},allowed=new Set(),unvisited=new Set(ids);
 while(unvisited.size){
  const start=[...unvisited][0],component=new Set([start]),queue=[start];while(queue.length){const id=queue.shift();for(const e of edges.values()){const d=e.a===id?e.b:e.b===id?e.a:null;if(d&&!component.has(d)){component.add(d);queue.push(d);}}}
  component.forEach(d=>unvisited.delete(d));const root=[...component].sort((a,b)=>compare(bid(a),bid(b)))[0],dist=Object.fromEntries([...component].map(d=>[d,d===root?0:Infinity])),incoming={};
  for(let pass=0;pass<component.size;pass++)for(const e of edges.values())for(const [id,peer,p,pp,c]of [[e.a,e.b,e.ap,e.bp,e.ac],[e.b,e.a,e.bp,e.ap,e.bc]]){
   if(!component.has(id)||id===root)continue;const candidate=dist[peer]+c,old=incoming[id],tie=old?(compare(bid(peer),bid(old.peer))||portNumber(pp)-portNumber(old.peerPort)||portNumber(p)-portNumber(old.port)):-1;
   if(Number.isFinite(candidate)&&(candidate<dist[id]||candidate===dist[id]&&tie<0)){dist[id]=candidate;incoming[id]={peer,port:p,peerPort:pp};}
  }
  for(const id of component)rows[id]={root,cost:dist[id],rootPort:incoming[id]?.port,bridgePriority:32768+v,ports:[]};
  for(const e of edges.values()){
   if(!component.has(e.a))continue;const designated=dist[e.a]<dist[e.b]||dist[e.a]===dist[e.b]&&compare(bid(e.a),bid(e.b))<0?e.a:e.b;let forward=true;
   for(const[id,p,c]of [[e.a,e.ap,e.ac],[e.b,e.bp,e.bc]]){const role=id===designated?'Desg':incoming[id]?.port===p?'Root':'Altn';if(role==='Altn')forward=false;rows[id].ports.push({name:p,role,state:role==='Altn'?'Blocking':'Forwarding',cost:c,priority:'128.'+portNumber(p)});}
   if(forward)e.ports.forEach(k=>allowed.add(k));
  }
 }
 for(const id of ids)for(const n of this.keys(id)){const peer=this.env.peer(id+':'+n);if(peer&&this.env.up(id+':'+n)&&this.type(peer.split(':')[0])!=='S'&&this.carries(id,n,v))rows[id].ports.push({name:n,role:'Desg',state:'Forwarding',cost:cost(id,n),priority:'128.'+portNumber(n)});}
 return {rows,allowed};
};
PM.tree=function(v=1){return this.stpTopology(v).allowed;};
PM.spanning=function(id,v=1){const row=this.stpTopology(v).rows[id];if(!row)return ['No active spanning tree for VLAN '+v];return ['VLAN'+String(v).padStart(4,'0')+' — stable STP model','Root ID  Priority '+row.bridgePriority+'  Address '+row.root,(row.root===id?'This bridge is the root':'Root path cost '+row.cost+'  Root port '+row.rootPort),'Bridge ID  Priority '+row.bridgePriority+'  Address '+id,'Interface     Role   State        Cost   Prio.Nbr',...row.ports.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true})).map(p=>p.name.padEnd(14)+p.role.padEnd(7)+p.state.padEnd(13)+String(p.cost).padEnd(7)+p.priority)];};
