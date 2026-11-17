import { cloneState } from './state.mjs';
import { routeFromHash } from './navigation.mjs';

// Browser/storage objects are supplied by the composition root, not read globally.
export function createPreviewEnvironment({ initial, getWidget, storage, key, shouldFail }) {
  let restored = getWidget()?.widgetState?.privateContent?.hub;
  if (!restored) { try { restored = JSON.parse(storage.getItem(key) || 'null'); } catch {} }
  return {
    initial, restored, isAdmin: false, hosted: false,
    savedMessage: 'تم الحفظ في المعاينة',
    async write(snapshot) {
      if (shouldFail()) throw Error('simulated');
      const widget = getWidget();
      if (widget?.setWidgetState) {
        await widget.setWidgetState({
          modelContent: { preview: 'معاينة رئيسية مدار والمقررات؛ ليست بيانات تعلم', page: snapshot.route, viewer: snapshot.viewer },
          privateContent: { hub: snapshot },
        });
      } else storage.setItem(key, JSON.stringify(snapshot));
    },
  };
}

export async function createHostedEnvironment({ initial, fetchBoot, openStore, hash, readLocalNote }) {
  const response = await fetchBoot();
  if (!response.ok) throw Error('تعذر تحميل مدار');
  const boot = await response.json();
  const store = await openStore('profile');
  const adminStore = boot.account.isAdmin ? await openStore('config', true) : null;
  const config = adminStore?.value || boot.config;
  const defaults = Object.assign(cloneState(initial), {
    access: config.access, contentAccess: config.contentAccess, updates: config.updates,
  });
  const profile = { ...store.value, visits: store.value?.visits || {}, notes: { ...store.value?.notes }, latest: store.value?.latest || null };
  for (const note of boot.notes || []) profile.notes[note.lesson] = note.note;
  if (!boot.account.user) {
    for (const lesson of boot.lessons) {
      try { const note = readLocalNote(lesson.id); if (note?.text) profile.notes[lesson.id] = note.text; } catch {}
    }
  }
  return {
    boot, store, adminStore, config, hosted: true, isAdmin: Boolean(boot.account.isAdmin), initial: defaults,
    restored: { ...defaults, profiles: { student: profile, guest: { visits: {}, notes: {}, latest: null } },
      editor: adminStore ? store.value?.editor || null : null, route: routeFromHash(hash) },
    savedMessage: boot.account.user ? 'تم الحفظ في حسابك' : 'تم الحفظ على هذا المتصفح',
    async write(snapshot) {
      if (adminStore) await adminStore.save({ version: 1, access: snapshot.access,
        contentAccess: snapshot.contentAccess, grants: config.grants || {}, updates: snapshot.updates });
      await store.save({ version: 1, ...snapshot.profiles.student, editor: adminStore ? snapshot.editor : null });
    },
  };
}
