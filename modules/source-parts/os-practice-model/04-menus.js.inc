function adapterMenu(s){s.evidence.networkView=s.revision;return `Network Adapter Settings
Index: ${target(s.id,s.variant).index}
DHCP Enabled: ${s.ip?'False':'True'}
IP Address: ${s.ip||'Not configured'}
Subnet Mask: ${s.mask||'Not configured'}
Default Gateway: ${s.gateway||'Not configured'}
Preferred DNS Server: ${s.dns||'Not configured'}

1) Set Network Adapter Address
2) Set DNS Servers
4) Return to Main Menu`;}
 function menu(s){return `SConfig · ${s.name} · ${s.domain}\n1) Domain / Workgroup\n2) Computer Name\n8) Network Settings\n9) Date and Time\n12) Restart Server\n15) Exit to Command Line\nقائمة مختصرة للمهارات الممثلة؛ cancel يلغي الإدخال الحالي.`;}
 