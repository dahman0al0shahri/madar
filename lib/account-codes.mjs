// Public lookup code, never a credential or authorization input.
const alphabet='23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
export function newAccountCode(){
 const bytes=crypto.getRandomValues(new Uint8Array(8));
 const chars=Array.from(bytes,b=>alphabet[b%alphabet.length]).join('');
 return 'MD-'+chars.slice(0,4)+'-'+chars.slice(4);
}
export function normalizeAccountCode(value){
 const s=String(value||'').toUpperCase().replace(/[\s\-\u200e\u200f\u202a-\u202e\u2066-\u2069]/g,'');
 return /^MD[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(s)?'MD-'+s.slice(2,6)+'-'+s.slice(6):null;
}
export async function ensureAccountCode(db,userId,generate=newAccountCode){
 const find=()=>db.prepare('SELECT code FROM account_codes WHERE user_id=?').bind(userId).first();
 const existing=await find();if(existing)return existing.code;
 for(let i=0;i<6;i++){
  await db.prepare('INSERT INTO account_codes(user_id,code) VALUES(?,?) ON CONFLICT DO NOTHING').bind(userId,generate()).run();
  const row=await find();if(row)return row.code;
 }
 throw Error('account_code_unavailable');
}
