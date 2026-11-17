(function(root){'use strict';
const api=root.MadarOSPractice, base={...api}, catalog=/*OS_CURRICULUM_DATA*/[];
const clone=x=>JSON.parse(JSON.stringify(x)),same=(a,b)=>String(a??'').trim().toLowerCase()===String(b??'').trim().toLowerCase();
const ip=x=>/^(\d{1,3}\.){3}\d{1,3}$/.test(x||'')&&x.split('.').every(n=>+n<=255), num=x=>x.split('.').reduce((n,v)=>n*256+Number(v),0);
const match=(actual,wanted)=>Object.entries(wanted).every(([k,v])=>Array.isArray(v)?Array.isArray(actual?.[k])&&actual[k].length===v.length&&v.every(x=>actual[k].includes(x)):typeof v==='boolean'?actual?.[k]===v:typeof v==='number'?Number(actual?.[k])===v:same(actual?.[k],v));
const get=(r,entity,key)=>r[entity]?.[key];
function put(r,entity,key,value){r[entity]??={};r[entity][key]={...(r[entity][key]||{}),...value};return r[entity][key];}
