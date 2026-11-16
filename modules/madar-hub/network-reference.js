function networkReference(){
 const entries=[
  ['قبل الإعداد','enable','Switch> / Router>','ينقلك إلى علامة # حتى تتمكن من فحص الجهاز والدخول إلى إعداداته.'],
  ['قبل الإعداد','configure terminal','Switch# / Router#','يفتح Global Configuration؛ تظهر (config)#. تكتب أوامر الإعداد من هنا.'],
  ['التنقل','exit','Configuration Modes','يرجع مستوى واحدًا للخلف؛ مثل الانتقال من (config-if)# إلى (config)#.'],
  ['التنقل','end','Configuration Modes','يرجع مباشرة إلى علامة #.'],
  ['VLAN','show vlan brief','Switch#','يعرض أرقام VLAN وأسماءها ومنافذ access المنتمية إليها. قارنها بمتطلبات مختبرك.'],
  ['Trunk','show interfaces trunk','Switch#','يعرض وصلات trunk وNative VLAN وقائمة VLAN المسموح بها. قارن طرفي الوصلة.'],
  ['Inter-VLAN','show ip interface brief','Router#','يعرض أسماء الواجهات وعناوين IP وحالتي Status وProtocol. ابحث عن الواجهة المطلوبة في النتيجة.'],
  ['التحقق','show running-config','Switch# / Router#','يعرض الإعداد الحالي. انتقل إلى سطور الواجهة أو VLAN التي تفحصها.'],
  ['التحقق','do show vlan brief','Switch(config)#','do يشغّل أمر عرض مثل show من داخل وضع الإعداد دون الخروج منه؛ ليس أمر اختبار اتصال.'],
  ['الحفظ','copy running-config startup-config','Switch# / Router#','يحفظ إعداد الجهاز الحالي للإقلاع التالي. يختلف عن حفظ مختبرك في مدار.'],
  ['الاتصال','ping <عنوان IP>','PC / Switch# / Router#','يفحص وصول الطلب والرد إلى عنوان محدد. نجاح إضاءة المنفذ وحده لا يكفي لضمان نجاحه.']
 ];
 return '<section class="mh-reference"><p class="mh-muted">اختر ما تحتاجه؛ الأرقام والعناوين تأخذها من متطلبات مختبرك. علامتا &gt; و# تظهران تلقائيًا ولا تُكتبان ضمن الأمر.</p><label class="mh-reference-search">ابحث عن أمر أو وظيفة<input id="mh-command-query" type="search" placeholder="VLAN، حفظ، show…" autocomplete="off"></label><div class="mh-reference-list">'+entries.map(([group,command,mode,description])=>'<details class="mh-command-card" data-command-search="'+esc(searchText(group+' '+command+' '+description))+'"><summary><code dir="ltr">'+esc(command)+'</code><span>'+esc(group)+'</span></summary><div><p>'+esc(description)+'</p><small>يُستخدم عند: <bdi>'+esc(mode)+'</bdi></small></div></details>').join('')+'</div><p id="mh-command-empty" class="mh-muted" hidden>لا يوجد أمر مطابق في هذا المرجع المختصر.</p></section>';
}
