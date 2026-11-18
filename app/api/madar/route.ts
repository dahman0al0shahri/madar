import { env } from 'cloudflare:workers';
import { getChatGPTUser, chatGPTSignInPath, chatGPTSignOutPath } from '../../chatgpt-auth';
import { isActivityAdmin } from '../../../lib/activity.mjs';
import { configFor, permitted, lessonPermitted, networkAllowed, reply } from '../../../lib/madar-state.mjs';
import { COURSE_REGISTRY } from '../../../lib/course-base.mjs';
import { readCatalog } from '../../../lib/course-catalog.mjs';
import { hubLesson, updateVisible, summarizeReview } from '../../../lib/hub-bootstrap.mjs';

export const dynamic = 'force-dynamic';

type Update = Parameters<typeof updateVisible>[0];

export async function GET() {
  try {
    const db = env.DB;
    if (!db) return reply({ error: 'unavailable' }, 503);

    const user = await getChatGPTUser();
    const admin = isActivityAdmin(user);
    const { config } = await configFor(db);
    const catalog = await readCatalog(db);
    const day = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());

    const courses = COURSE_REGISTRY.filter(course => permitted(config, course.id, user));
    const allowed = courses.map(course => course.id);
    const lessons = catalog.data.lessons
      .filter(lesson => lessonPermitted(config, lesson.id, user))
      .map(hubLesson);
    const visibleLessons = new Set(lessons.map(lesson => lesson.id));
    const updates = config.updates.filter((update: Update) => updateVisible(update, allowed, visibleLessons, day));

    const notes = user
      ? (await db.prepare('SELECT lesson,note FROM lesson_notes WHERE user_id=?')
          .bind(user.userId).all<{ lesson: string; note: string }>()).results
          .filter(note => visibleLessons.has(note.lesson))
      : [];

    const reviewRow = user && allowed.includes('network')
      ? await db.prepare("SELECT snapshot FROM madar_states WHERE owner=? AND kind='srwe'")
          .bind(user.userId).first<{ snapshot: string }>()
      : null;
    const review = summarizeReview(reviewRow ? JSON.parse(reviewRow.snapshot) : null);

    return reply({
      review,
      account: {
        user: user ? { id: user.userId, name: user.displayName } : null,
        isAdmin: admin,
        signIn: chatGPTSignInPath('/'),
        signOut: chatGPTSignOutPath('/')
      },
      courses: courses.map(({ id, name }) => ({ id, name })),
      allowed,
      canPractice: await networkAllowed(db, user),
      lessons,
      notes,
      config: {
        version: 1,
        access: Object.fromEntries(['office', 'network', 'os1'].map(id => [id, allowed.includes(id) ? 'public' : 'draft'])),
        contentAccess: {},
        updates
      }
    });
  } catch {
    return reply({ error: 'unavailable' }, 503);
  }
}
