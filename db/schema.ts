// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, index, uniqueIndex, primaryKey } from 'drizzle-orm/sqlite-core';
export const madarStates=sqliteTable('madar_states',{owner:text('owner').notNull(),kind:text('kind').notNull(),snapshot:text('snapshot').notNull(),revision:integer('revision').notNull(),requestId:text('request_id').notNull(),updatedAt:text('updated_at').notNull()},t=>[primaryKey({columns:[t.owner,t.kind]})]);
export const learnerProgress = sqliteTable('learner_progress', {
  userId: text('user_id').primaryKey(),
  payload: text('payload').notNull(),
  revision: integer('revision').notNull().default(1),
  updatedAt: text('updated_at').notNull(),
});

export const feedbackLimits = sqliteTable('feedback_limits', {
 key: text('key').primaryKey(),
 count: integer('count').notNull(),
 expiresAt: integer('expires_at').notNull(),
});

export const activityEvents = sqliteTable('activity_events', {
 id: integer('id').primaryKey({autoIncrement:true}),
 eventId: text('event_id').notNull(),
 actorKind: text('actor_kind').notNull(),
 actorId: text('actor_id').notNull(),
 actorName: text('actor_name'),
 eventType: text('event_type').notNull(),
 page: text('page').notNull(),
 lesson: text('lesson'),
 question: text('question'),
 value: text('value'),
 campaignId: text('campaign_id'),
 clientAt: text('client_at').notNull(),
 receivedAt: integer('received_at').notNull(),
}, t => [uniqueIndex('activity_event_unique').on(t.eventId),index('activity_received').on(t.receivedAt),index('activity_actor').on(t.actorKind,t.actorId,t.id),index('activity_campaign').on(t.campaignId,t.receivedAt)]);
export const activityLimits = sqliteTable('activity_limits', {
 key:text('key').primaryKey(),count:integer('count').notNull(),expiresAt:integer('expires_at').notNull(),
});
export const campaignLinks=sqliteTable('campaign_links',{
 id:text('id').primaryKey(),label:text('label').notNull(),channel:text('channel').notNull(),target:text('target').notNull(),
 active:integer('active').notNull().default(1),revision:integer('revision').notNull().default(1),createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull(),
});
export const lessonNotes = sqliteTable('lesson_notes', {
 userId:text('user_id').notNull(),lesson:text('lesson').notNull(),note:text('note').notNull(),
 revision:integer('revision').notNull(),updatedAt:text('updated_at').notNull(),
},t=>[primaryKey({columns:[t.userId,t.lesson]})]);
export const contentWorkspace=sqliteTable('content_workspace',{
 id:integer('id').primaryKey(),draft:text('draft').notNull(),revision:integer('revision').notNull(),publishedId:text('published_id'),updatedAt:text('updated_at').notNull(),
});
export const contentVersions=sqliteTable('content_versions',{
 id:text('id').primaryKey(),payload:text('payload').notNull(),label:text('label').notNull(),createdAt:text('created_at').notNull(),actor:text('actor').notNull(),
});
export const questionResponses=sqliteTable('question_responses',{
 id:integer('id').primaryKey({autoIncrement:true}),actorKind:text('actor_kind').notNull(),actorId:text('actor_id').notNull(),sessionId:text('session_id').notNull(),
 question:text('question').notNull(),fingerprint:text('fingerprint').notNull(),bankVersion:text('bank_version').notNull(),mode:text('mode').notNull(),answer:integer('answer').notNull(),correct:integer('correct').notNull(),receivedAt:integer('received_at').notNull(),
},t=>[uniqueIndex('response_once').on(t.actorKind,t.actorId,t.sessionId,t.question),index('response_period').on(t.receivedAt),index('response_item').on(t.question,t.fingerprint,t.mode)]);
export const questionReviews=sqliteTable('question_reviews',{
 question:text('question').notNull(),fingerprint:text('fingerprint').notNull(),status:text('status').notNull(),note:text('note').notNull(),checklist:text('checklist').notNull(),revision:integer('revision').notNull(),updatedAt:text('updated_at').notNull(),actor:text('actor').notNull(),
},t=>[primaryKey({columns:[t.question,t.fingerprint]})]);
export const feedbackEntries=sqliteTable('feedback_entries',{
 id:text('id').primaryKey(),requestId:text('request_id').notNull(),payloadHash:text('payload_hash').notNull(),
 actorKind:text('actor_kind').notNull(),actorId:text('actor_id').notNull(),actorName:text('actor_name'),
 kind:text('kind').notNull(),category:text('category').notNull(),targetType:text('target_type').notNull(),targetId:text('target_id'),
 targetTitle:text('target_title').notNull(),snapshot:text('snapshot').notNull(),bankVersion:text('bank_version').notNull(),
 message:text('message').notNull(),rating:integer('rating'),status:text('status').notNull(),ownerNote:text('owner_note').notNull(),
 revision:integer('revision').notNull(),createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull(),
},t=>[uniqueIndex('feedback_once').on(t.actorKind,t.actorId,t.requestId),index('feedback_inbox').on(t.kind,t.status,t.createdAt),index('feedback_sender').on(t.actorKind,t.actorId,t.createdAt)]);

export const serviceAlerts=sqliteTable('service_alerts',{id:text('id').primaryKey(),status:text('status').notNull(),occurrences:integer('occurrences').notNull(),firstAt:integer('first_at').notNull(),lastAt:integer('last_at').notNull(),lastSuccess:integer('last_success'),ackAt:integer('ack_at')});
export const videoChecks=sqliteTable('video_checks',{lesson:text('lesson').primaryKey(),video:text('video').notNull(),status:text('status').notNull(),code:integer('code'),checkedAt:integer('checked_at').notNull()});
export const serviceScan=sqliteTable('service_scan',{id:integer('id').primaryKey(),token:text('token').notNull(),startedAt:integer('started_at').notNull(),finishedAt:integer('finished_at')});

export const memberAccounts=sqliteTable('member_accounts',{userId:text('user_id').primaryKey(),email:text('email').notNull(),name:text('name').notNull(),createdAt:integer('created_at').notNull(),lastSeen:integer('last_seen').notNull()});
export const membershipEvents=sqliteTable('membership_events',{id:integer('id').primaryKey({autoIncrement:true}),requestId:text('request_id').notNull(),userId:text('user_id').notNull(),product:text('product').notNull(),action:text('action').notNull(),actorId:text('actor_id').notNull(),createdAt:integer('created_at').notNull()},t=>[uniqueIndex('membership_request_unique').on(t.requestId),index('membership_user_product').on(t.userId,t.product,t.id)]);

export const accountCodes=sqliteTable('account_codes',{userId:text('user_id').primaryKey(),code:text('code').notNull()},t=>[uniqueIndex('account_code_unique').on(t.code)]);
export const excelStudyEvents=sqliteTable('excel_study_events',{
 userId:text('user_id').notNull(),eventId:text('event_id').notNull(),kind:text('kind').notNull(),lesson:text('lesson').notNull(),payload:text('payload').notNull(),createdAt:text('created_at').notNull(),
},t=>[primaryKey({columns:[t.userId,t.eventId]}),index('excel_study_owner').on(t.userId,t.createdAt)]);
export const worksheetSaves=sqliteTable('worksheet_saves',{
 userId:text('user_id').notNull(),lesson:text('lesson').notNull(),snapshot:text('snapshot').notNull(),revision:integer('revision').notNull(),requestId:text('request_id').notNull(),updatedAt:text('updated_at').notNull(),
},t=>[primaryKey({columns:[t.userId,t.lesson]})]);
