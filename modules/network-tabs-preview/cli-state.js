// Preview-only CLI corrections; injected inside the copied model, leaving its source unchanged.
const tabsNormalizeCommand=IOSCli.prototype.normalize,tabsResolveCommand=IOSCli.prototype.resolve;
IOSCli.prototype.normalize=function(raw){
 const first=raw.trimStart().match(/^(\S+)\s/);
 if(first&&'description'.startsWith(first[1].toLowerCase()))return raw;
 return tabsNormalizeCommand.call(this,raw);
};
IOSCli.prototype.resolve=function(id,raw,partial=false){
 const result=tabsResolveCommand.call(this,id,raw,partial);
 if(!partial&&result.spec?.pattern==='description <text...>'){
  const value=raw.trimStart().replace(/^\S+\s+/,'').trimEnd();
  if(!value||value.length>240)return{error:'% Invalid input detected. — وصف الواجهة أطول من الحد المدعوم.'};
  result.args=[value];
 }
 return result;
};
const tabsImportSession=IOSCli.prototype.import;
IOSCli.prototype.import=function(data){
 tabsImportSession.call(this,data);
 for(const[id,s]of Object.entries(this.sessions)){
  const old=data?.[id];if(!old)continue;
  const history=Array.isArray(old.history)?old.history.filter(x=>typeof x==='string'):[];
  s.history=history.slice(-30);
  s.historyIndex=Number.isInteger(old.historyIndex)?Math.max(0,Math.min(s.history.length,old.historyIndex-Math.max(0,history.length-30))):s.history.length;
  s.lines=Array.isArray(old.lines)?old.lines.filter(x=>typeof x==='string').slice(-110):[];
  s.pending=s.mode==='priv'&&['copy','reload'].includes(old.pending)?old.pending:null;
 }
};
const tabsRunCommand=IOSCli.prototype.run;
IOSCli.prototype.run=function(id,raw){
 const pending=this.session(id).pending;
 try{
  const result=tabsRunCommand.call(this,id,raw);
  if(pending==='reload'&&result.out?.includes('Device restarted.'))result.command='reload';
  return result;
 }finally{this.session(id).lines=this.session(id).lines.slice(-110);}
};
