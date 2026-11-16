import SRWE from './srwe-bank.json' with {type:'json'};
import OS1_V3 from './os1-content-v3.json' with {type:'json'};
import OS1_V2 from './os1-content-v2.json' with {type:'json'};
import OS1_V1 from './os1-content-v1.json' with {type:'json'};
import ACCESS_AV from './access-bank-av-20261025.json' with {type:'json'};
import EXCEL_V82 from './excel-bank-v82.json' with {type:'json'};
import {OS1_COURSE} from './os1-course.mjs';
import {NETWORK_COURSE} from './network-course.mjs';
import WORD_LEGACY from './word-bank-legacy.json' with {type:'json'};
import WORD_V55 from './word-bank-v55.json' with {type:'json'};
import WORD_V81 from './word-bank-v81.json' with {type:'json'};
import {readContent,BASE} from './content-store.mjs';import {EXCEL_BASE,ACCESS_BASE,COURSES} from './course-base.mjs';
export async function readCatalog(db){const parts=await Promise.all(COURSES.map(async subject=>({subject,...await readContent(db,false,subject)})));return {data:{lessons:[...parts.flatMap(p=>p.data.lessons.map(l=>({...l,subject:p.subject}))),...NETWORK_COURSE.lessons,...OS1_COURSE.lessons],questions:[...parts.flatMap(p=>p.data.questions.map(q=>({...q,subject:p.subject}))),...SRWE.questions]},publishedId:parts.map(p=>p.publishedId).join(':')};}
export async function bankFor(db,version){if(version===SRWE.bankVersion)return SRWE;if(version===OS1_COURSE.bankVersion)return OS1_COURSE;if(version===OS1_V3.bankVersion)return OS1_V3;if(version===OS1_V2.bankVersion)return OS1_V2;if(version===OS1_V1.bankVersion)return OS1_V1;if(version===NETWORK_COURSE.bankVersion)return NETWORK_COURSE;for(const subject of COURSES){const c=await readContent(db,false,subject);if(c.data.bankVersion===version)return c.data;}for(const b of [BASE,EXCEL_BASE,EXCEL_V82,ACCESS_BASE,WORD_LEGACY,WORD_V55,WORD_V81,ACCESS_AV])if(b.bankVersion===version)return b;const r=await db.prepare("SELECT payload FROM content_versions WHERE id NOT LIKE 'night-version-%' AND json_extract(payload,'$.bankVersion')=? ORDER BY created_at DESC LIMIT 1").bind(version).first();return r?JSON.parse(r.payload):null;}
