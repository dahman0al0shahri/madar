const environment = await createHostedEnvironment({
  initial,
  fetchBoot: () => fetch('/api/madar', { cache: 'no-store' }),
  openStore: (...args) => MadarStore.open(...args),
  hash: location.hash,
  readLocalNote: id => JSON.parse(localStorage.getItem('madar-notes-v1:guest:' + id) || 'null'),
});
const lessons = environment.boot.lessons;
window.MADAR_ACCOUNT = { ...environment.boot.account, available: true };
