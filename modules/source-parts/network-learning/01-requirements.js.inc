function renderRequirements(e){
 const key=JSON.stringify(e);if(key===requirementsKey)return;requirementsKey=key;
 const value=x=>'<bdi dir="ltr">'+esc(x)+'</bdi>',ip=(i,last=1)=>'192.168.'+e.nets[i]+'.'+last;
 const table=(labels,rows)=>'<table><thead><tr>'+labels.map(x=>'<th scope="col">'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
 const group=(number,title,body)=>'<section class="ml-req-group"><h4><span aria-hidden="true">'+number+'</span>'+title+'</h4>'+body+'</section>';
 const port=(device,name)=>value(device+' / '+name);
 const connections=[
  ['PC1','S1',e.pcPorts[0],'VLAN '+e.vlans[1]],
  ['PC2','S2',e.pcPorts[1],'VLAN '+e.vlans[2]],
  ['S1 / '+e.uplink,'S2',e.uplink,'وصلة Switches'],
  ['R1 / '+e.routerPort,'S1',e.routerSwitch,'وصلة Router']
 ];
 $('#ml-requirements-content').innerHTML=
 group('١','VLAN — الشبكات وأسماؤها',table(['الرقم','الاسم','البوابة'],e.vlans.map((v,i)=>[value(v),value(e.names[i]),i<3?value(ip(i)):i===4?'بلا IP':'—'])))+
 group('٢','التوصيلات والمنافذ','<ul class="ml-req-connections">'+connections.map(([from,to,n,label])=>'<li><div class="ml-req-path">'+value(from)+'<span aria-label="متصل بـ">↔</span>'+port(to,n)+'</div><span class="ml-req-purpose">'+(label.startsWith('VLAN')?value(label):label)+'</span></li>').join('')+'</ul>')+
 group('٣','عناوين إدارة Switch',table(['الجهاز','عنوان IP'],[['S1',ip(0,11)],['S2',ip(0,12)]].map(row=>row.map(value)))+'<dl class="ml-req-facts"><div><dt>البوابة الافتراضية</dt><dd>'+value(ip(0))+'</dd></div><div><dt>قناع الشبكة</dt><dd>'+value('255.255.255.0')+' <span>('+value('/24')+')</span></dd></div></dl>')+
 group('٤','شروط الإعداد','<ul class="ml-req-rules"><li>المنافذ غير المستخدمة: ضمن '+value('VLAN '+e.vlans[3])+' وتكون مغلقة.</li><li>'+value('Native VLAN')+': '+value(e.vlans[4])+' بلا عنوان '+value('IP')+'.</li><li>كل واجهة فرعية في '+value('Router')+' لها وصف غير فارغ.</li><li>قناع عناوين الشبكة: '+value('255.255.255.0')+'.</li></ul><p class="ml-req-port-note">منفذ '+value('Router')+' في هذا المختبر '+value(e.routerPort)+'؛ يقابله '+value('G0/0/1')+' في ملف المختبر حسب طراز الجهاز.</p>');
}

