import {isActivityAdmin} from './activity.mjs';
import {readCatalog as readContent} from './course-catalog.mjs';
const DAY=86400000,OFFSET=10800000;
const json=(v,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export function windowFor(days,now){const today=Math.floor((now+OFFSET)/DAY)*DAY-OFFSET;return {from:today-(days-1)*DAY,to:now,today};}
// Aggregate on the server: no actor identifiers, names, scores or free text leave this endpoint.
export async function readInsights(req,db,user,now=Date.now()){
 if(!isActivityAdmin(user))return json({error:user?'forbidden':'sign_in_required'},user?403:401);
 if(!db)return json({error:'unavailable'},503);
 const params=new URL(req.url).searchParams,rawDays=params.get('days')||'7',kind=params.get('kind')||'all';
 if(!['7','30','90'].includes(rawDays)||!['all','account','guest'].includes(kind))return json({error:'filter'},400);
 const days=Number(rawDays),window=windowFor(days,now),args=[window.from,now,user.userId];
 const where="received_at >= ? AND received_at <= ? AND NOT (actor_kind = 'account' AND actor_id = ?)"+(kind==='all'?'':' AND actor_kind = ?');if(kind!=='all')args.push(kind);
 const actor="actor_kind || ':' || actor_id",day="date(received_at / 1000, 'unixepoch', '+3 hours')";
 // batch provides one consistent read snapshot, even while new activity arrives.
 const queries=[
  `SELECT COUNT(*) events,COUNT(DISTINCT ${actor}) actors,MIN(received_at) first,MAX(received_at) last FROM activity_events WHERE ${where}`,
  `SELECT actor_kind kind,COUNT(DISTINCT ${actor}) actors FROM activity_events WHERE ${where} GROUP BY actor_kind`,
  `SELECT COUNT(*) returners FROM (SELECT ${actor} FROM activity_events WHERE ${where} GROUP BY actor_kind,actor_id HAVING COUNT(DISTINCT ${day}) >= 2)`,
  `SELECT event_type type,COUNT(*) events,COUNT(DISTINCT ${actor}) actors FROM activity_events WHERE ${where} GROUP BY event_type`,
  `SELECT ${day} day,COUNT(DISTINCT ${actor}) actors,COUNT(DISTINCT CASE WHEN actor_kind='account' THEN actor_id END) accounts,COUNT(DISTINCT CASE WHEN actor_kind='guest' THEN actor_id END) guests FROM activity_events WHERE ${where} GROUP BY ${day} ORDER BY day`,
  `SELECT lesson,COUNT(CASE WHEN event_type='page_open' AND page IN ('learn','excel','access','network','os1') THEN 1 END) opens,COUNT(DISTINCT CASE WHEN event_type='page_open' AND page IN ('learn','excel','access','network','os1') THEN ${actor} END) openers,COUNT(DISTINCT CASE WHEN event_type='video_play' THEN ${actor} END) players,COUNT(CASE WHEN event_type='video_play' THEN 1 END) plays,COUNT(DISTINCT CASE WHEN event_type='bookmark_add' THEN ${actor} END) savers FROM activity_events WHERE ${where} AND lesson IS NOT NULL GROUP BY lesson`,
  `SELECT COUNT(DISTINCT ${actor}) actors,COUNT(*) events FROM activity_events WHERE ${where} AND event_type='page_open' AND page IN ('learn','excel','access','network','os1') AND lesson IS NOT NULL`,
 ];
 const results=await db.batch(queries.map(q=>db.prepare(q).bind(...args))),[summary,audience,returns,events,daily,lessonRows,opened]=results.map(x=>x.results);
 const content=await readContent(db),byLesson=new Map(lessonRows.map(x=>[x.lesson,x]));
 const lessons=content.data.lessons.map(l=>({id:l.id,title:l.subject+' · '+l.title,unit:l.unit,opens:0,openers:0,players:0,plays:0,savers:0,...byLesson.get(l.id)})).sort((a,b)=>b.openers-a.openers||a.unit-b.unit||a.id.localeCompare(b.id));
 const byDay=new Map(daily.map(x=>[x.day,x])),calendar=Array.from({length:days},(_,i)=>{const key=new Date(window.from+OFFSET+i*DAY).toISOString().slice(0,10);return {day:key,actors:0,accounts:0,guests:0,...byDay.get(key)};});
 return json({days,kind,from:window.from,to:now,timeZone:'Asia/Riyadh',summary:summary[0],audience,returning:returns[0].returners,events,daily:calendar,lessons,opened:opened[0],unknownLessons:lessonRows.filter(x=>!content.data.lessons.some(l=>l.id===x.lesson)).length,publishedId:content.publishedId});
}
