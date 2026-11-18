// Build the hosted network simulator and the OS practice model from their maintained inputs.
const networkInput = 'modules/network-tabs-preview/network-labs.html';
const curriculumModel = 'modules/madar-hub/os-curriculum-model.js';

const replaceExpected = require('./checked-replacement.cjs');

function integrateNetwork(source) {
  // The specific save message must be replaced before the remaining preview wording.
  const edits = [
    ['persistence host', 'window.openai', 'window.MadarLabPersistence', 7],
    ['bundled renderer', 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js', '/vendor/three-0.160.0.min.js'],
    ['encoded payload limit', 'encode(JSON.stringify(payload)).length>15800', 'encode(JSON.stringify(payload)).length>700000'],
    ['size-limit message', 'بلغت مساحة حفظ المعاينة حدّها؛ صدّرنا لك التنبيه دون حذف مختبراتك', 'بلغت سعة الحفظ؛ نزّل نسخة من مختبراتك قبل تقليلها. لم نحذف شيئًا.'],
    ['saved status', 'تم حفظ كل تغييراتك · في هذه المعاينة', 'تم حفظ كل تغييراتك'],
    ['record description', 'مختبرات مستقلة؛ تجربة تصميم لا أداء متعلم', 'مختبرات مستقلة؛ سجل تنفيذ ومساعدة لا حكم إتقان'],
    ['remaining preview wording', 'في هذه المعاينة', 'في هذا المختبر'],
    ['standalone description', 'معاينة مستقلة · لا تتصل بحساب مدار', 'مختبرات مستقلة · النسخ باختيارك'],
    ['backup flush hook', 'root.getLabsState=()=>', 'root.flushSave=async()=>{await persist();const until=Date.now()+15000;while(saving&&Date.now()<until)await new Promise(r=>setTimeout(r,50));if(dirty||restoreFailure)throw Error("لم يكتمل حفظ المختبر");};root.getLabsState=()=>'],
  ];
  for (const [label, anchor, replacement, count] of edits) {
    source = replaceExpected(source, networkInput, label, anchor, replacement, count);
  }
  return source;
}

module.exports = function buildNetworkSimulator({ site, read, write, execFileSync, path }) {
  execFileSync(process.execPath, [path.join(site, 'modules/network-tabs-preview/build.cjs')]);
  const net = integrateNetwork(read(networkInput));
  const curriculum = replaceExpected(read(curriculumModel), curriculumModel, 'OS curriculum slot',
    '/*OS_CURRICULUM_DATA*/[]', read('lib/os-simulator-curriculum.json'));
  const practice = read('modules/madar-hub/os-practice-model.js') + '\n' + curriculum;
  write('lib/network-simulator.html',`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مختبرات الشبكات · مدار</title><script src="/vendor/lucide-0.468.0.min.js"></script><style>html,body{margin:0;background:#0f1519;color:#f4e9d9;font:15px/1.7 Tahoma,Arial,sans-serif}#network-load{padding:12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}#network-load button{font:inherit;padding:8px;border:1px solid #5b635f;border-radius:8px;background:#1b262b;color:#f4e9d9}#network-load .network-save-tools{width:100%;font-size:13px;color:#bdc6ca}#network-load summary{cursor:pointer;min-height:32px;display:list-item;align-content:center}#network-load summary:focus-visible{outline:2px solid #efc58c;outline-offset:3px;border-radius:4px}#network-load p{margin:8px 0}#network-load .network-save-tools>div{display:flex;gap:8px;flex-wrap:wrap}#network-content{min-width:0}button{cursor:pointer}canvas{max-width:100%}</style></head><body data-view="network"><div id="network-load" role="status">جارٍ استعادة مختبراتك…</div><div id="network-content"></div><template id="network-template">${net}</template><script src="/madar-persistence.js"></script><script src="/activity.js"></script><script src="/network-boot.js"></script></body></html>`);
  write('public/os-practice-model.js', practice);
};
