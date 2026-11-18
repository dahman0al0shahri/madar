import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {TreeFragment} from '@lezer/common';
import {parser as markdown,GFM} from '@lezer/markdown';
import {parser as html,configureNesting} from '@lezer/html';
import {parser as css} from '@lezer/css';
import {parser as python} from '@lezer/python';
import {parser as bash} from '@fig/lezer-bash';
import yaml from 'js-yaml';
import {changed} from './data-evidence.mjs';

const md=markdown.configure(GFM);
const markup=html.configure({wrap:configureNesting([{tag:'style',parser:css}])});
const names={Paragraph:'فقرة',BulletList:'قائمة نقطية',OrderedList:'قائمة مرقمة',ListItem:'بند قائمة',Link:'رابط',URL:'عنوان رابط',FencedCode:'مثال برمجي',CodeBlock:'مثال برمجي',Table:'جدول',TableRow:'صف جدول',Task:'شرط للتحقق',OpenTag:'وسم بداية',CloseTag:'وسم نهاية',Element:'عنصر',Attribute:'سمة العنصر',Declaration:'تصريح تنسيق',RuleSet:'قاعدة تنسيق',CallExpression:'استدعاء',ReturnStatement:'إرجاع',VariableName:'اسم متغير',Command:'أمر',Comment:'تعليق',Script:'سكربت',Document:'مستند'};
const title=node=>names[node.name]||node.name;
function hierarchy(node){
  const chain=[];
  for(let p=node;p;p=p.parent)chain.unshift(title(p));
  return chain.join(' / ');
}
function parserFor(file){
  if(/\.css$|night-review-style\.txt$/.test(file))return css;
  if(/\.(html|svg)$/.test(file))return markup;
  if(/\.sh$|\/pre-push$/.test(file))return bash;
  if(file.endsWith('.py'))return python;
  if(/\.md$|README|LICENSE/i.test(file))return md;
}

function ignoreTrials(content,lines){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'madar-atlas-ignore-'));
  const args=['-c','core.excludesFile='+path.join(dir,'empty-excludes')];
  try{
    fs.writeFileSync(path.join(dir,'empty-excludes'),'');
    execFileSync('git',['init','-q'],{cwd:dir,env:isolatedEnv(dir)});
    const sample=lines.map(s=>s.trim()).filter(s=>s && !s.startsWith('#')).map(s=>{
      let p=s.replace(/^!|^\//g,'').replaceAll('*','example');
      return p.endsWith('/')?p+'example.txt':p;
    });
    function check(text){
      fs.writeFileSync(path.join(dir,'.gitignore'),text);
      const r=spawnSync('git',[...args,'check-ignore','--no-index','--stdin'],{cwd:dir,input:sample.join('\n')+'\n',encoding:'utf8',env:isolatedEnv(dir)});
      if(![0,1].includes(r.status))throw Error(r.stderr);
      return new Set(r.stdout.trim().split(/\r?\n/).filter(Boolean));
    }
    const full=check(content);
    return lines.map((s,i)=>{
      const other=check(lines.filter((_,j)=>i!==j).join('\n'));
      const dif=sample.filter(p=>other.has(p)!==full.has(p));
      if(!dif.length)return 'حذف السطر ثم فحص '+sample.length+' مسارًا مصطنعًا باستخدام git check-ignore أعطى القرارات نفسها لهذه المسارات.';
      return 'بعد حذف السطر واستخدام git check-ignore: '+dif.map(p=>p+(other.has(p)?' أصبح متجاهلًا':' أصبح مشمولًا بالتتبع عند إضافته')).join('، ')+'.';
    });
  }finally{
    const resolved=fs.realpathSync(dir);
    if(path.dirname(resolved)!==fs.realpathSync(os.tmpdir()) || !path.basename(resolved).startsWith('madar-atlas-ignore-'))throw Error('Unexpected temporary checkout path');
    fs.rmSync(resolved,{recursive:true,force:true});
  }
}
function isolatedEnv(dir){
  const env={...process.env,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:path.join(dir,'empty-excludes')};
  delete env.GIT_DIR;delete env.GIT_WORK_TREE;delete env.GIT_INDEX_FILE;
  return env;
}

export function formatTrials(file,content,lines,context){
  if(file==='.gitignore'){
    const trials=ignoreTrials(content,lines);
    return i=>trials[i];
  }
  if(/\.ya?ml$/.test(file)){
    const original=yaml.load(content);
    return i=>{
      try{return 'عند حذف السطر من إعداد YAML: '+changed(original,yaml.load(lines.filter((_,j)=>j!==i).join('\n')),[]);}
      catch(error){return 'تعذرت قراءة الإعداد بعد حذف السطر؛ أفاد محلل YAML: '+error.reason+'.';}
    };
  }
  if(file==='.npmrc'){
    const meanings={audit:'إرسال طلب التدقيق في الاعتماديات أثناء أوامر npm المناسبة',fund:'عرض معلومات تمويل الحزم', 'update-notifier':'إشعار تحديث npm'};
    return i=>{const [k,v]=lines[i].trim().split('=');return 'يضبط المشروع '+(meanings[k]||k)+' بالقيمة '+v+'. حذف السطر يرفع هذا التجاوز المحلي؛ تتحدد القيمة بعدها من بقية إعدادات npm.';};
  }
  const parser=parserFor(context?.output||file);
  if(!parser)return null;
  const full=context?.combined||content,base=context?.begin||0;
  const tree=parser.parse(full);
  const fragments=TreeFragment.addTree(tree);
  return (i,start,stop)=>{
    const a=base+start,b=base+stop;
    const focus=a+Math.max(0,lines[i].search(/\S/));
    const from=tree.resolveInner(focus,1);
    const original=hierarchy(from);
    const edited=full.slice(0,a)+full.slice(b);
    const reuse=TreeFragment.applyChanges(fragments,[{fromA:a,toA:b,fromB:a,toB:a}]);
    const next=parser.parse(edited,reuse);
    const originalNeighbor=tree.resolveInner(b,1),newNeighbor=next.resolveInner(a,1);
    const prior=hierarchy(originalNeighbor),after=hierarchy(newNeighbor);
    const relevant=new Set();
    tree.iterate({from:a,to:b,enter(ref){
      if(ref.from>=a&&ref.to<=b&&ref.to>ref.from)relevant.add(title(ref));
    }});
    const affected=[...relevant].join('، ');
    return 'الموضع داخل '+original+'. '+(affected?'يشمل '+affected+'. ':'')+(prior===after?'بعد حذف السطر احتفظ الموضع التالي بسياقه النحوي «'+after+'».':'بعد حذف السطر انتقل سياق الموضع التالي من «'+prior+'» إلى «'+after+'».');
  };
}
