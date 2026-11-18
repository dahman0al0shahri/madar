import path from 'node:path';
const extensions=/[\w./%-]+\.(?:png|webp|jpe?g|mp4|ttf|woff2?|pdf|docx|xlsx|pptx)\b/gi;

export function linkResources(files,source) {
  const names=new Set(Object.keys(files).filter(p=>!files[p].text));
  for(const [file,meta] of Object.entries(files)){
    if(!meta.text) continue;
    const lines=source(file).split('\n');
    for(const [index,line] of lines.entries()){
      const seen=new Set();
      function record(target) {
        if(!names.has(target)||seen.has(target))return;
        seen.add(target);
        (files[target].mentions??=[]).push([file,index+1]);
      }
      if(line.includes('/assets/network-sources/chapter-${lesson.theory.chapter}.pptx')){
        for(const asset of names)if(/^public\/assets\/network-sources\/chapter-\d+\.pptx$/.test(asset))record(asset);
      }
      if(line.includes('/assets/os1/${photos[i%photos.length]}')){
        const photos=/const photos=\[([^\]]+)\]/.exec(line)?.[1]||'';
        for(const photo of photos.matchAll(/'([^']+)'/g))record('public/assets/os1/'+photo[1]);
      }
      for(const match of line.matchAll(extensions)){
        const ref=match[0];
        const paths=[ref, path.posix.normalize(path.posix.join(path.posix.dirname(file),ref)), 'public/'+ref.replace(/^\/+/, '')];
        const target=paths.find(p=>names.has(p));
        if(target)record(target);
      }
    }
  }
}

export function assetPurpose(name) {
  const base=path.posix.basename(name), parts=name.split('/');
  const os=name.match(/os1-lesson-(\d+)\/(\d+)\.(mp4|jpg)$/);
  if(os)return (os[3]==='mp4'?'فيديو':'صورة')+' للمشهد '+os[2]+' من درس نظم التشغيل '+os[1]+' بحسب مسار المورد.';
  const network=name.match(/network-sources\/c(\d+)-(\d+)\.webp$/);
  if(network)return 'صورة المصدر '+network[2]+' في مجموعة الشبكات c'+network[1]+'.';
  const deck=name.match(/network-sources\/chapter-(\d+)\.pptx$/);
  if(deck)return 'عرض الشرائح المرجعي للفصل '+deck[1]+' في منهج الشبكات، وتبني وحدة النظرية رابط الملف من رقم الفصل.';
  const osImage=name.match(/os1\/(server-(?:interior|unit|room))\.png$/);
  if(osImage)return 'صورة PNG للمشهد '+osImage[1]+'؛ توجد نسخة WebP بالاسم نفسه تُستخدم في واجهة المقرر.';
  const lab=name.match(/network-labs\/lab-(\d+)-(.+)\.webp$/);
  if(lab)return 'صورة المختبر '+lab[1]+' بالمعرّف '+lab[2]+'.';
  const action={pdf:'مستند للقراءة',docx:'مستند Word',xlsx:'مصنف Excel',pptx:'عرض PowerPoint',ttf:'ملف خط',mp4:'فيديو',svg:'رسم متجهي',png:'صورة',jpg:'صورة',webp:'صورة'};
  return (action[path.posix.extname(base).slice(1)]||'مورد مرفق')+' باسم '+base+' ضمن '+parts.slice(0,-1).join('/')+'.';
}
