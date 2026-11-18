export async function localRequestsOnly(context, baseURL) {
  // All requests stay on the disposable local server. No production analytics or learner services.
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === baseURL || ['data:', 'blob:'].includes(url.protocol)
      ? route.continue() : route.abort('blockedbyclient');
  });
}
