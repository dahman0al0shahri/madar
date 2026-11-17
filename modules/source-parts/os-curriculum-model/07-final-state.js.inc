function finalState(s){const r=s.lab.resources,n=def(s.id).lesson;
 if(n===4)return ['tree','child','forest'].every(k=>r.domains[k]&&r.domainOptions[k]?.passwordSet);
 if(n===5)return !r.ous['Temporary OU']&&['Holly','Bart','Ed','Connie','Barbara','Arlene'].every(k=>r.users[k]?.ou==='Branch Office 1')&&r.computers['LON-CL1'].ou==='Branch Office 1';
 if(n===6)return permission(r,'Bart','Branch Office 1','User','reset-password')&&!permission(r,'Bart','Branch Office 1','User','delete')&&!permission(r,'Holly','Sales','User','delete')&&r.users.Connie?.mustChange;
 if(n===7)return r.users._Branch_template?.enabled===false&&r.users.Ed?.enabled&&r.users.Ed.home.endsWith('\\Ed')&&r.groups['Branch 1 Users'].members.includes('Ed');
 if(n===8)return r.computers['LON-CL1'].trust&&!r.computers['LON-CL1'].pendingTrust;
 if(n===9)return r.computers.PC1?.ou==='CTE2'&&permission(r,'Adel','CTE1','User','create')&&!permission(r,'Adel','CTE1','OU','create')&&permission(r,'Ed','Marketing','OU','create')&&!permission(r,'Ed','CTE1','Group','modify');
 if(n===10)return r.users.Ty?.enabled&&r.users.Ty?.passwordSet&&r.groups.LondonBranchUsers?.members.includes('Ty');
 if(n===11)return r.leases['LON-CORE']?.ip==='172.16.0.105'&&r.leases['LON-CL1']?.ip!=='172.16.0.191'&&!!r.leases['LON-CL1']&&!r.reservations['LON-CL1'];
 if(n===12||n===13)return r.leases['LON-CL2']?.ip==='10.10.0.111'&&r.leases['LON-CORE']?.ip==='172.16.0.111'&&r.relay.Remote?.enabled;
 if(n===14)return r.dnsCopies['LON-SVR1']?.hasCore===true&&r.dnsCopies['LON-SVR1']?.hasFileZone===false&&r.zones['contoso.com']?.integrated===false;
 if(n===15||n===16)return r.volumes.Mirror?.type==='Mirrored'&&r.volumes.Mirror?.healthy&&r.volumes.Mirror?.file==='Lab data'&&r.volumes.Volume1?.capacity===3072&&r.volumes.Volume2?.capacity===6144&&r.volumes.Parity?.capacity===(n===15?8192:4096);
 if(n===17)return fileAllowed(r,'Bernard','Data','Development')&&['Marketing','Research','Sales'].every(k=>!fileAllowed(r,'Bernard','Data',k))&&r.shares.Data?.abe&&r.shares.Data?.caching==='None';
 if(n===18||n===19)return r.printers['Branch Office Printer']?.pooling&&r.printers['Branch Office Printer'].ports?.length===2&&r.clientPrinters['LON-CL1']?.name==='Branch Office Printer';
 if(n===20){const e=effectivePolicy(r,'IT','Users');return r.computers['LON-CL1'].ou==='IT'&&e.read==='Disabled'&&e.write==='Disabled'&&e.execute==='Disabled'&&e.general==='Enabled';}
 return false;
}
api.inspect=s=>{if(!def(s.id))return base.inspect(s);const checks=def(s.id).actions.map(a=>({label:a.title+' · المشهد '+a.scene,ok:!!s.lab.proofs[a.id]?.ok}));checks.push({label:'الإعدادات النهائية وآثارها الحالية',ok:!!finalState(s)});for(const title of Object.values(s.lab.issues||{}))checks.push({label:'راجع الإعداد غير المطابق: '+title,ok:false});return {passed:checks.length>0&&checks.every(c=>c.ok),checks};};
api.labInternals={permission,allocate,effectivePolicy,fileAllowed,match,seed,parseCommand};
})(typeof window==='undefined'?globalThis:window);
