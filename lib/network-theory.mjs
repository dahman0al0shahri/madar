import EXPANDED from './network-theory-expanded.json' with {type:'json'};
import SOURCE_SLIDES from './network-theory-sources.json' with {type:'json'};
// Reviewed against the supplied SRWE decks; MADAR explanations, not an official Cisco translation.
import {NETWORK_GLOSSARY} from './network-glossary.mjs';
export const THEORY_SKILL="يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان";
export const THEORY_CHAPTERS={"1":"Basic Device Configuration","2":"Switching Concepts","3":"VLANs"};
export const NETWORK_THEORY=[
  {
    "id": "network-theory-1-1",
    "subject": "Network",
    "section": "theory",
    "unit": 1,
    "title": "1.1 · تهيئة Switch بالإعدادات الأولية",
    "video": null,
    "summary": "Switch يربط أجهزة الشبكة المحلية ويمرّر Ethernet Frames بينها؛ و Frame هو إطار البيانات اللي ينتقل على وصلة Ethernet. قبل ما يبدأ التمرير، يجهّز الجهاز مكوناته ويحمّل Cisco IOS، وهو نظام التشغيل اللي يدير وظائف الجهاز وأوامره.",
    "steps": [
      "تسلسل إقلاع Switch",
      "اختيار صورة IOS عند الإقلاع",
      "قراءة مؤشرات LED بحسب وضع العرض",
      "الوصول إلى Boot Loader عند تعذر الإقلاع",
      "SVI ومتطلبات عمل واجهة الإدارة",
      "إعداد عنوان الإدارة وDefault Gateway",
      "التحقق من عنوان الإدارة وحالة الواجهة"
    ],
    "source": "SRWE Module 1 · الشرائح 12–23",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 1,
      "chapterTitle": "Basic Device Configuration",
      "part": "1.1",
      "english": "Configure a Switch with Initial Settings",
      "range": "12–23",
      "topics": [
        {
          "title": "تسلسل إقلاع Switch",
          "slides": "13–14",
          "paragraphs": [
            "Switch يربط أجهزة الشبكة المحلية ويمرّر Ethernet Frames بينها؛ و Frame هو إطار البيانات اللي ينتقل على وصلة Ethernet. قبل ما يبدأ التمرير، يجهّز الجهاز مكوناته ويحمّل Cisco IOS، وهو نظام التشغيل اللي يدير وظائف الجهاز وأوامره.",
            "الإقلاع في الطراز المعروض يمر بخمس مراحل: يبدأ POST، اختصار Power-On Self-Test، بفحص المعالج والذاكرة وجزء من Flash. بعد نجاح الفحص يعمل Boot Loader، وهو برنامج الإقلاع المخزّن في ROM. بعدها يهيّئ المعالج، ثم نظام ملفات Flash، ثم يحمّل صورة IOS إلى الذاكرة ويسلّمها التحكم. بعد تشغيل IOS يطبّق الجهاز الإعدادات المحفوظة. ملف النظام وملف إعداداتك ملفان مختلفان."
          ],
          "table": [
            [
              "الاسم",
              "وظيفته"
            ],
            [
              "ROM",
              "ذاكرة فيها تعليمات الإقلاع الأساسية"
            ],
            [
              "RAM / DRAM",
              "ذاكرة العمل أثناء التشغيل؛ محتواها المتطاير لا يبقى بعد انقطاع الطاقة"
            ],
            [
              "Flash",
              "تخزين غير متطاير لملفات مثل صورة IOS"
            ],
            [
              "startup-config",
              "الإعدادات المحفوظة التي يقرأها الجهاز عند بدء التشغيل"
            ],
            [
              "running-config",
              "الإعدادات المستخدمة الآن في ذاكرة العمل"
            ]
          ]
        },
        {
          "title": "اختيار صورة IOS عند الإقلاع",
          "slides": "14",
          "paragraphs": [
            "BOOT Environment Variable متغيّر يحدد مسار صورة IOS اللي يبدأ بها الجهاز. تضبط المسار بأمر boot system، وتراجعه بأمر show boot. في تسلسل العرض، إذا ما كان المتغيّر مضبوطًا، يبحث Boot Loader عن أول ملف قابل للتنفيذ وفق آلية بحثه. هذا ما يعني إن أي ملف موجود يصلح للتشغيل؛ لازم تكون الصورة مناسبة للطراز.",
            "ملف startup-config يحتوي إعدادات بدء التشغيل. في Catalyst 2960 المعروض يُحفظ باسم config.text داخل Flash، وهي ذاكرة تخزين تحتفظ بالملفات بعد انقطاع الطاقة. قبل تعديل boot system، راجع اسم الصورة ومجلدها ووجودها؛ المسار غير الصحيح ممكن يمنع الإقلاع الطبيعي."
          ],
          "code": "Switch> enable\nSwitch# show boot\nSwitch# show flash:\nSwitch# configure terminal\nSwitch(config)# boot system flash:<folder>/<image.bin>\nSwitch(config)# end",
          "note": "Prompt هو مؤشر وضع الأوامر، مثل Switch#؛ تكتب الأمر اللي بعده فقط. مسار boot system هنا قالب توضيحي، فاستبدله بمسار صورة موجودة ومتوافقة قبل التطبيق. لتثبيت التغيير بعد التحقق، احفظ running-config."
        },
        {
          "title": "قراءة مؤشرات LED بحسب وضع العرض",
          "slides": "15–16",
          "paragraphs": [
            "LED مؤشر ضوئي يوضح حالة معينة. لمبة SYST تخص النظام، وRPS تخص مصدر الطاقة الاحتياطي. أما STAT وDUPLX وSPEED وPoE فهي أوضاع تغيّرها بزر Mode؛ بعدها تقرأ لمبة كل منفذ على أساس الوضع المختار. PoE، اختصار Power over Ethernet، يعني تغذية جهاز متصل بالكهرباء عبر كابل الشبكة.",
            "في وضع STAT بالطراز المعروض: الأخضر الثابت يعني وجود Link، أي اتصال على الوصلة، والوميض الأخضر يعني نشاط إرسال أو استقبال. انطفاء اللمبة قد يعني عدم وجود اتصال أو تعطيل المنفذ. الكهرماني قد يدل على حجب المنفذ بواسطة STP، وهو بروتوكول يمنع حلقات Layer 2، أي طبقة ربط البيانات. تناوب الأخضر والكهرماني يدل على خلل في الوصلة؛ لذلك اللون وحده ما يكفي للتشخيص.",
            "في وضع DUPLX: الأخضر يعني Full Duplex، أي إرسال واستقبال في الوقت نفسه، والمطفأ يعني Half Duplex، أي العمل بالتناوب. في وضع SPEED بالمثال: المطفأ يعني 10 Mb/s، والأخضر 100 Mb/s، والوميض الأخضر 1000 Mb/s. Mb/s تعني مليون بت في الثانية. هذي الدلالات تخص المنافذ والطراز المعروضين.",
            "فرّق بين لمبة وضع PoE ولمبات المنافذ: لمبة الوضع الخضراء تعني إنك اخترت عرض PoE؛ وإذا ومضت بالكهرماني والوضع غير مختار، فهي تنبّه لمشكلة PoE في منفذ. أما لمبة المنفذ في وضع PoE فالأخضر يعني تقديم الطاقة، والمطفأ يعني عدم تقديمها، والكهرماني يعني تعطيلها، والكهرماني الوامض يعني عطلًا. تناوب الأخضر والكهرماني قد يعني إن توفير الطاقة سيتجاوز Power Budget، أي قدرة الطاقة المتاحة.",
            "لمبة RPS الخضراء تعني جاهزية المصدر الاحتياطي، والخضراء الوامضة تعني إنه متصل لكنه غير متاح لهذا الجهاز. الكهرمانية تعني انتظارًا أو عطلًا، والكهرمانية الوامضة في جدول العرض تعني إن المصدر الداخلي تعطل والمصدر الاحتياطي يغذي الجهاز. تفسير لمبة الطاقة يختلف عن تفسير لمبة المنفذ؛ ارجع لدليل الطراز عند اختلاف المؤشرات."
          ]
        },
        {
          "title": "الوصول إلى Boot Loader عند تعذر الإقلاع",
          "slides": "17",
          "paragraphs": [
            "إذا كانت ملفات النظام مفقودة أو تالفة، يتيح Boot Loader الوصول إلى ملفات Flash عبر Console، وهو اتصال إدارة محلي. طريقة Catalyst 2960 في العرض تبدأ بتوصيل PC، أي حاسب شخصي، إلى Console وتشغيل برنامج الطرفية. بعد فصل الطاقة وإعادتها، اضغط Mode خلال 15 ثانية بينما SYST تومض بالأخضر. استمر إلى أن تتحول مؤقتًا للكهرماني ثم للأخضر الثابت، وبعدها حرر الزر ليظهر المؤشر switch:.",
            "من هذا الوضع تقدر تعرض الملفات بأمر dir وتتابع إجراء الاستعادة المناسب. أدوات تهيئة Flash أو إعادة تثبيت IOS موجودة لمعالجة حالات محددة؛ التهيئة تمسح البيانات وليست أول خطوة لمجرد تعذر الإقلاع. التسلسل هنا خاص بالطراز المذكور، فتأكد من دليل الجهاز قبل تطبيقه فعليًا."
          ]
        },
        {
          "title": "SVI ومتطلبات عمل واجهة الإدارة",
          "slides": "18–19",
          "paragraphs": [
            "SVI اختصار Switch Virtual Interface، وهي واجهة منطقية مرتبطة برقم VLAN وليست منفذ كابل. VLAN، اختصار Virtual Local Area Network، تقسيم منطقي للشبكة المحلية. نعطي SVI عنوان IP عشان نصل إلى إدارة Switch عبر الشبكة. IP هو بروتوكول العنونة والتواصل بين الشبكات، وعنوانه يحدد الواجهة المقصودة.",
            "في حالة Autostate المعتادة، وهي آلية ربط حالة SVI بمنافذ VLAN، تحتاج VLAN موجودة وفعالة، و SVI غير معطلة بأمر shutdown. وتحتاج منفذ Layer 2 واحدًا على الأقل يحمل VLAN وتكون وصلته عاملة وحالته STP Forwarding، أي مسموح له بتمرير الحركة. لذلك no shutdown على SVI وحده ما يكفي إذا ما فيه منفذ يحقق هذي الشروط.",
            "بعض إصدارات IOS 15 على Catalyst 2960 تحتاج قالب SDM مناسبًا قبل إعداد IPv6. SDM، اختصار Switch Database Management، يحدد توزيع موارد الجهاز بين وظائفه. مثال العرض يستخدم sdm prefer dual-ipv4-and-ipv6 default ثم إعادة التشغيل. هذا متطلب يعتمد على الطراز والإصدار، وليس خطوة لازمة على كل Switch."
          ],
          "note": "شروط Autostate هنا للحالة المعتادة؛ خيارات استثناء منافذ من احتساب الحالة تختلف حسب المنصة.",
          "link": "https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/41141-188.html"
        },
        {
          "title": "إعداد عنوان الإدارة وDefault Gateway",
          "slides": "20–21",
          "paragraphs": [
            "في المثال، VLAN 99 مخصصة للإدارة وعنوان S1 هو 172.17.99.11 بقناع 255.255.255.0، ويُكتب أيضًا /24. القناع يحدد الجزء الخاص بالشبكة من عنوان IPv4. الواجهة نفسها تقدر تحمل عنوان IPv6 كذلك؛ IPv4 و IPv6 إصداران مختلفان من IP ولكل واحد عنونته.",
            "Default Gateway هي البوابة اللي يرسل لها الجهاز حركة الإدارة المتجهة لشبكة خارج شبكته المحلية. هنا نستخدم ip default-gateway لأن Switch يعمل في Layer 2 دون تفعيل IP routing، أي توجيه IP. إضافة عنوان إلى SVI ما تفعّل التوجيه بين VLANs تلقائيًا. في سيناريو IPv6 المذكور يمكن تعلم البوابة من RA، اختصار Router Advertisement، وهي رسالة إعلان يرسلها Router على الوصلة.",
            "ابدأ من User EXEC وعلامته >؛ هذا وضع الأوامر الأولي. enable ينقلك إلى Privileged EXEC وعلامته # بصلاحيات أوسع. configure terminal يفتح Global Configuration وعلامته (config)# لتعديل إعدادات الجهاز. interface vlan 99 يفتح Interface Configuration وعلامته (config-if)# لتعديل الواجهة المحددة. end يرجع إلى #، ومنه تحفظ الإعداد الحالي."
          ],
          "code": "Switch> enable\nSwitch# configure terminal\nSwitch(config)# vlan 99\nSwitch(config-vlan)# exit\nSwitch(config)# interface vlan 99\nSwitch(config-if)# ip address 172.17.99.11 255.255.255.0\nSwitch(config-if)# ipv6 address 2001:db8:acad:99::1/64\nSwitch(config-if)# no shutdown\nSwitch(config-if)# exit\nSwitch(config)# ip default-gateway 172.17.99.1\nSwitch(config)# end\nSwitch# copy running-config startup-config",
          "note": "أضفنا إنشاء VLAN لتوضيح متطلبات المثال. في الشريحة 21، أمر ip default-gateway موجود في Global Configuration بشكل صحيح؛ الخطأ الطباعي في مؤشر سطر end التالي، إذ يظهر (config-if)# بدل (config)#."
        },
        {
          "title": "التحقق من عنوان الإدارة وحالة الواجهة",
          "slides": "22–23",
          "paragraphs": [
            "بعد الإعداد، اعرض show ip interface brief و show ipv6 interface brief. راجع العنوان وعمودَي Status وProtocol، أي حالة الواجهة وحالة بروتوكولها. ظهور up/up يعني إن الجانبين في حالة تشغيل، لكنه ما يثبت وصول جهاز بعيد. إذا بقيت SVI في حالة down، راجع VLAN والمنفذ اللي يحملها قبل تكرار إعداد العنوان.",
            "نشاط Basic Switch Configuration يربط توصيل الشبكة بالإعداد الأساسي واختبار الاتصال وإدارة جدول MAC، وهو جدول عناوين الأجهزة ومنافذ الوصول إليها. ملف النشاط التفصيلي غير مرفق؛ الموجود في العرض أهدافه. استخدم هذي الأهداف لترتيب التطبيق، وافصل قراءة الإجراء عن تنفيذه والتحقق من نتيجته."
          ],
          "code": "Switch# show ip interface brief\nSwitch# show ipv6 interface brief\nSwitch# show vlan brief"
        }
      ],
      "checks": [
        {
          "question": "واجهة SVI عليها عنوان وطبّقت no shutdown، لكنها ما صارت up/up. ما المتطلبات اللي تراجعها؟",
          "answer": "راجع وجود VLAN وحالتها، وعدم تعطيل SVI، ووجود منفذ يحمل VLAN ووصلة عاملة وحالة STP Forwarding. العنوان وحده ما يثبت جاهزية الواجهة أو الوصول إليها."
        },
        {
          "question": "ما الفرق بين تنفيذ إعداد جديد وتنفيذ copy running-config startup-config؟",
          "answer": "التعديل يبدأ في running-config، أي الإعداد المستخدم الآن. أمر copy يحفظ نسخة منه في startup-config عشان تُقرأ عند بدء التشغيل. الحفظ لا يغني عن التحقق من صحة الإعداد نفسه."
        }
      ],
      "terms": [
        "Switch",
        "IOS",
        "POST",
        "Boot Loader",
        "Flash",
        "RAM",
        "Prompt",
        "SVI",
        "Default Gateway",
        "User EXEC",
        "Privileged EXEC",
        "Global Configuration",
        "Interface Configuration",
        "Frame",
        "MAC",
        "ROM",
        "LED",
        "PoE",
        "STP",
        "Autostate",
        "SDM",
        "IPv4",
        "IPv6",
        "RA",
        "VLAN Configuration"
      ]
    }
  },
  {
    "id": "network-theory-1-2",
    "subject": "Network",
    "section": "theory",
    "unit": 1,
    "title": "1.2 · إعداد منافذ Switch",
    "video": null,
    "summary": "Duplex يصف طريقة الإرسال والاستقبال على الوصلة. في Full Duplex يقدر الطرفان يرسلون ويستقبلون في الوقت نفسه. في Half Duplex يستخدمان الوسط بالتناوب؛ محاولة الإرسال المتزامن على وسط مشترك قد تسبب Collision، أي تصادم.",
    "steps": [
      "Full Duplex و Half Duplex",
      "ضبط Speed و Duplex على الطرفين",
      "Auto-MDIX واختيار نوع الكابل",
      "اختيار أمر show المناسب للتحقق",
      "تمييز حالات الواجهة وLine Protocol",
      "تفسير عدادات أخطاء الواجهة",
      "تسلسل تشخيص مشكلة الاتصال"
    ],
    "source": "SRWE Module 1 · الشرائح 24–37",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 1,
      "chapterTitle": "Basic Device Configuration",
      "part": "1.2",
      "english": "Configure Switch Ports",
      "range": "24–37",
      "topics": [
        {
          "title": "Full Duplex و Half Duplex",
          "slides": "25",
          "paragraphs": [
            "Duplex يصف طريقة الإرسال والاستقبال على الوصلة. في Full Duplex يقدر الطرفان يرسلون ويستقبلون في الوقت نفسه. في Half Duplex يستخدمان الوسط بالتناوب؛ محاولة الإرسال المتزامن على وسط مشترك قد تسبب Collision، أي تصادم.",
            "Microsegmentation تعني تخصيص وصلة مستقلة لكل جهاز عبر منفذ Switch. مع Full Duplex ما تكون التصادمات جزءًا من عمل الوصلة الطبيعي. منفذ بسرعة 100 Mb/s يقدر يرسل حتى 100 Mb/s ويستقبل حتى 100 Mb/s بالتزامن؛ هذا ما يحوّل سرعة اتجاه واحد إلى 200 Mb/s."
          ]
        },
        {
          "title": "ضبط Speed و Duplex على الطرفين",
          "slides": "26–27",
          "paragraphs": [
            "Speed هي سرعة الوصلة، و Auto-negotiation تفاوض بين الطرفين لاختيار خصائص يدعمونها، مثل السرعة و Duplex. إذا ضبطت طرفًا يدويًا وتركت الآخر على إعداد غير متوافق، ممكن يظهر Link لكن يكون الأداء ضعيفًا. راجع الطرفين قبل ما تنسب المشكلة إلى عنوان IP.",
            "مثال العرض يضبط Fa0/1 على 100 Mb/s و Full Duplex لتوضيح الأوامر. منافذ 10/100/1000 في الطراز المذكور تدعم Half أو Full عند 10 و100، وتعمل Full Duplex عند 1000. حدود المنافذ الضوئية وإعداداتها تعتمد على نوع المنفذ والوحدة؛ لا تعمم خصائص مثال واحد على كل الأجهزة.",
            "العرض يقترح التثبيت اليدوي للأجهزة المعروفة. عند التطبيق الفعلي اتبع متطلبات المنفذ والطرف المقابل؛ Auto-negotiation مناسب للمنافذ اللي تدعمه بصورة صحيحة. إذا احتجت الضبط اليدوي، اضبط الطرفين بقيم متوافقة ثم تحقق من النتيجة."
          ],
          "code": "S1# configure terminal\nS1(config)# interface fastEthernet 0/1\nS1(config-if)# duplex full\nS1(config-if)# speed 100\nS1(config-if)# end\nS1# copy running-config startup-config"
        },
        {
          "title": "Auto-MDIX واختيار نوع الكابل",
          "slides": "28",
          "paragraphs": [
            "Straight-Through يوصل الأزواج بترتيب مباشر، وCrossover يبدّل أزواج الإرسال والاستقبال. في Ethernet النحاسي التقليدي دون Auto-MDIX، يستخدم مثال المنهج Straight-Through بين Switch و PC أو Router، وCrossover بين جهازَي Switch. Auto-MDIX ميزة تتعرف على ترتيب الأزواج وتعدّله تلقائيًا على المنافذ اللي تدعمها.",
            "لتفعيل الميزة في الطراز المعروض نستخدم mdix auto، ونضبط speed auto وduplex auto بحسب متطلبات الدليل. بعدها نتحقق بأمر show controllers ethernet-controller مع phy، أي معلومات الطبقة المادية للمنفذ. الميزة ما تصلح كابلًا تالفًا، ودعمها يختلف بين الطرازات."
          ],
          "code": "S1# configure terminal\nS1(config)# interface fastEthernet 0/1\nS1(config-if)# speed auto\nS1(config-if)# duplex auto\nS1(config-if)# mdix auto\nS1(config-if)# end\nS1# show controllers ethernet-controller fastEthernet 0/1 phy | include Auto-MDIX"
        },
        {
          "title": "اختيار أمر show المناسب للتحقق",
          "slides": "29–31",
          "paragraphs": [
            "أوامر show تعرض حالة الجهاز وإعداداته. اختَر الأمر على أساس المعلومة اللي تحتاجها: حالة منفذ، أو إعداد حالي، أو إعداد محفوظ. وجود الأمر داخل running-config يثبت ضبطه، لكنه ما يثبت إن الطرف المقابل أو الوصلة يعملان.",
            "ابدأ بالمنفذ المحدد وراجع حالته و Speed و Duplex وعدادات الأخطاء. إذا احتجت تفاصيل العناوين، استخدم show ip interface أو show ipv6 interface مع اسم الواجهة. أسماء مثل Fa0/18 تخص المثال؛ تأكد من اسم المنفذ الموجود فعليًا في جهازك."
          ],
          "table": [
            [
              "الأمر من #",
              "المعلومة اللي يعرضها"
            ],
            [
              "show interfaces fa0/18",
              "حالة الواجهة وتفاصيلها وعداداتها"
            ],
            [
              "show running-config",
              "الإعداد الحالي"
            ],
            [
              "show startup-config",
              "الإعداد المحفوظ"
            ],
            [
              "show flash:",
              "ملفات Flash"
            ],
            [
              "show version",
              "إصدار النظام ومعلومات الجهاز"
            ],
            [
              "show history",
              "سجل الأوامر في الجلسة"
            ],
            [
              "show mac address-table",
              "ربط عناوين MAC بالمنافذ وVLANs"
            ],
            [
              "show ip interface fa0/18",
              "تفاصيل IPv4 على الواجهة"
            ],
            [
              "show ipv6 interface vlan 99",
              "تفاصيل IPv6 على واجهة الإدارة"
            ]
          ]
        },
        {
          "title": "تمييز حالات الواجهة وLine Protocol",
          "slides": "32",
          "paragraphs": [
            "في أول سطر من show interfaces، الحالة الأولى تخص الواجهة، والثانية Line Protocol، أي حالة بروتوكول ربط البيانات عليها. في منفذ Ethernet مادي، up/up تعني إن الواجهة وبروتوكولها في حالة تشغيل. هذا ما يثبت صحة عضوية VLAN أو إعداد PC.",
            "administratively down تعني إن الواجهة معطلة إداريًا بأمر shutdown. أما down/down فقد تنتج من فصل الكابل أو إغلاق الطرف المقابل أو خلل مادي. حالة up/down تحتاج فحص إعدادات الوصلة والبروتوكول والأخطاء. استخدم الحالة لتحديد مجال الفحص، ولا تعتبرها وحدها تشخيصًا نهائيًا."
          ]
        },
        {
          "title": "تفسير عدادات أخطاء الواجهة",
          "slides": "33–36",
          "paragraphs": [
            "Runts إطارات أقل من الحد الأدنى المعتاد، 64 بايت. Giants إطارات تتجاوز الحد المقبول للواجهة. المثال يستخدم 1518 بايت للإطار العادي غير الموسوم؛ إضافة وسم VLAN أو دعم Jumbo Frames، أي الإطارات الأكبر من الحجم المعتاد، يغيّر الحد المقبول بحسب الجهاز والإعداد.",
            "CRC، اختصار Cyclic Redundancy Check، آلية لكشف تلف البيانات. زيادة أخطائه قد تشير إلى كابل متضرر أو تداخل أو توصيل غير مناسب. Input errors تجمع أخطاء الاستقبال، وOutput errors تجمع الأخطاء اللي منعت الإرسال. Late collision تصادم بعد إرسال أول 512 بت في سياق Ethernet نصف المزدوج المعروض؛ من أسبابه المحتملة طول الكابل أو Duplex mismatch، أي عدم توافق Duplex بين الطرفين.",
            "قارن قراءتين خلال نشاط معروف. العداد القديم المرتفع ما يعني إن الخطأ مستمر الآن؛ اللي يهمك هل يزيد وقت الفحص. بعدها اختبر سببًا محددًا، مثل الكابل أو توافق الطرفين، وأعد القياس."
          ]
        },
        {
          "title": "تسلسل تشخيص مشكلة الاتصال",
          "slides": "37",
          "paragraphs": [
            "ابدأ بحالة الواجهة. إذا كانت down، راجع الطاقة والكابل والمنفذ ووجود shutdown. إذا كانت up، راجع أخطاء الواجهة وتوافق Speed و Duplex. بعد التأكد من الوصلة، انتقل إلى VLAN والعناوين والبوابة حسب نوع الاتصال المطلوب.",
            "عدّل عاملًا واحدًا له سبب واضح، ثم أعد أمر العرض واختبار الاتصال. بهذي الطريقة تعرف أثر التعديل وتقدر تفسر سبب التحسن، بدل تغيير عدة إعدادات بدون معرفة أيها عالج المشكلة."
          ]
        }
      ],
      "checks": [
        {
          "question": "الواجهة up/up لكن عداد CRC يزيد مع الحركة. من وين تبدأ الفحص؟",
          "answer": "ابدأ بالكابل والتوصيلات والتداخل والطرف المقابل؛ CRC يتعلق بسلامة الإطار. اختبر سببًا محددًا ثم راقب العداد، ولا تغيّر IP لمجرد ظهور أخطاء CRC."
        },
        {
          "question": "هل انطفاء لمبة المنفذ يثبت إن المنفذ متعطل؟",
          "answer": "لا. التفسير يعتمد على Mode والطراز؛ قد يعني عدم وجود Link، أو سرعة 10 Mb/s في وضع SPEED، أو Half Duplex في وضع DUPLX بالطراز المعروض. اربط المؤشر بأوامر التحقق."
        }
      ],
      "terms": [
        "Duplex",
        "Auto-negotiation",
        "Auto-MDIX",
        "CRC",
        "Collision",
        "Runts",
        "Giants",
        "Full Duplex",
        "Half Duplex",
        "Microsegmentation",
        "Speed",
        "Straight-Through",
        "Crossover",
        "Line Protocol",
        "Jumbo Frames",
        "Duplex mismatch"
      ]
    }
  },
  {
    "id": "network-theory-1-3",
    "subject": "Network",
    "section": "theory",
    "unit": 1,
    "title": "1.3 · تأمين الدخول عن بُعد",
    "video": null,
    "summary": "Remote Access يعني الوصول إلى إدارة الجهاز عبر الشبكة. Telnet يستخدم TCP port 23 افتراضيًا ويرسل محتوى الجلسة وبيانات الدخول دون تشفير. SSH، اختصار Secure Shell، يشفر جلسة الإدارة ويستخدم TCP port 22 افتراضيًا. TCP بروتوكول نقل، ورقم Port هنا يحدد الخدمة وليس فتحة الكابل.",
    "steps": [
      "حماية جلسة الإدارة باستخدام SSH",
      "إعداد هوية الجهاز والمصادقة المحلية",
      "إعداد VTY والتحقق من SSH",
      "مراجعة متطلبات الوصول الآمن"
    ],
    "source": "SRWE Module 1 · الشرائح 38–45",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 1,
      "chapterTitle": "Basic Device Configuration",
      "part": "1.3",
      "english": "Secure Remote Access",
      "range": "38–45",
      "topics": [
        {
          "title": "حماية جلسة الإدارة باستخدام SSH",
          "slides": "39–40",
          "paragraphs": [
            "Remote Access يعني الوصول إلى إدارة الجهاز عبر الشبكة. Telnet يستخدم TCP port 23 افتراضيًا ويرسل محتوى الجلسة وبيانات الدخول دون تشفير. SSH، اختصار Secure Shell، يشفر جلسة الإدارة ويستخدم TCP port 22 افتراضيًا. TCP بروتوكول نقل، ورقم Port هنا يحدد الخدمة وليس فتحة الكابل.",
            "التشفير يحمي محتوى الجلسة، لكنه ما يخفي عناوين IP وكل معلومات حركة الشبكة. لتشغيل SSH تحتاج إصدار IOS يدعم التشفير وعنوان إدارة قابلًا للوصول. في أسماء صور IOS التقليدية المذكورة بالعرض، k9 يدل على قدرات التشفير؛ راجع show version و show ip ssh للتأكد من دعم جهازك."
          ]
        },
        {
          "title": "إعداد هوية الجهاز والمصادقة المحلية",
          "slides": "41–42",
          "paragraphs": [
            "Hostname اسم الجهاز، و Domain Name اسم النطاق المستخدم ضمن إعداد هوية الجهاز في المثال. RSA خوارزمية مفاتيح عامة؛ الأمر crypto key generate rsa ينشئ مفاتيح SSH وقد يطلب حجم المفتاح بحسب الإصدار. إعداد اسم النطاق هنا ما يعني إنك أنشأت خدمة DNS، وهي خدمة تحويل الأسماء إلى عناوين.",
            "Authentication هي التحقق من هوية المستخدم. في Local Authentication نخزن حسابًا على الجهاز بأمر username مع secret، ثم نطلب استخدامه عبر login local. القيم بين < > في المثال تستبدلها بقيمك ولا تكتبها حرفيًا. كلمات المرور الضعيفة في أمثلة التدريب لا تصلح لاستخدام فعلي.",
            "تدخل هذي الأوامر عبر CLI، اختصار Command-Line Interface، أي واجهة سطر الأوامر. اسم الجهاز في Prompt يتغير بعد hostname؛ هذا يساعدك تتأكد إنك تعدّل الجهاز المقصود."
          ],
          "code": "Switch> enable\nSwitch# configure terminal\nSwitch(config)# hostname S1\nS1(config)# ip domain-name madar.example\nS1(config)# username learner secret <كلمة-مرور-قوية>\nS1(config)# crypto key generate rsa\nS1(config)# ip ssh version 2"
        },
        {
          "title": "إعداد VTY والتحقق من SSH",
          "slides": "42–44",
          "paragraphs": [
            "VTY، اختصار Virtual Teletype، خطوط منطقية لجلسات الإدارة عن بُعد. line vty 0 15 يختار الخطوط الموجودة بهذا النطاق في الطراز المدعوم. login local يربط الدخول بالحسابات المحلية، وtransport input ssh يحدد SSH كوسيلة دخول. هذي إعدادات مختلفة؛ إنشاء الحساب وحده ما يكمل إعداد الخدمة.",
            "بعد الإعداد، استخدم show ip ssh لمراجعة حالة الخدمة وإصدارها. ثم اتصل من PC يقدر يصل إلى عنوان SVI، مثل 172.17.99.11 في مثال الإدارة. show ssh يعرض الجلسات الموجودة. نجاح الوصول إلى العنوان يختلف عن نجاح المصادقة، فافحص كل جانب على حدة.",
            "الأمر crypto key zeroize rsa يحذف مفاتيح RSA، وقد يعطل خدمة SSH المعتمدة عليها. لا تستخدمه كأمر فحص؛ وظيفته حذف مفاتيح ضمن إجراء مقصود لإدارتها."
          ],
          "code": "S1# configure terminal\nS1(config)# line vty 0 15\nS1(config-line)# login local\nS1(config-line)# transport input ssh\nS1(config-line)# end\nS1# show ip ssh\nS1# show ssh\nS1# copy running-config startup-config",
          "note": "تصحيح للشريحة 42: في خرج IOS الموثق، version 1.99 يدل على دعم اتصالات SSHv1 و SSHv2، وversion 2.0 يدل على SSHv2 فقط. نستخدم ip ssh version 2 صراحة، ولا نعد الرقم 2 دلالة على قبول الإصدارين.",
          "link": "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_usr_ssh/configuration/12-2sx/sec-usr-ssh-12-2sx-book.pdf"
        },
        {
          "title": "مراجعة متطلبات الوصول الآمن",
          "slides": "45",
          "paragraphs": [
            "نشاط Configure SSH يجمع ثلاثة جوانب: حماية بيانات الدخول، وتشفير الاتصال، والتحقق من عمل SSH. راجع عنوان الإدارة والوصول إليه، ثم المفاتيح والإصدار، ثم VTY والحساب. نجاح خطوة منها ما يغني عن باقي المتطلبات.",
            "العرض يحتوي أهداف النشاط؛ ملف Packet Tracer نفسه غير مرفق. Packet Tracer برنامج لمحاكاة الشبكات، ودعم أوامره مرتبط بإصداره والأجهزة اللي يوفرها. ميّز بين خطأ الإعداد وعدم دعم أمر معين في المحاكاة."
          ]
        }
      ],
      "checks": [
        {
          "question": "حساب username وsecret موجود، لكن الدخول عبر SSH يفشل. ما الجوانب اللي تراجعها؟",
          "answer": "راجع الوصول إلى عنوان الإدارة، ودعم SSH وحالة مفاتيحه وإصداره، ثم transport input ssh وlogin local على VTY. بعدها تحقق من بيانات الحساب؛ وجود الحساب ما يثبت اكتمال إعداد الخدمة."
        },
        {
          "question": "هل service password-encryption يحمي جلسة Telnet مثل SSH؟",
          "answer": "لا. هذا الأمر يغيّر طريقة حفظ بعض كلمات المرور داخل الإعداد، لكنه ما يشفر جلسة Telnet. SSH هو بروتوكول جلسة الإدارة المشفرة."
        }
      ],
      "terms": [
        "SSH",
        "Telnet",
        "VTY",
        "RSA",
        "Authentication",
        "TCP",
        "CLI",
        "Hostname",
        "Domain Name",
        "DNS",
        "Local Authentication"
      ]
    }
  },
  {
    "id": "network-theory-1-4",
    "subject": "Network",
    "section": "theory",
    "unit": 1,
    "title": "1.4 · الإعدادات الأساسية لـRouter",
    "video": null,
    "summary": "Router يمرّر IP Packets بين الشبكات بناءً على جدول التوجيه والسياسات. Packet وحدة بيانات Layer 3، أي طبقة الشبكة. عند انتقالها عبر Ethernet تُغلّف داخل Frame على Layer 2، أي طبقة ربط البيانات. لذلك وظيفة توجيه Packet تختلف عن وظيفة تمرير Frame داخل VLAN.",
    "steps": [
      "وظيفة Router وإعداداته الأولية",
      "Dual Stack ومتطلبات تفعيل الواجهة",
      "عنونة واجهات Router في مثال العرض",
      "Loopback: واجهة منطقية داخل الجهاز"
    ],
    "source": "SRWE Module 1 · الشرائح 46–53",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 1,
      "chapterTitle": "Basic Device Configuration",
      "part": "1.4",
      "english": "Basic Router Configuration",
      "range": "46–53",
      "topics": [
        {
          "title": "وظيفة Router وإعداداته الأولية",
          "slides": "47–48",
          "paragraphs": [
            "Router يمرّر IP Packets بين الشبكات بناءً على جدول التوجيه والسياسات. Packet وحدة بيانات Layer 3، أي طبقة الشبكة. عند انتقالها عبر Ethernet تُغلّف داخل Frame على Layer 2، أي طبقة ربط البيانات. لذلك وظيفة توجيه Packet تختلف عن وظيفة تمرير Frame داخل VLAN.",
            "ابدأ باسم واضح، واحمِ Privileged EXEC باستخدام enable secret، ثم أمّن Console و VTY واحفظ الإعداد. Banner رسالة تظهر عند الدخول؛ توضح تنبيه الوصول لكنها ما تتحقق من هوية المستخدم. service password-encryption يستخدم إخفاءً ضعيفًا لبعض كلمات المرور في IOS التقليدي، فلا يعوّض secret أو SSH."
          ],
          "code": "Router> enable\nRouter# configure terminal\nRouter(config)# hostname R1\nR1(config)# enable secret <كلمة-مرور-قوية>\nR1(config)# line console 0\nR1(config-line)# password <كلمة-مرور-للوحدة>\nR1(config-line)# login\nR1(config-line)# exit\nR1(config)# banner motd #Authorized access only#\nR1(config)# end\nR1# copy running-config startup-config"
        },
        {
          "title": "Dual Stack ومتطلبات تفعيل الواجهة",
          "slides": "49–50",
          "paragraphs": [
            "Dual Stack يعني تشغيل IPv4 و IPv6 معًا. IPv4 يستخدم عنوانًا من 32 بت، و IPv6 يستخدم 128 بت. لكل بروتوكول عنونته وجدول توجيهه؛ تشغيلهما معًا ما يترجم أحدهما للآخر تلقائيًا. Prefix Length هو عدد بتات جزء الشبكة، مثل /24 أو /64.",
            "لإعداد الواجهة تحتاج عنوانًا مناسبًا وقناعًا أو Prefix Length، ثم no shutdown لإزالة التعطيل الإداري، واتصالًا سليمًا بالطرف المقابل. Router قد يوفر واجهات LAN للشبكة المحلية وWAN للربط بين شبكات أوسع؛ نوع المنفذ يعتمد على الطراز والوحدات المركبة. Description وصف للواجهة يساعد على تتبع وظيفتها، لكنه ما ينشئ الاتصال."
          ]
        },
        {
          "title": "عنونة واجهات Router في مثال العرض",
          "slides": "51",
          "paragraphs": [
            "في R1، الواجهة Gi0/0/0 تتصل بشبكة 192.168.10.0/24 والواجهة Gi0/0/1 بشبكة 192.168.11.0/24. نعطي كل واجهة عنوانًا من شبكتها. ويعرض المثال Serial0/0/0 لشبكة 209.165.200.224/30؛ Serial وصلة تسلسلية تختلف عن Ethernet في المنفذ والكابل ومتطلبات التشغيل.",
            "عناوين IPv6 اللي تبدأ بـ2001:db8 في المثال مخصصة للتوثيق والأمثلة. عند التطبيق استخدم عناوين مختبرك وأسماء منافذه؛ GigabitEthernet0/1 في طراز قد يقابله GigabitEthernet0/0/1 في طراز آخر. اعرض الواجهات أولًا، ثم اربط كل أمر بالمنفذ الصحيح."
          ],
          "code": "R1# configure terminal\nR1(config)# interface gigabitEthernet 0/0/0\nR1(config-if)# ip address 192.168.10.1 255.255.255.0\nR1(config-if)# ipv6 address 2001:db8:acad:1::1/64\nR1(config-if)# description Link to LAN 1\nR1(config-if)# no shutdown\nR1(config-if)# exit\nR1(config)# interface gigabitEthernet 0/0/1\nR1(config-if)# ip address 192.168.11.1 255.255.255.0\nR1(config-if)# ipv6 address 2001:db8:acad:2::1/64\nR1(config-if)# description Link to LAN 2\nR1(config-if)# no shutdown\nR1(config-if)# exit\nR1(config)# interface serial 0/0/0\nR1(config-if)# ip address 209.165.200.225 255.255.255.252\nR1(config-if)# ipv6 address 2001:db8:acad:3::225/64\nR1(config-if)# description Link to R2\nR1(config-if)# no shutdown\nR1(config-if)# end\nR1# copy running-config startup-config",
          "note": "المثال يعرض عنونة الواجهات الثلاث في الشريحة 51؛ تفعيل توجيه IPv6 بينها يحتاج ipv6 unicast-routing عند طلب التوجيه. تشغيل Serial قد يحتاج إعداد Clocking بحسب طرف الوصلة، وهو غير موضح في هذا المثال."
        },
        {
          "title": "Loopback: واجهة منطقية داخل الجهاز",
          "slides": "52–53",
          "paragraphs": [
            "Loopback واجهة برمجية ما ترتبط بمنفذ كابل. تستخدم للاختبار والإدارة وبعض وظائف البروتوكولات، وتبقى عادة up ما دام Router يعمل والواجهة غير معطلة. في المختبر تقدر تستخدم أكثر من Loopback لتمثيل شبكات إضافية.",
            "إنشاء Loopback ما يضمن وصول الأجهزة الأخرى إليها؛ تحتاج الشبكة مسارًا إلى عنوانها ومسار عودة مناسبًا. اختَر عنوانًا ما يتعارض مع واجهة أخرى، ثم تحقق من ظهوره وحالته. المثال التالي عنوان مضيف واحد بقناع /32؛ هذا اختيار للمثال وليس القناع الوحيد الممكن لواجهة Loopback."
          ],
          "code": "R1# configure terminal\nR1(config)# interface loopback 0\nR1(config-if)# ip address 10.0.0.1 255.255.255.255\nR1(config-if)# end\nR1# show ip interface brief"
        }
      ],
      "checks": [
        {
          "question": "واجهة Router عليها عنوان لكنها administratively down. ما معنى الحالة؟",
          "answer": "الواجهة معطلة إداريًا. ادخل Interface Configuration للواجهة المطلوبة ونفّذ no shutdown، ثم تحقق من الوصلة والطرف المقابل وحالة الواجهة."
        },
        {
          "question": "هل إضافة Description تغيّر عنوان الشبكة أو تجعل الواجهة متصلة؟",
          "answer": "لا. Description يوثّق وظيفة الواجهة. العنوان والقناع وحالة الواجهة والتوصيل هي اللي تحدد الاتصال؛ الوصف ما يستبدلها."
        }
      ],
      "terms": [
        "Router",
        "Packet",
        "Dual Stack",
        "IPv4",
        "IPv6",
        "Prefix Length",
        "Loopback",
        "Layer 2",
        "Layer 3",
        "LAN",
        "WAN",
        "Serial",
        "Description",
        "Banner"
      ]
    }
  },
  {
    "id": "network-theory-1-5",
    "subject": "Network",
    "section": "theory",
    "unit": 1,
    "title": "1.5 · التحقق من الشبكات المتصلة مباشرة",
    "video": null,
    "summary": "Directly Connected Network شبكة متصلة مباشرة بواجهة Router. ابدأ بمراجعة العنوان والحالة باستخدام show ip interface brief أو show ipv6 interface brief، ثم راجع جدول التوجيه بأمر show ip route أو show ipv6 route. جدول التوجيه هو قائمة المسارات اللي يستخدمها الجهاز لتحديد وجهة إرسال Packet.",
    "steps": [
      "التحقق من الواجهات والمسارات المتصلة",
      "تمييز عناوين IPv6 على الواجهة",
      "تنظيم مخرجات show وتصفيتها",
      "Command History واختبار الاتصال"
    ],
    "source": "SRWE Module 1 · الشرائح 54–63",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 1,
      "chapterTitle": "Basic Device Configuration",
      "part": "1.5",
      "english": "Verify Directly Connected Networks",
      "range": "54–63",
      "topics": [
        {
          "title": "التحقق من الواجهات والمسارات المتصلة",
          "slides": "55–56، 59–60",
          "paragraphs": [
            "Directly Connected Network شبكة متصلة مباشرة بواجهة Router. ابدأ بمراجعة العنوان والحالة باستخدام show ip interface brief أو show ipv6 interface brief، ثم راجع جدول التوجيه بأمر show ip route أو show ipv6 route. جدول التوجيه هو قائمة المسارات اللي يستخدمها الجهاز لتحديد وجهة إرسال Packet.",
            "الرمز C يعني Connected Route، أي مسار الشبكة المتصلة. والرمز L يعني Local Route، أي مسار عنوان الواجهة نفسها عشان يعالج الجهاز الحزم الموجهة له. يكون L بقناع /32 في IPv4 و/128 في IPv6 لأنه يمثل عنوانًا واحدًا. عرضه يختلف في إصدارات IOS الأقدم؛ الأمثلة هنا مرتبطة بسياق IOS 15 في العرض.",
            "الشريحة 59 تذكر Administrative Distance بقيمة 0 للمسار المحلي. هذا رقم يعبّر عن أفضلية مصدر المسار عند المقارنة بين مصادر لنفس الشبكة؛ ما يمثل سرعة الاتصال أو عدد الأجهزة. نذكره هنا لقراءة المخرجات، وتفصيل اختيار المسارات يأتي في موضوع التوجيه."
          ],
          "code": "R1# show ip interface brief\nR1# show ipv6 interface brief\nR1# show ip route\nR1# show ipv6 route",
          "table": [
            [
              "المثال التوضيحي",
              "المعنى"
            ],
            [
              "C 192.168.10.0/24",
              "الشبكة المتصلة بالواجهة"
            ],
            [
              "L 192.168.10.1/32",
              "عنوان Router نفسه على تلك الواجهة"
            ]
          ]
        },
        {
          "title": "تمييز عناوين IPv6 على الواجهة",
          "slides": "57–58",
          "paragraphs": [
            "Global Unicast عنوان IPv6 مخصص للتواصل الفردي ويمكن توجيهه بين الشبكات عند توفر المسارات والسياسات. Link-local عنوان محلي للوصلة من FE80::/10؛ Router ما يمرره إلى وصلة أخرى. في IOS المذكور، إضافة عنوان Global Unicast تؤدي أيضًا إلى إنشاء Link-local، وقد تحتاج تحديد الواجهة عند اختبار الوصول إلى عنوان Link-local.",
            "Multicast يعني إرسالًا إلى مجموعة مشتركين. المجموعات اللي تبدأ بـFF02 في المثال نطاقها الوصلة المحلية. هذي عناوين مجموعات، وليست عناوين Unicast خاصة بالواجهة. استخدم show ipv6 interface لعرض التفاصيل، وقارنها بإعداد الواجهة في show running-config interface."
          ],
          "code": "R1# show ipv6 interface gigabitEthernet 0/0/0\nR1# show running-config interface gigabitEthernet 0/0/0"
        },
        {
          "title": "تنظيم مخرجات show وتصفيتها",
          "slides": "61",
          "paragraphs": [
            "IOS يقسم المخرجات الطويلة إلى صفحات؛ العرض يذكر 24 سطرًا كإعداد افتراضي. عند ظهور --More--، Enter يكمل سطرًا وSpace يكمل صفحة. terminal length 0 يلغي التوقف بين الصفحات في الجلسة، وتقدر ترجع التقسيم بتحديد عدد الأسطر المناسب.",
            "الرمز | يتيح تصفية المخرجات. include يعرض الأسطر المطابقة، وexclude يستبعدها، وbegin يعرض أول تطابق وكل ما بعده، وsection يعرض القسم المطابق حيث يدعمه الأمر. اختر التصفية بحسب سؤالك؛ غياب معلومة عن الخرج المصفّى ما يعني إنها غير موجودة في الخرج الكامل."
          ],
          "code": "R1# show running-config | section interface\nR1# show interfaces | include line protocol\nR1# show running-config | begin line vty\nR1# terminal length 0\nR1# terminal length 24"
        },
        {
          "title": "Command History واختبار الاتصال",
          "slides": "62–63",
          "paragraphs": [
            "Command History سجل مؤقت لأوامر الجلسة. السهم للأعلى أو Ctrl+P يستدعي أحدث أمر ثم الأقدم، والسهم للأسفل أو Ctrl+N يرجع للأحدث. show history يعرض السجل، وterminal history size يغيّر سعته للجلسة. القيمة الافتراضية المذكورة في العرض عشرة أوامر.",
            "بعد مراجعة العناوين والمسارات، استخدم Ping لاختبار الاستجابة. يرسل ICMP Echo Request وينتظر Echo Reply؛ ICMP بروتوكول لرسائل التحكم والتشخيص، وEcho Request طلب رد يقابله Echo Reply. نجاح الاختبار يثبت استجابة بين الطرفين في وقت الفحص، لكنه ما يثبت عمل SSH أو كل خدمات الشبكة. نشاط العرض يجمع تحقق IPv4 و IPv6 وتشخيص الاتصال."
          ],
          "code": "R1# show history\nR1# terminal history size 50\nR1# ping 192.168.10.10"
        }
      ],
      "checks": [
        {
          "question": "ما الفرق بين C 192.168.10.0/24 وL 192.168.10.1/32 في جدول التوجيه؟",
          "answer": "C يمثل الشبكة المتصلة، وL يمثل عنوان واجهة Router نفسها. القناع /32 يحدد عنوان IPv4 واحدًا يستقبل الجهاز الحزم الموجهة له."
        },
        {
          "question": "ما ظهر الخطأ بعد استخدام include. هل هذا يكفي لاستبعاده؟",
          "answer": "لا. يمكن أن التصفية استبعدت الأسطر اللي توضح المشكلة. راجع الخرج المناسب والسياق، ثم اربط النتيجة بفحص الحالة والاتصال."
        }
      ],
      "terms": [
        "Connected Route",
        "Local Route",
        "Link-local",
        "Multicast",
        "Filter",
        "Ping",
        "Global Unicast",
        "Unicast",
        "ICMP",
        "Echo Request",
        "Echo Reply",
        "Command History",
        "Administrative Distance"
      ]
    }
  },
  {
    "id": "network-theory-1-6",
    "subject": "Network",
    "section": "theory",
    "unit": 1,
    "title": "1.6 · تطبيق ومراجعة الشابتر الأول",
    "video": null,
    "summary": "راجع تسلسل العمل من الإقلاع إلى التحقق: تتعرف على الجهاز ومنافذه، وتضبط عنوان إدارة Switch أو واجهات Router، ثم تؤمّن الوصول وتحفظ الإعداد. لكل خطوة نتيجة محددة تراجعها؛ ظهور Prompt مثلًا ما يثبت إن عنوان الإدارة قابل للوصول.",
    "steps": [
      "ربط الإعداد بالحماية والتحقق",
      "مراجعة تشخيصية لإعداد الإدارة"
    ],
    "source": "SRWE Module 1 · الشرائح 64–70",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 1,
      "chapterTitle": "Basic Device Configuration",
      "part": "1.6",
      "english": "Module Practice and Quiz",
      "range": "64–70",
      "topics": [
        {
          "title": "ربط الإعداد بالحماية والتحقق",
          "slides": "65–69",
          "paragraphs": [
            "راجع تسلسل العمل من الإقلاع إلى التحقق: تتعرف على الجهاز ومنافذه، وتضبط عنوان إدارة Switch أو واجهات Router، ثم تؤمّن الوصول وتحفظ الإعداد. لكل خطوة نتيجة محددة تراجعها؛ ظهور Prompt مثلًا ما يثبت إن عنوان الإدارة قابل للوصول.",
            "أنشطة الشابتر تشمل بناء شبكة صغيرة، وتهيئة الأجهزة، وعنونة PC باستخدام IPv4 و IPv6، وإعداد SSH والتحقق من الاتصال. المتاح هنا أهداف الأنشطة ومحتوى العرض، وليس ملفاتها التفصيلية. أسئلة المراجعة من إعداد مدار وليست نسخة من اختبار Cisco."
          ]
        },
        {
          "title": "مراجعة تشخيصية لإعداد الإدارة",
          "slides": "65–70",
          "paragraphs": [
            "في المثال، S1 عنوانه 172.17.99.11/24 وبوابته 172.17.99.1. إذا نجح الوصول من نفس الشبكة وفشل SSH من شبكة ثانية، ابدأ بمراجعة بوابة الإدارة ومسار الوصول والعودة، ثم إعداد SSH و VTY وأي سياسة تحد الوصول. اختَر الخطوة التالية على أساس نتيجة الفحص، بدل افتراض إن كلمة المرور هي السبب.",
            "تأكد إنك تميّز بين الإعداد الحالي والمحفوظ، وبين up/up ونجاح Ping، وبين إخفاء كلمة المرور داخل الإعداد وتشفير الجلسة. هذي فروق تحدد معنى الأمر ومكان استخدامه، وتساعدك تتعامل مع مثال جديد تختلف فيه العناوين والمنافذ."
          ]
        }
      ],
      "checks": [
        {
          "question": "انقطع SSH بعد إعادة تشغيل مخطط لها. كيف ترتب التحقق؟",
          "answer": "راجع الإقلاع وحالة الواجهات و VLAN الإدارة وعنوانها وبوابتها. بعدها راجع الإعداد المحفوظ وإعداد SSH والمفاتيح و VTY. افحص الأدلة قبل ما تحصر السبب في بيانات الحساب."
        },
        {
          "question": "كيف تتحقق إن الإعداد المطلوب بقي بعد إعادة التشغيل؟",
          "answer": "راجع الإعداد الفعلي وحالة الواجهات واختبار الاتصال بعد التشغيل. تنفيذ copy قبل إعادة التشغيل خطوة حفظ، لكنه ما يعوّض فحص النتيجة بعدها."
        }
      ],
      "terms": [
        "running-config",
        "startup-config",
        "Console",
        "SSH",
        "SVI"
      ]
    }
  },
  {
    "id": "network-theory-2-1",
    "subject": "Network",
    "section": "theory",
    "unit": 2,
    "title": "2.1 · كيف يمرّر Switch الإطارات؟",
    "video": null,
    "summary": "Ingress منفذ دخول Frame إلى Switch، وEgress منفذ خروجه. Frame إطار بيانات Ethernet، ويحتوي Source MAC، أي عنوان المصدر، وDestination MAC، أي عنوان الوجهة. MAC، اختصار Media Access Control، عنوان على Layer 2، أي طبقة ربط البيانات. Switch يتعلم عنوان المصدر، ثم يبحث عن عنوان الوجهة ليقرر وين يمرّر الإطار.",
    "steps": [
      "تعلّم عناوين MAC وتحديد منفذ الخروج",
      "Known Unicast وUnknown Unicast",
      "Store-and-Forward وفحص سلامة الإطار",
      "Cut-Through وFragment-Free"
    ],
    "source": "SRWE Module 2 · الشرائح 12–19",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 2,
      "chapterTitle": "Switching Concepts",
      "part": "2.1",
      "english": "Frame Forwarding",
      "range": "12–19",
      "topics": [
        {
          "title": "تعلّم عناوين MAC وتحديد منفذ الخروج",
          "slides": "13–15",
          "paragraphs": [
            "Ingress منفذ دخول Frame إلى Switch، وEgress منفذ خروجه. Frame إطار بيانات Ethernet، ويحتوي Source MAC، أي عنوان المصدر، وDestination MAC، أي عنوان الوجهة. MAC، اختصار Media Access Control، عنوان على Layer 2، أي طبقة ربط البيانات. Switch يتعلم عنوان المصدر، ثم يبحث عن عنوان الوجهة ليقرر وين يمرّر الإطار.",
            "إذا وصل إطار من PC-A على Fa0/1 ضمن VLAN 10، يسجل Switch عنوان PC-A مع المنفذ و VLAN. بعدها يبحث عن Destination MAC في جدول VLAN نفسها. قد يُنفّذ MAC Address Table باستخدام CAM، اختصار Content Addressable Memory، وهي ذاكرة تبحث عن الإدخال بناءً على محتواه. وظيفة التعلم تختلف عن قرار التمرير، حتى لو حصل الاثنان عند استقبال الإطار نفسه."
          ],
          "note": "تصحيح مصطلح ملخص الشريحة 26: CAM تعني Content Addressable Memory، كما ورد في الشريحة 14، وليست Content Accessible Memory."
        },
        {
          "title": "Known Unicast وUnknown Unicast",
          "slides": "14–16",
          "paragraphs": [
            "Unicast إرسال إلى وجهة فردية. إذا كان عنوان الوجهة موجودًا في جدول MAC ضمن VLAN، نسميه Known Unicast، ويمرّر Switch الإطار إلى المنفذ المناسب. إذا كانت الوجهة على منفذ الدخول نفسه، يرشّح الإطار وما يعيده عبر نفس المنفذ.",
            "إذا ما كان عنوان الوجهة موجودًا في الجدول، نسميه Unknown Unicast. هنا يستخدم Switch آلية Flooding: يرسل نسخة عبر المنافذ المؤهلة في VLAN نفسها، باستثناء منفذ الدخول. عنوان الوجهة يظل فرديًا؛ التوزيع إلى عدة منافذ ما يغيّره إلى عنوان Broadcast، وهو عنوان البث لجميع الأجهزة داخل النطاق.",
            "لما يرد الطرف الثاني، يتعلم Switch عنوانه من Source MAC في الرد. Aging Timer يحدد مدة بقاء الإدخال الديناميكي بدون تحديث؛ مثال العرض خمس دقائق، وتُحدّث المدة عند التعلم من المصدر مجددًا. الفيديو المذكور غير مرفق، فالشرح هنا مبني على النص المتاح ومبدأ التعلم والتمرير."
          ],
          "flow": [
            "PC-A يرسل إطارًا إلى PC-B",
            "تعلّم Source MAC على منفذ الدخول وVLAN",
            "البحث عن Destination MAC في جدول VLAN",
            "وجهة معروفة: منفذها / مجهولة: Flooding ضمن VLAN"
          ]
        },
        {
          "title": "Store-and-Forward وفحص سلامة الإطار",
          "slides": "17–18",
          "paragraphs": [
            "ASIC، اختصار Application-Specific Integrated Circuit، شريحة متخصصة تنفذ مهام التمرير. في Store-and-Forward ينتظر Switch وصول الإطار كاملًا، ثم يفحص FCS، اختصار Frame Check Sequence، وهو حقل كشف أخطاء الإطار. يستخدم الفحص CRC، أي Cyclic Redundancy Check، لمقارنة نتيجة الحساب بالقيمة المستلمة قبل التمرير.",
            "الإطار اللي يفشل في الفحص يُستبعد. وخلال الانتظار يُخزّن في Buffer، أي ذاكرة مؤقتة؛ وهذا يساعد عند اختلاف سرعة الدخول والخروج أو وجود ازدحام مؤقت. سعة Buffer محدودة، لذلك استمرار الحركة بأكثر من قدرة منفذ الخروج قد يؤدي إلى إسقاط إطارات."
          ]
        },
        {
          "title": "Cut-Through وFragment-Free",
          "slides": "19",
          "paragraphs": [
            "Cut-Through يبدأ تمرير الإطار بعد قراءة معلومات الوجهة اللازمة، قبل استلامه كاملًا. بهذا يقل زمن الانتظار في الظروف المناسبة، لكنه يبدأ الإرسال قبل التحقق من FCS في نهاية الإطار؛ لذلك ممكن يمرّر إطارًا تالفًا. تقليل التأخير هنا له مقابل في طريقة التحقق من السلامة.",
            "Fragment-Free نوع من Cut-Through ينتظر أول 64 بايت لتجنب تمرير الإطارات القصيرة المرتبطة ببعض التصادمات. هذا ما يعادل فحص FCS للإطار الكامل. في نموذج المقارنة بالعرض، اختلاف سرعات المنافذ يستدعي التخزين؛ وفي الأجهزة الفعلية يعتمد أسلوب المعالجة على البنية والطراز. رقم التأخير المذكور في المثال ليس ضمانًا ثابتًا لكل جهاز."
          ],
          "table": [
            [
              "الطريقة",
              "متى يبدأ التمرير؟",
              "الفحص"
            ],
            [
              "Store-and-Forward",
              "بعد استلام الإطار كاملًا",
              "يفحص FCS قبل التمرير"
            ],
            [
              "Cut-Through",
              "بعد معلومات الوجهة اللازمة",
              "قد يبدأ قبل معرفة سلامة FCS"
            ],
            [
              "Fragment-Free",
              "بعد أول 64 بايت",
              "لا يساوي فحص الإطار كاملًا"
            ]
          ]
        }
      ],
      "checks": [
        {
          "question": "وصل إطار مصدره MAC-A ووجهته MAC-B غير الموجودة في الجدول. أي عنوان يتعلمه Switch، وكيف يمرّر الإطار؟",
          "answer": "يتعلم MAC-A على منفذ الدخول ضمن VLAN. ثم يوزع الإطار عبر المنافذ المؤهلة في VLAN نفسها عدا منفذ الدخول؛ لأن MAC-B غير موجودة في الجدول."
        },
        {
          "question": "ليش قد يمرّر Cut-Through إطارًا تالفًا؟",
          "answer": "لأنه يبدأ الإرسال قبل استلام الإطار كاملًا وفحص FCS. قراءة الوجهة تكفي لبدء قرار التمرير، لكنها ما تثبت سلامة الإطار."
        }
      ],
      "terms": [
        "Frame",
        "MAC",
        "Ingress",
        "Egress",
        "CAM",
        "Flooding",
        "ASIC",
        "FCS",
        "Buffer",
        "Store-and-Forward",
        "Cut-Through",
        "Fragment-Free",
        "Source MAC",
        "Destination MAC"
      ]
    }
  },
  {
    "id": "network-theory-2-2",
    "subject": "Network",
    "section": "theory",
    "unit": 2,
    "title": "2.2 · نطاقات التصادم والبث",
    "video": null,
    "summary": "Collision Domain نطاق يمكن أن تتصادم فيه الإرسالات عند مشاركة الوسط في Half Duplex، أي الإرسال والاستقبال بالتناوب. Switch يفصل الوصلات، ومع Full Duplex يرسل الطرفان ويستقبلان بالتزامن دون تنافس من هذا النوع. لذلك ما تكون التصادمات جزءًا طبيعيًا من وصلة Full Duplex سليمة.",
    "steps": [
      "Collision Domain وعلاقته بـ Duplex",
      "Broadcast Domain وحدود VLAN",
      "عوامل تخفيف الازدحام في Switch"
    ],
    "source": "SRWE Module 2 · الشرائح 20–23",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 2,
      "chapterTitle": "Switching Concepts",
      "part": "2.2",
      "english": "Switching Domains",
      "range": "20–23",
      "topics": [
        {
          "title": "Collision Domain وعلاقته بـ Duplex",
          "slides": "21",
          "paragraphs": [
            "Collision Domain نطاق يمكن أن تتصادم فيه الإرسالات عند مشاركة الوسط في Half Duplex، أي الإرسال والاستقبال بالتناوب. Switch يفصل الوصلات، ومع Full Duplex يرسل الطرفان ويستقبلان بالتزامن دون تنافس من هذا النوع. لذلك ما تكون التصادمات جزءًا طبيعيًا من وصلة Full Duplex سليمة.",
            "إذا ظهرت Collisions على وصلة يفترض إنها Full Duplex، راجع إعداد الطرفين ونوع الوسط. وتأكد هل العداد يزيد الآن أو إنه يحتفظ بأخطاء سابقة. كثرة الحركة وحدها ما تبرر تصادمات على وصلة Full Duplex."
          ]
        },
        {
          "title": "Broadcast Domain وحدود VLAN",
          "slides": "22",
          "paragraphs": [
            "Broadcast Domain نطاق وصول بث Layer 2. داخل VLAN واحدة، يمرّر Switch إطار Broadcast عبر المنافذ المؤهلة عدا منفذ دخوله. Trunk، وهو رابط يحمل عدة VLANs، قد يمد VLAN نفسها إلى Switch آخر؛ لذلك نهاية الجهاز المادي مو بالضرورة نهاية نطاق البث.",
            "كل VLAN تمثل نطاق بث مستقلًا. Router أو Layer 3 Switch يوجّه IP بين الشبكات عند إعداده لذلك، ولا يمرّر بث Layer 2 مباشرة من VLAN إلى أخرى. تقسيم شبكة واحدة إلى عدة VLANs يزيد عدد نطاقات البث ويقلل حجم كل نطاق عند توزيع الأجهزة بينها. هذا يقلل الأجهزة اللي تستقبل بثًا ما يخصها."
          ],
          "flow": [
            "VLAN 10: PC-A + PC-B",
            "حد منطقي للبث",
            "VLAN 20: PC-C + PC-D"
          ]
        },
        {
          "title": "عوامل تخفيف الازدحام في Switch",
          "slides": "23",
          "paragraphs": [
            "تحسن الأداء يعتمد على أكثر من عامل: وصلات مستقلة تعمل Full Duplex، وسرعات منافذ مناسبة، وقدرة تمرير داخلية، وBuffers تستوعب الانتظار المؤقت. Port Density تعني عدد المنافذ، و Switching Fabric هي البنية الداخلية اللي تنقل البيانات بينها.",
            "المنفذ السريع ما يضمن إن المسار كاملًا بنفس السرعة؛ منفذ خروج أبطأ أو حمل مستمر قد يسبب عنق زجاجة. وBuffer يخفف ازدحامًا مؤقتًا لكنه ما يعالج حملًا أعلى من قدرة الشبكة بشكل دائم. أرقام السرعات في العرض أمثلة للطرازات المذكورة وليست حدًا عامًا للتقنية."
          ]
        }
      ],
      "checks": [
        {
          "question": "VLAN 10 ممتدة عبر جهازَي Switch بينهما Trunk. هل لكل جهاز نطاق بث منفصل لهذه VLAN؟",
          "answer": "لا. VLAN 10 نفسها نطاق بث ممتد عبر الوصلة ما دامت إعداداتها تسمح بمرورها. الفصل المنطقي حسب VLAN، وليس حسب عدد أجهزة Switch."
        },
        {
          "question": "هل زيادة Buffer تكفي لمعالجة ازدحام مستمر؟",
          "answer": "لا. الذاكرة تمتص انتظارًا مؤقتًا ضمن سعتها. إذا استمر معدل الدخول أعلى من قدرة الخروج، قد تمتلئ وتبدأ الإطارات بالسقوط."
        }
      ],
      "terms": [
        "Collision Domain",
        "Broadcast Domain",
        "Switching Fabric",
        "Port Density",
        "Trunk",
        "Broadcast"
      ]
    }
  },
  {
    "id": "network-theory-2-3",
    "subject": "Network",
    "section": "theory",
    "unit": 2,
    "title": "2.3 · مراجعة الشابتر الثاني",
    "video": null,
    "summary": "افترض إن PC-A و PC-B في VLAN واحدة على منفذين مختلفين، وجدول MAC فارغ. عند أول إطار من A إلى B، يتعلم Switch عنوان A ثم يستخدم Flooding لأن عنوان B غير معروف. لما يرد B، يتعلم عنوانه ويمرّر الرد إلى منفذ A المعروف. بعد كذا يقدر يحدد منفذ كل وجهة من الجدول.",
    "steps": [
      "تتبّع التعلم والتمرير خلال اتصال واحد",
      "مقارنة طرق التمرير ونطاقات الشبكة"
    ],
    "source": "SRWE Module 2 · الشرائح 24–26",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 2,
      "chapterTitle": "Switching Concepts",
      "part": "2.3",
      "english": "Module Practice and Quiz",
      "range": "24–26",
      "topics": [
        {
          "title": "تتبّع التعلم والتمرير خلال اتصال واحد",
          "slides": "25–26",
          "paragraphs": [
            "افترض إن PC-A و PC-B في VLAN واحدة على منفذين مختلفين، وجدول MAC فارغ. عند أول إطار من A إلى B، يتعلم Switch عنوان A ثم يستخدم Flooding لأن عنوان B غير معروف. لما يرد B، يتعلم عنوانه ويمرّر الرد إلى منفذ A المعروف. بعد كذا يقدر يحدد منفذ كل وجهة من الجدول.",
            "إذا حُذفت الإدخالات الديناميكية أو انتهت مدة بقائها، قد يعود Flooding إلى أن يتعلم الجهاز العناوين مجددًا. هذا تغيير في معرفة Switch بمواقع الأجهزة؛ ما يعني إن VLANs اندمجت أو إن عنوان Unicast تحول إلى Broadcast."
          ]
        },
        {
          "title": "مقارنة طرق التمرير ونطاقات الشبكة",
          "slides": "25–26",
          "paragraphs": [
            "قارن Store-and-Forward مع Cut-Through من ناحية وقت بدء التمرير وإمكانية فحص الإطار قبل إرساله. بعدها قارن Collision Domain مع Broadcast Domain: الأول يتعلق بتنافس الإرسال على الوسط، والثاني بحدود انتشار بث Layer 2.",
            "المراجعة التالية تعتمد على مفاهيم العرض وصيغت في مدار. اكتب أو حدد تفسيرك أولًا، ثم افتح الإجابة للمقارنة. عرض الإجابة للمراجعة ما يُسجل بوصفه محاولة منك أو إثباتًا للإتقان."
          ]
        }
      ],
      "checks": [
        {
          "question": "وصل Frame وجهته معروفة على نفس منفذ دخوله. كيف يتعامل معه Switch؟",
          "answer": "يرشّحه وما يعيد إرساله من نفس المنفذ؛ الوجهة موجودة في جهة الدخول، فلا يحتاج تمريره إلى منفذ آخر."
        },
        {
          "question": "عند تقسيم نطاق بث واحد إلى عدة VLANs، هل يقل عدد Broadcast Domains؟",
          "answer": "لا. يزيد عدد النطاقات المستقلة ويصغر حجم كل واحد منها بحسب توزيع الأجهزة. اللي يقل هو انتشار البث من مجموعة إلى مجموعات ثانية."
        },
        {
          "question": "ما الفرق بين Unknown Unicast و Broadcast رغم إن كليهما قد يُوزع إلى عدة منافذ؟",
          "answer": "Unknown Unicast يحمل عنوان وجهة فردية ما يعرف Switch موقعها. Broadcast يحمل عنوان بث. Flooding طريقة توزيع، ولا يغيّر نوع عنوان الوجهة."
        }
      ],
      "terms": [
        "Known Unicast",
        "Unknown Unicast",
        "Aging Timer"
      ]
    }
  },
  {
    "id": "network-theory-3-1",
    "subject": "Network",
    "section": "theory",
    "unit": 3,
    "title": "3.1 · فهم VLAN وأنواعها",
    "video": null,
    "summary": "VLAN، اختصار Virtual Local Area Network، شبكة محلية افتراضية تجمع الأجهزة منطقيًا حسب القسم أو الوظيفة. تقدر تفصل أجهزة متصلة بنفس Switch، أو تمد المجموعة نفسها عبر أكثر من جهاز. VLAN 10 و VLAN 20 نطاقا بث مستقلان حتى لو تشاركا نفس العتاد.",
    "steps": [
      "تقسيم الشبكة منطقيًا باستخدام VLAN",
      "Default VLAN وData VLAN وManagement VLAN",
      "Native VLAN والإطارات غير الموسومة",
      "Voice VLAN ومتطلبات حركة الصوت"
    ],
    "source": "SRWE Module 3 · الشرائح 14–20",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 3,
      "chapterTitle": "VLANs",
      "part": "3.1",
      "english": "Overview of VLANs",
      "range": "14–20",
      "topics": [
        {
          "title": "تقسيم الشبكة منطقيًا باستخدام VLAN",
          "slides": "15–16",
          "paragraphs": [
            "VLAN، اختصار Virtual Local Area Network، شبكة محلية افتراضية تجمع الأجهزة منطقيًا حسب القسم أو الوظيفة. تقدر تفصل أجهزة متصلة بنفس Switch، أو تمد المجموعة نفسها عبر أكثر من جهاز. VLAN 10 و VLAN 20 نطاقا بث مستقلان حتى لو تشاركا نفس العتاد.",
            "التقسيم يسهل تنظيم الأجهزة وتطبيق السياسات ويقلل انتشار Broadcast، أي البث، خارج المجموعة اللي تخصه. عادةً تخصص شبكة IP مختلفة لكل VLAN، ويحتاج التواصل بينها إلى Inter-VLAN Routing، أي توجيه IP بين شبكات VLAN. العزل المنطقي يدعم الأمان، لكنه ما يشفر البيانات ولا يستبدل سياسات الوصول."
          ],
          "note": "في الشريحة 16: التقسيم يزيد عدد Broadcast Domains ويقلل حجم كل نطاق، وليس العكس. وفي الشريحة 13 عنوان Module وبعض الهدف العام لا يطابقان VLANs؛ عناوين الأجزاء وأهدافها التفصيلية تتوافق مع محتوى الشابتر، وهي اللي اعتمدناها."
        },
        {
          "title": "Default VLAN وData VLAN وManagement VLAN",
          "slides": "17–18",
          "paragraphs": [
            "في أجهزة العرض، Default VLAN هي VLAN 1، وتكون منافذ Access فيها افتراضيًا. Access منفذ مرتبط عادةً بشبكة بيانات واحدة. VLAN 1 ما تنحذف أو يتغير اسمها في هذا السياق. Data VLAN مخصصة لحركة المستخدمين، أما Management VLAN فتستخدم للوصول إلى إدارة الأجهزة، مثل SSH.",
            "قد تجتمع عدة أدوار افتراضية في VLAN 1. فصل إدارة الأجهزة عن حركة المستخدمين يساعد على تنظيم الوصول، لكن الاسم Management ما يعطي حماية تلقائية. تحتاج عضوية منافذ وعناوين وسياسات مناسبة؛ وتغيير VLAN الإدارة يتطلب التأكد من استمرار مسار الوصول إليها."
          ]
        },
        {
          "title": "Native VLAN والإطارات غير الموسومة",
          "slides": "18",
          "paragraphs": [
            "Trunk رابط Layer 2 يحمل أكثر من VLAN مع الحفاظ على تمييزها. على 802.1Q Trunk المعتاد في العرض، Native VLAN مرتبطة بالإطارات اللي تمر بدون وسم VLAN. Tagged يعني إن الإطار يحمل الوسم، وUntagged يعني إنه بدون هذا الوسم.",
            "الافتراضي في الأجهزة المذكورة Native VLAN 1، وتقدر تغيّره. لازم تطابق الرقم على طرفَي الوصلة؛ الاختلاف قد يجعل الإطار غير الموسوم يدخل VLAN غير المقصودة. بعض المنصات تدعم وسم Native VLAN بإعداد خاص، لذلك اربط تفسيرك بالإعداد الفعلي."
          ]
        },
        {
          "title": "Voice VLAN ومتطلبات حركة الصوت",
          "slides": "19–20",
          "paragraphs": [
            "Voice VLAN مخصصة لحركة هاتف IP. الصوت يتأثر بالتأخير وتغيّره من حزمة لأخرى، ويحتاج سعة مناسبة وأولوية عند الازدحام. QoS، اختصار Quality of Service، مجموعة آليات لتصنيف الحركة وجدولتها وتحديد أولويتها. إنشاء Voice VLAN وحده ما يطبق كل هذي الآليات.",
            "العرض يذكر أقل من 150 ms للتأخير باتجاه واحد ضمن متطلبات الصوت؛ ms تعني ملّي ثانية. الرقم هدف تصميمي مرتبط بجودة الاتصال، وليس نتيجة مضمونة من VLAN. ويمكن لهاتف و PC خلفه استخدام منفذ واحد مع فصل Data VLAN عن Voice VLAN. نشاط Who Hears the Broadcast? يركز على ملاحظة البث داخل VLAN؛ ملفه غير مرفق."
          ]
        }
      ],
      "checks": [
        {
          "question": "جهازان على نفس Switch لكن كل واحد في VLAN مختلفة. هل وجودهما على نفس الجهاز يكفي للتواصل بينهما؟",
          "answer": "لا. الفصل هنا منطقي. في سيناريو IP المعتاد يحتاج التواصل إلى توجيه بين الشبكتين وإعدادات وعناوين وسياسات تسمح به."
        },
        {
          "question": "إذا سميت VLAN باسم Secure، هل صارت بياناتها مشفرة؟",
          "answer": "لا. الاسم للتعريف فقط. VLAN تعزل نطاقات Layer 2 منطقيًا، أما التشفير وسياسات الوصول فلها آليات وإعدادات مستقلة."
        }
      ],
      "terms": [
        "VLAN",
        "Data VLAN",
        "Management VLAN",
        "Native VLAN",
        "Voice VLAN",
        "QoS",
        "Default VLAN",
        "Access Port",
        "Inter-VLAN Routing"
      ]
    }
  },
  {
    "id": "network-theory-3-2",
    "subject": "Network",
    "section": "theory",
    "unit": 3,
    "title": "3.2 · VLAN عبر أكثر من Switch",
    "video": null,
    "summary": "إذا كانت أجهزة VLAN 10 موزعة على جهازَي Switch، تحتاج مسارًا يحمل VLAN 10 بينهما. Trunk يتيح حمل عدة VLANs على وصلة واحدة مع بقاء كل VLAN مميزة. هذا امتداد Layer 2، وليس توجيهًا من VLAN 10 إلى VLAN 20.",
    "steps": [
      "امتداد VLAN بين أجهزة Switch",
      "حقول وسم IEEE 802.1Q",
      "مطابقة Native VLAN على طرفَي Trunk",
      "فصل حركة الهاتف و PC على منفذ واحد"
    ],
    "source": "SRWE Module 3 · الشرائح 21–29",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 3,
      "chapterTitle": "VLANs",
      "part": "3.2",
      "english": "VLANs in a Multi-Switched Environment",
      "range": "21–29",
      "topics": [
        {
          "title": "امتداد VLAN بين أجهزة Switch",
          "slides": "22–24",
          "paragraphs": [
            "إذا كانت أجهزة VLAN 10 موزعة على جهازَي Switch، تحتاج مسارًا يحمل VLAN 10 بينهما. Trunk يتيح حمل عدة VLANs على وصلة واحدة مع بقاء كل VLAN مميزة. هذا امتداد Layer 2، وليس توجيهًا من VLAN 10 إلى VLAN 20.",
            "حتى إذا كانت الشبكة كلها في VLAN واحدة، ما يرسل Switch كل Unicast إلى الجميع. إذا عرف منفذ الوجهة في MAC Address Table يمرّر الإطار له، أما Broadcast وUnknown Unicast فيُوزعان وفق قواعد التمرير داخل VLAN. إضافة VLANs تغيّر حدود النطاقات، ولا تلغي وظيفة جدول MAC."
          ],
          "note": "صححنا التعميم في الشريحة 23 حول إرسال Unicast للجميع: الوجهة المعروفة تُمرر حسب جدول MAC، حتى داخل VLAN واحدة."
        },
        {
          "title": "حقول وسم IEEE 802.1Q",
          "slides": "25",
          "paragraphs": [
            "IEEE 802.1Q معيار يضيف وسمًا بطول 4 بايت إلى إطار Ethernet. TPID، اختصار Tag Protocol Identifier، حقل بطول بايتين يعرّف نوع الوسم، وقيمته المعتادة هنا 0x8100. بقية الوسم تحتوي أولوية الإطار ومعلومات تحكم ورقم VLAN. الجدول يوضح وظيفة كل حقل.",
            "VID، أي VLAN Identifier، طوله 12 بت ويعطي 4096 قيمة حسابيًا. هذا ما يعني وجود 4096 VLAN قابلة للإنشاء: القيمة 0 للوسم ذي الأولوية دون VID صريح، والقيمة 4095 محجوزة. أرقام VLAN المستخدمة تقع بين 1 و4094 ضمن قيود الجهاز. عند إضافة الوسم أو نزعه، يُعاد حساب FCS لأن محتوى الإطار تغيّر.",
            "نزع الوسم يعتمد على نوع الوصلة والإعداد؛ في المثال تُرسل بيانات PC العادي بدون وسم عبر منفذ Access. ما نعمم نزع الوسم على كل جهاز نهائي، لأن هاتف IP أو جهازًا يدعم Tagged Frames قد يستخدمه ضمن إعداد مختلف."
          ],
          "table": [
            [
              "الحقل",
              "الحجم",
              "الوظيفة"
            ],
            [
              "TPID · Tag Protocol Identifier",
              "16 bits",
              "تحديد نوع الوسم؛ القيمة المعتادة هنا 0x8100"
            ],
            [
              "PCP · Priority Code Point",
              "3 bits",
              "قيمة أولوية من 0 إلى 7"
            ],
            [
              "CFI · Canonical Format Identifier",
              "1 bit تاريخيًا",
              "حقل للتوافق مع صيغ MAC في سياق Token Ring القديم"
            ],
            [
              "DEI · Drop Eligible Indicator",
              "1 bit في التعريف الحديث",
              "يشير إلى أهلية الإسقاط عند الازدحام؛ يشغل موضع CFI نفسه"
            ],
            [
              "VID · VLAN Identifier",
              "12 bits",
              "معرّف VLAN؛ توجد قيم محجوزة"
            ]
          ],
          "note": "CFI وDEI وصفان تاريخي وحديث لنفس موضع البت، وليسا حقلين يضافان معًا. يتبقى الحجم الكلي للوسم 4 بايت.",
          "link": "https://www.cisco.com/c/en/us/support/docs/cloud-systems-management/application-policy-infrastructure-controller-apic/215015-qos-in-cisco-aci-within-a-pod.html"
        },
        {
          "title": "مطابقة Native VLAN على طرفَي Trunk",
          "slides": "26",
          "paragraphs": [
            "إذا كانت Native VLAN في S1 هي 99 وفي S2 هي 1، قد يستقبل الطرف الثاني إطارًا غير موسوم وينسبه إلى VLAN غير المقصودة. هذي حالة Native VLAN Mismatch، أي عدم تطابق Native بين طرفَي الرابط.",
            "المطابقة مطلوبة على طرفَي الوصلة نفسها؛ كل Trunk له إعداده، وليس شرطًا أن كل الروابط تستخدم نفس الرقم. راجع أيضًا Allowed VLANs، أي قائمة VLANs المسموح بها. توافق Native يعالج جانبًا واحدًا، وما يثبت إن كل VLAN مطلوبة موجودة ومسموح بمرورها."
          ]
        },
        {
          "title": "فصل حركة الهاتف و PC على منفذ واحد",
          "slides": "27–29",
          "paragraphs": [
            "هاتف IP في المثال يحتوي Switch داخليًا بثلاث جهات: رابط إلى Switch الشبكة، ورابط إلى PC، ومسار للهاتف نفسه. CDP، اختصار Cisco Discovery Protocol، بروتوكول اكتشاف أجهزة مجاورة يمكن أن يبلّغ الهاتف بإعداد Voice VLAN على الأجهزة المدعومة.",
            "الهاتف يوسم حركة الصوت حسب إعداد Voice VLAN. بيانات PC قد تمر غير موسومة وتُنسب إلى Data VLAN، أو تمر بوسم حسب إعداد الهاتف والجهاز. CoS تعني Class of Service، أي أولوية على Layer 2 مرتبطة بقيمة الوسم. اقرأ Access VLAN وVoice VLAN من show interfaces fa0/18 switchport لتعرف الإعداد بدل الاستنتاج من شكل التوصيل."
          ],
          "code": "S1# show interfaces fastEthernet 0/18 switchport",
          "note": "تصحيح في نص العرض: CoS تعني Class of Service، وليست Cost of Service."
        }
      ],
      "checks": [
        {
          "question": "حقل VID طوله 12 بت. هل هذا يسمح بإنشاء VLAN 4095؟",
          "answer": "لا. عدد القيم الممكنة للحقل لا يساوي عدد VLANs المتاحة. 4095 محجوزة، والمدى الممتد في سياق أجهزة العرض ينتهي عند 4094."
        },
        {
          "question": "هل Trunk بين جهازَي Switch يكفي ليتواصل جهاز في VLAN 10 مع جهاز في VLAN 20؟",
          "answer": "لا. Trunk يحمل الشبكتين مع بقاء الفصل بينهما. التواصل بين شبكتيهما يحتاج توجيه Layer 3 وإعدادًا يسمح به."
        }
      ],
      "terms": [
        "Trunk",
        "802.1Q",
        "Tagged",
        "Untagged",
        "VLAN ID",
        "PCP",
        "CoS",
        "CDP",
        "TPID",
        "CFI",
        "DEI",
        "VID"
      ]
    }
  },
  {
    "id": "network-theory-3-3",
    "subject": "Network",
    "section": "theory",
    "unit": 3,
    "title": "3.3 · إنشاء VLAN وتعيين المنافذ",
    "video": null,
    "summary": "Normal Range يمتد من VLAN 1 إلى VLAN 1005، وExtended Range من 1006 إلى 4094. في أجهزة العرض، VLAN 1 و VLANs من 1002 إلى 1005 موجودة افتراضيًا ولا تُحذف؛ الأرقام 1002–1005 مرتبطة بتقنيات قديمة. عدد الأرقام في المدى ما يساوي عدد VLANs اللي يقدر الطراز يشغلها في الوقت نفسه.",
    "steps": [
      "نطاقات أرقام VLAN وطريقة حفظها",
      "إنشاء VLAN وتسميتها",
      "تعيين منفذ Access وإعداد الجهاز المتصل",
      "إعداد Data VLAN وVoice VLAN",
      "التحقق من العضوية وتغييرها",
      "حذف VLAN وأثره على منافذها"
    ],
    "source": "SRWE Module 3 · الشرائح 30–41",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 3,
      "chapterTitle": "VLANs",
      "part": "3.3",
      "english": "VLAN Configuration",
      "range": "30–41",
      "topics": [
        {
          "title": "نطاقات أرقام VLAN وطريقة حفظها",
          "slides": "31",
          "paragraphs": [
            "Normal Range يمتد من VLAN 1 إلى VLAN 1005، وExtended Range من 1006 إلى 4094. في أجهزة العرض، VLAN 1 و VLANs من 1002 إلى 1005 موجودة افتراضيًا ولا تُحذف؛ الأرقام 1002–1005 مرتبطة بتقنيات قديمة. عدد الأرقام في المدى ما يساوي عدد VLANs اللي يقدر الطراز يشغلها في الوقت نفسه.",
            "VLAN Database قاعدة بيانات معلومات VLAN، ويستخدم Catalyst المعروض ملف vlan.dat لحفظ إعدادات النطاق العادي في السياق المعتاد. حفظ النطاق الممتد ودعمه يتأثران بإصدار VTP ووضعه. VTP، اختصار VLAN Trunking Protocol، يدير معلومات VLAN بين أجهزة تدعمه؛ يختلف عن DTP اللي يتفاوض على وضع Trunk."
          ],
          "note": "تصحيح موثق للشريحة 31: كتبت 4095 نهايةً للنطاق الممتد؛ دليل Cisco للطراز يحدد 4094. لم نغيّر نطاق المنهج، بل صححنا الرقم.",
          "link": "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960/software/release/15-0_2_se/configuration/guide/scg2960/swvlan.html"
        },
        {
          "title": "إنشاء VLAN وتسميتها",
          "slides": "32–33",
          "paragraphs": [
            "الأمر vlan 20 ينشئ VLAN أو يدخل إلى إعدادها إذا كانت موجودة. name Students يحدد اسمًا يساعد على التعرف عليها؛ وإذا ما حددت اسمًا يعطيها IOS اسمًا افتراضيًا مثل VLAN0020. رقم VLAN هو اللي يحدد العضوية، وتغيير الاسم ما ينقل المنافذ إلى شبكة ثانية.",
            "من Global Configuration وعلامته (config)#، ينقلك vlan 20 إلى VLAN Configuration وعلامته (config-vlan)#. هذا وضع إعداد VLAN المحددة. exit يرجع مستوى واحدًا، وend يرجع إلى Privileged EXEC وعلامته #. اربط الرقم والاسم بالمطلوب في الرسم؛ هذي قيم تتغير بين التمارين."
          ],
          "code": "S1# configure terminal\nS1(config)# vlan 20\nS1(config-vlan)# name Students\nS1(config-vlan)# end\nS1# show vlan brief"
        },
        {
          "title": "تعيين منفذ Access وإعداد الجهاز المتصل",
          "slides": "34–35",
          "paragraphs": [
            "Access Port يحمل عادة Data VLAN واحدة. switchport mode access يثبت دور المنفذ، وswitchport access vlan 20 يعيّن عضويته. بعد إنشاء VLAN، تحتاج تعيين منفذ PC لها؛ إنشاء الاسم والرقم وحده ما ينقل الجهاز.",
            "بعد التعيين، أعطِ PC عنوانًا مناسبًا لشبكته. المثال يستخدم 172.17.20.22 في شبكة VLAN 20؛ الربط بين الرقم 20 وجزء العنوان اختيار تنظيمي، وليس شرطًا في البروتوكول. Default Gateway تكون عنوان واجهة Layer 3 الخاصة بالشبكة إذا كان مطلوبًا الوصول إلى شبكات أخرى."
          ],
          "code": "S1# configure terminal\nS1(config)# interface fastEthernet 0/18\nS1(config-if)# switchport mode access\nS1(config-if)# switchport access vlan 20\nS1(config-if)# end\nS1# show vlan brief\nS1# show interfaces fastEthernet 0/18 switchport"
        },
        {
          "title": "إعداد Data VLAN وVoice VLAN",
          "slides": "36–37",
          "paragraphs": [
            "يمكن تعيين Data VLAN واحدة وVoice VLAN منفصلة على منفذ الهاتف المدعوم. هذا ما يحوّل المنفذ إلى Trunk عام لأي عدد من VLANs؛ لكل من البيانات والصوت دور محدد في هذا الإعداد. المثال يخصص VLAN 20 للبيانات و VLAN 150 للصوت.",
            "أنشئ الشبكتين وسمّهما، ثم استخدم switchport access vlan وswitchport voice vlan. بعض طرازات IOS تنشئ VLAN غير الموجودة عند تعيينها إلى منفذ؛ الأفضل في هذا التطبيق إنك تنشئها وتتحقق منها صراحة. الأمر mls qos trust cos في مثال العرض يخص الثقة بقيمة CoS المستلمة؛ تفعيله ومتطلبات QoS تعتمد على الطراز والسياسة، وتفصيل QoS خارج نطاق الجزء."
          ],
          "code": "S1# configure terminal\nS1(config)# vlan 20\nS1(config-vlan)# name Students\nS1(config-vlan)# exit\nS1(config)# vlan 150\nS1(config-vlan)# name VOICE\nS1(config-vlan)# exit\nS1(config)# interface fastEthernet 0/18\nS1(config-if)# switchport mode access\nS1(config-if)# switchport access vlan 20\nS1(config-if)# switchport voice vlan 150\nS1(config-if)# end\nS1# show interfaces fastEthernet 0/18 switchport",
          "note": "ركزنا المثال على فصل Data وVoice. الشريحة 37 تعرض أيضًا mls qos trust cos؛ هذا إعداد ثقة بالأولوية يعتمد على دعم QoS وسياسة الشبكة، وليس شرطًا عامًا لإنشاء VLAN."
        },
        {
          "title": "التحقق من العضوية وتغييرها",
          "slides": "38–39، 62",
          "paragraphs": [
            "show vlan brief يعرض اسم VLAN وحالتها والمنافذ المرتبطة بها. show vlan id 20 يركز على رقم محدد، و show vlan name Students على الاسم، و show vlan summary على ملخص العدد. عشان تعرف VLANs المارة على Trunk استخدم أوامر Trunk؛ غياب المنفذ من قائمة منافذ Access ما يثبت إنه ما يحمل VLAN.",
            "لتغيير عضوية المنفذ، ادخل الواجهة الصحيحة واكتب switchport access vlan مع الرقم الجديد. no switchport access vlan يرجعها إلى العضوية الافتراضية في هذا السياق، لكنه ما يحذف VLAN. بعد أي تغيير، راجع show vlan brief و show interfaces مع switchport وتأكد من توافق عنوان الجهاز المتصل.",
            "إذا كان المطلوب تعيين مجموعة منافذ متجاورة بنفس الإعداد، يتيح interface range اختيارها معًا، مثل interface range fastEthernet 0/1 - 4، ويظهر Prompt باسم (config-if-range)#. راجع نطاق الاختيار قبل تنفيذ الأمر؛ أي تعديل داخل هذا الوضع يطبق على المنافذ المختارة. ذُكر الأمر في قائمة مصطلحات الشريحة 62."
          ],
          "code": "S1# show vlan id 20\nS1# show vlan name Students\nS1# show vlan summary\nS1# configure terminal\nS1(config)# interface fastEthernet 0/18\nS1(config-if)# switchport access vlan 30\nS1(config-if)# end\nS1# show interfaces fastEthernet 0/18 switchport"
        },
        {
          "title": "حذف VLAN وأثره على منافذها",
          "slides": "40–41",
          "paragraphs": [
            "الأمر no vlan 20 يحذف VLAN 20 من قاعدة البيانات، لكنه ما ينقل منافذها تلقائيًا إلى VLAN 1. قد تبقى المنافذ مضبوطة على رقم غير موجود وتتوقف حركة تلك VLAN. أعد تعيين المنافذ قبل الحذف، أو أعد إنشاء VLAN إذا كان الحذف غير مقصود.",
            "حذف vlan.dat يزيل قاعدة البيانات المحفوظة، وليس إعداد منفذ واحد. العرض يذكر delete flash:vlan.dat أو delete vlan.dat ثم إعادة التشغيل في إجراء إزالة القاعدة. استعادة إعدادات المصنع أوسع وتشمل startup-config أيضًا؛ لا تستخدم هذي الإجراءات بدل تغيير عضوية منفذ. نشاط الجزء يطلب مراجعة الافتراضي وإنشاء VLANs وتعيين المنافذ، وملفه التفصيلي غير مرفق."
          ]
        }
      ],
      "checks": [
        {
          "question": "غيّرت اسم VLAN 20 من Students إلى Sales. ما اللي تغيّر في عضوية المنفذ وعنوان PC؟",
          "answer": "اللي تغيّر هو الاسم فقط. رقم VLAN وعضوية المنفذ وعنوان PC ما تتغير بسبب إعادة التسمية؛ لكل واحد إعداد مستقل."
        },
        {
          "question": "حذفت VLAN 20 وبقي المنفذ معينًا لها. هل يرجع إلى VLAN 1 تلقائيًا؟",
          "answer": "لا. تحتاج تعيد تعيين المنفذ إلى VLAN موجودة أو تعيد إنشاء VLAN 20 بحسب المطلوب. حذف VLAN يختلف عن no switchport access vlan على المنفذ."
        }
      ],
      "terms": [
        "Access Port",
        "Normal Range",
        "Extended Range",
        "VLAN Database",
        "VTP",
        "VLAN Configuration",
        "interface range",
        "QoS",
        "CoS"
      ]
    }
  },
  {
    "id": "network-theory-3-4",
    "subject": "Network",
    "section": "theory",
    "unit": 3,
    "title": "3.4 · إعداد Trunk والتحقق منه",
    "video": null,
    "summary": "مثال العرض يخصص VLAN 10 للهيئة التعليمية والموظفين، و20 للطلاب، و30 للضيوف، و99 كـNative VLAN. قبل الإعداد، حدد منفذَي الوصلة وقائمة VLANs المطلوبة ورقم Native. Trunk يعمل في Layer 2 ويحمل الحركة المسموح بها؛ ما ينشئ توجيهًا بين الشبكات.",
    "steps": [
      "تحديد VLANs المطلوبة على Trunk",
      "إعداد Native وAllowed VLANs",
      "مقارنة الإعداد بالحالة التشغيلية",
      "إرجاع قيم Trunk الافتراضية أو تغيير دوره"
    ],
    "source": "SRWE Module 3 · الشرائح 42–49",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 3,
      "chapterTitle": "VLANs",
      "part": "3.4",
      "english": "VLAN Trunks",
      "range": "42–49",
      "topics": [
        {
          "title": "تحديد VLANs المطلوبة على Trunk",
          "slides": "43–44",
          "paragraphs": [
            "مثال العرض يخصص VLAN 10 للهيئة التعليمية والموظفين، و20 للطلاب، و30 للضيوف، و99 كـNative VLAN. قبل الإعداد، حدد منفذَي الوصلة وقائمة VLANs المطلوبة ورقم Native. Trunk يعمل في Layer 2 ويحمل الحركة المسموح بها؛ ما ينشئ توجيهًا بين الشبكات.",
            "switchport mode trunk يثبت وضع Trunk. بعض المنافذ اللي تدعم أكثر من نوع Encapsulation، أي تغليف الإطار، تحتاج أولًا switchport trunk encapsulation dot1q. Catalyst 2960 في المثال يدعم 802.1Q فقط، لذلك ما يحتاج أمر اختيار التغليف وقد لا يقبله. الحاجة مرتبطة بالطراز والمنفذ، وليس بمجرد تصنيف الجهاز Layer 3."
          ],
          "note": "العرض يعمم حاجة Layer 3 Switch لأمر encapsulation؛ الصح أن الحاجة تتبع قدرات المنفذ والطراز، وليست مجرد كون الجهاز Layer 3."
        },
        {
          "title": "إعداد Native وAllowed VLANs",
          "slides": "44–45",
          "paragraphs": [
            "Allowed VLAN List تحدد VLANs المسموح مرورها على Trunk. switchport trunk allowed vlan بدون add يستبدل القائمة الحالية؛ إذا هدفك إضافة VLAN مع الاحتفاظ بالباقي، استخدم صيغة add المناسبة. القائمة 10,20,30,99 تخص هذا المثال، فتأكد من قائمة متطلباتك قبل تطبيقها.",
            "اضبط Native VLAN 99 على الطرفين، وتأكد إن VLANs المطلوبة موجودة وفعالة. السماح برقم في القائمة ما ينشئ VLAN ولا يثبت إنها في حالة تمرير. تحتاج الوصلة تكون عاملة وحالة STP تسمح بالمسار؛ STP بروتوكول يمنع حلقات Layer 2 وقد يحجب مسارًا زائدًا."
          ],
          "code": "S1# configure terminal\nS1(config)# interface fastEthernet 0/1\nS1(config-if)# switchport mode trunk\nS1(config-if)# switchport trunk native vlan 99\nS1(config-if)# switchport trunk allowed vlan 10,20,30,99\nS1(config-if)# end\nS1# show interfaces trunk\nS1# show interfaces fastEthernet 0/1 switchport"
        },
        {
          "title": "مقارنة الإعداد بالحالة التشغيلية",
          "slides": "45",
          "paragraphs": [
            "Administrative Mode هو الوضع المضبوط للمنفذ، وOperational Mode هو الوضع اللي يعمل به الآن. وجود trunk في running-config ما يغني عن show interfaces trunk و show interfaces مع switchport. راجع النتيجة على الطرفين، خصوصًا إذا كانت الوصلة down أو يوجد تفاوض DTP.",
            "في show interfaces trunk، ميّز ثلاث قوائم: VLANs allowed on trunk هي قائمة السماح؛ allowed and active هي المسموح بها والموجودة والفعالة؛ forwarding and not pruned هي اللي يسمح STP بتمريرها ولم تُستبعد بآلية Pruning، أي تقليل التمرير غير اللازم. مرور VLAN يحتاج توافق هذي الشروط، وليس ظهور رقمها في قائمة واحدة فقط."
          ]
        },
        {
          "title": "إرجاع قيم Trunk الافتراضية أو تغيير دوره",
          "slides": "46–49",
          "paragraphs": [
            "no switchport trunk allowed vlan يرجع قائمة السماح الافتراضية، وno switchport trunk native vlan يرجع Native إلى VLAN 1 في هذا السياق. هذان الأمران ما يحولان المنفذ تلقائيًا إلى Access؛ إعدادات Trunk ودور المنفذ أمران مرتبطان لكن مختلفان.",
            "إذا المطلوب تحويله إلى Access، استخدم switchport mode access ثم عيّن VLAN المناسبة وتحقق من النتيجة. راجع أثر التغيير قبل تعديل رابط يحمل عدة شبكات. أنشطة العرض تجمع إنشاء VLANs وصيانة عضويتها وإعداد Trunk والتحقق منه؛ ملفات الأنشطة التفصيلية غير مرفقة."
          ],
          "code": "S1# configure terminal\nS1(config)# interface fastEthernet 0/1\nS1(config-if)# no switchport trunk allowed vlan\nS1(config-if)# no switchport trunk native vlan\nS1(config-if)# end\nS1# show interfaces fastEthernet 0/1 switchport",
          "note": "الأوامر أعلاه تعيد قيمًا افتراضية وقد توسع قائمة المرور؛ ليست خطوات روتينية مطلوبة في كل مختبر."
        }
      ],
      "checks": [
        {
          "question": "VLAN 20 موجودة في Allowed List لكنها غير موجودة في قاعدة VLANs على Switch. هل يسمح هذا بمرورها بصورة صحيحة؟",
          "answer": "لا. تحتاج VLAN موجودة وفعالة، ووصلة Trunk عاملة، وحالة تمرير تسمح بها. قارن قوائم allowed وactive وforwarding في المخرجات."
        },
        {
          "question": "نفّذت no switchport trunk native vlan. هل تغير دور المنفذ إلى Access؟",
          "answer": "لا. رجعت قيمة Native الافتراضية فقط. تغيير الدور يحتاج switchport mode بالقيمة المطلوبة، ثم التحقق من Operational Mode."
        }
      ],
      "terms": [
        "Allowed VLAN List",
        "Administrative Mode",
        "Operational Mode",
        "STP",
        "Pruning",
        "Encapsulation"
      ]
    }
  },
  {
    "id": "network-theory-3-5",
    "subject": "Network",
    "section": "theory",
    "unit": 3,
    "title": "3.5 · التفاوض على Trunk باستخدام DTP",
    "video": null,
    "summary": "DTP، اختصار Dynamic Trunking Protocol، بروتوكول خاص بـCisco يتفاوض على وضع Trunk بين المنافذ اللي تدعمه. VTP، اختصار VLAN Trunking Protocol، يدير معلومات VLAN بين الأجهزة. DTP يتعلق بوضع الوصلة، وVTP يتعلق بقاعدة معلومات VLAN.",
    "steps": [
      "وظيفة DTP والفرق بينه وبين VTP",
      "توقع نتيجة التفاوض من إعداد الطرفين",
      "الإعداد الثابت وتعطيل رسائل التفاوض"
    ],
    "source": "SRWE Module 3 · الشرائح 50–55",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 3,
      "chapterTitle": "VLANs",
      "part": "3.5",
      "english": "Dynamic Trunking Protocol",
      "range": "50–55",
      "topics": [
        {
          "title": "وظيفة DTP والفرق بينه وبين VTP",
          "slides": "51–52",
          "paragraphs": [
            "DTP، اختصار Dynamic Trunking Protocol، بروتوكول خاص بـCisco يتفاوض على وضع Trunk بين المنافذ اللي تدعمه. VTP، اختصار VLAN Trunking Protocol، يدير معلومات VLAN بين الأجهزة. DTP يتعلق بوضع الوصلة، وVTP يتعلق بقاعدة معلومات VLAN.",
            "dynamic auto ينتظر تفاوضًا مناسبًا، بينما dynamic desirable يبادر بمحاولة تكوين Trunk. العرض يذكر dynamic auto افتراضيًا على أجهزة معينة، ثم يوضح إن الافتراضي يعتمد على IOS والطراز. لذلك افحص الوضع الفعلي ولا تفترض إن توصيل الكابل يكفي لتكوين Trunk."
          ]
        },
        {
          "title": "توقع نتيجة التفاوض من إعداد الطرفين",
          "slides": "53–54",
          "paragraphs": [
            "إذا الطرفان dynamic auto، تبقى الوصلة عادة Access لأن الطرفين ما يبادران بالتفاوض. desirable مع auto يتفاوضان إلى Trunk، وكذلك desirable مع desirable. وضع trunk الثابت مع auto أو desirable يحقق Trunk في سياق التفاوض المدعوم والمفعّل.",
            "access مع وضع dynamic يبقى Access. أما trunk ثابت مقابل access ثابت فهو عدم توافق؛ قد تمر بعض الحركة غير الموسومة بحسب Native وAccess VLAN، لكنه ما يحقق رابط Trunk سليمًا. الجدول يوضح التوقعات في بيئة DTP المدعومة، والتحقق من Operational Mode يبيّن النتيجة الفعلية."
          ],
          "table": [
            [
              "الطرف الأول",
              "الطرف الثاني",
              "النتيجة المعتادة"
            ],
            [
              "dynamic auto",
              "dynamic auto",
              "Access"
            ],
            [
              "dynamic desirable",
              "dynamic auto",
              "Trunk"
            ],
            [
              "dynamic desirable",
              "dynamic desirable",
              "Trunk"
            ],
            [
              "trunk",
              "dynamic auto / desirable",
              "Trunk عند دعم التفاوض"
            ],
            [
              "access",
              "dynamic auto / desirable",
              "Access"
            ],
            [
              "trunk",
              "access",
              "عدم توافق؛ لا تعتمد عليه"
            ],
            [
              "trunk",
              "trunk",
              "Trunk ثابت على الطرفين"
            ],
            [
              "access",
              "access",
              "Access على الطرفين"
            ]
          ]
        },
        {
          "title": "الإعداد الثابت وتعطيل رسائل التفاوض",
          "slides": "52–55",
          "paragraphs": [
            "عند الربط بطرف ما يدعم DTP، أو إذا التصميم يعتمد الإعداد الثابت، اضبط Trunk على الطرفين واستخدم switchport nonegotiate على المنفذ المدعوم لإيقاف رسائل DTP. switchport mode trunk يثبت الدور، لكنه ما يعني بالضرورة إيقاف رسائل التفاوض.",
            "show dtp interface يعرض حالة التفاوض حيث يدعمه الجهاز، و show interfaces مع switchport يوضح الوضع الإداري والتشغيلي. لا تترك طرفًا dynamic يعتمد على تفاوض عطّلته في الطرف الآخر. وإذا كان المنفذ dynamic، غيّره إلى وضع ثابت مدعوم قبل nonegotiate. توصية العرض تثبيت دور المنافذ وتعطيل التفاوض غير المطلوب بحسب تصميم الشبكة."
          ],
          "code": "S1# configure terminal\nS1(config)# interface fastEthernet 0/1\nS1(config-if)# switchport mode trunk\nS1(config-if)# switchport nonegotiate\nS1(config-if)# end\nS1# show dtp interface fastEthernet 0/1\nS1# show interfaces fastEthernet 0/1 switchport"
        }
      ],
      "checks": [
        {
          "question": "الطرفان dynamic auto لكن الوصلة ما تحولت إلى Trunk. هل هذي النتيجة تثبت وجود عطل؟",
          "answer": "لا. هذي النتيجة المعتادة لأن الطرفين ينتظران بدء التفاوض. اختَر وضعًا يحقق متطلبات الرابط، ثم راجع الحالة التشغيلية على الطرفين."
        },
        {
          "question": "هل ظهور switchport mode trunk في الإعداد يثبت توقف DTP؟",
          "answer": "لا. تثبيت Trunk يختلف عن تعطيل التفاوض. تستخدم switchport nonegotiate في وضع مدعوم وتتحقق من النتيجة."
        }
      ],
      "terms": [
        "DTP",
        "dynamic auto",
        "dynamic desirable",
        "nonegotiate"
      ]
    }
  },
  {
    "id": "network-theory-3-6",
    "subject": "Network",
    "section": "theory",
    "unit": 3,
    "title": "3.6 · تطبيق ومراجعة الشابتر الثالث",
    "video": null,
    "summary": "ابدأ من الرسم والمتطلبات: حدد أجهزة كل VLAN، ومنافذ Access، وروابط Trunk، وقيم Native وAllowed. بعدها أنشئ VLANs وعيّن المنافذ واضبط طرفَي كل رابط. تحقق من قاعدة VLANs وحالة الوصلات وعناوين الأجهزة؛ كل فحص يوضح جزءًا من المسار.",
    "steps": [
      "التحقق من VLAN و Trunk كمسار متكامل",
      "نطاق المراجعة والانتقال إلى التطبيق"
    ],
    "source": "SRWE Module 3 · الشرائح 56–62",
    "theory": {
      "skill": 1,
      "skillTitle": "يقوم بتكوين الشبكات المحلية الافتراضية (VLAN) والتوجيه فيما بينها، وتطبيق أفضل ممارسات الأمان",
      "chapter": 3,
      "chapterTitle": "VLANs",
      "part": "3.6",
      "english": "Module Practice and Quiz",
      "range": "56–62",
      "topics": [
        {
          "title": "التحقق من VLAN و Trunk كمسار متكامل",
          "slides": "57–61",
          "paragraphs": [
            "ابدأ من الرسم والمتطلبات: حدد أجهزة كل VLAN، ومنافذ Access، وروابط Trunk، وقيم Native وAllowed. بعدها أنشئ VLANs وعيّن المنافذ واضبط طرفَي كل رابط. تحقق من قاعدة VLANs وحالة الوصلات وعناوين الأجهزة؛ كل فحص يوضح جزءًا من المسار.",
            "إذا كان PC-A و PC-B في VLAN 20 على جهازَي Switch وما يتواصلان، راجع عنوانيهما وقناع الشبكة، ثم عضوية منفذَي Access ووجود VLAN على الجهازين ومرورها على Trunk. الاتصال المطلوب داخل VLAN نفسها، فما تبدأ بإعداد Inter-VLAN Routing قبل التأكد من مسار Layer 2."
          ]
        },
        {
          "title": "نطاق المراجعة والانتقال إلى التطبيق",
          "slides": "57–62",
          "paragraphs": [
            "الشباتر الثلاثة تغطي الإعداد الأولي للأجهزة، وتأمين الدخول، ومبادئ تمرير Ethernet، ثم VLAN و Trunk و DTP. أنشطة العرض تربط إنشاء الشبكة بالإعداد والتحقق، والمراجعة هنا تعتمد على المحتوى المتاح وأهداف هذي الأنشطة.",
            "إعداد Inter-VLAN Routing الكامل ما ورد كشابتر في الملفات الثلاثة؛ عنوان المهارة أوسع من هذي الدفعة. الدرس العملي الموجود في مدار يتيح تطبيقه كمرجع منفصل، ولا نعدّه جزءًا من عروض النظرية المرفقة.",
            "بعد مراجعة تفسيرك، طبّق الفكرة على مثال تختلف فيه أسماء VLANs والعناوين والمنافذ. الهدف إنك تحدد الإعداد من المتطلبات وتتحقق من أثره. فتح الإجابة أو الوصول إلى نهاية الشابتر يثبت الاطلاع، ولا يكفي وحده لإثبات التنفيذ المستقل."
          ]
        }
      ],
      "checks": [
        {
          "question": "جهازا PC في VLAN واحدة على جهازَي Switch مختلفين. ما المسار اللي تحتاج تتحقق منه؟",
          "answer": "تحقق من مسار Layer 2 اللي يحمل VLAN نفسها بينهما، ومن Trunk إذا كانت الوصلة تحمل عدة VLANs. ما تحتاج Inter-VLAN Routing لاتصال داخل نفس VLAN وشبكة IP."
        },
        {
          "question": "ما الأدلة اللي تجمعها للتحقق من إعداد VLAN و Trunk؟",
          "answer": "راجع وجود VLAN وعضوية منافذ Access، ثم حالة Trunk وقيم Native وAllowed على الطرفين. بعدها اختبر الاتصال بين الأجهزة بعناوين صحيحة. وجود الإعداد والحالة التشغيلية ونتيجة الاتصال أدلة متكاملة."
        },
        {
          "question": "إذا تغير رقم VLAN واسم المنفذ في التمرين، كيف تحدد الأوامر المناسبة؟",
          "answer": "ابدأ بالرسم والمتطلبات وحدد دور كل جهاز ومنفذ وشبكة. بعدها استخدم صيغ الأوامر بالقيم الجديدة، ثم راجع المخرجات. الأسماء والأرقام قيم خاصة بالمثال وليست جزءًا ثابتًا من صيغة الأمر."
        }
      ],
      "terms": [
        "VLAN",
        "Trunk",
        "DTP",
        "Inter-VLAN Routing"
      ]
    }
  }
];
for(const lesson of NETWORK_THEORY){lesson.theory.glossary=Object.fromEntries(lesson.theory.terms.map(term=>[term,NETWORK_GLOSSARY[term]]));}

NETWORK_THEORY.push(...EXPANDED);
for(const lesson of NETWORK_THEORY){
 lesson.theory.sourceFile=`/assets/network-sources/chapter-${lesson.theory.chapter}.pptx`;
 const sources=SOURCE_SLIDES[lesson.id];
 if(sources){Object.assign(lesson.theory,sources);lesson.source=`SRWE Module ${sources.sourceModule} · الشرائح ${sources.range}`;}
 if(lesson.id==='network-theory-3-1')lesson.theory.sourceNote='في الشريحة 13 عنوان Module Title منسوخ باسم Protocols and Models؛ عنوان هذا الشابتر ومحتواه VLANs. أبقينا صورة المصدر كما وردت.';
}
