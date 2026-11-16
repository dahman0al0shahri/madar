import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";
import {denied} from '../lib/private-review-access.mjs';
import {addExamClock, clockSnapshot} from '../lib/exam-clock.mjs';
const retiredAssets=new Set(['/night-review.js','/night-review.css','/night-space.js','/night-admin.js','/night-entry.js','/night-entry.css','/members-admin.js']);

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    if(new URL(request.url).pathname === '/api/exam-clock') {
      if(request.method !== 'GET' && request.method !== 'HEAD')return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
      return new Response(request.method === 'HEAD' ? null : JSON.stringify(clockSnapshot()),{headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
    }
    if(retiredAssets.has(new URL(request.url).pathname))return denied();
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    const response = await runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
    const pagePath=new URL(request.url).pathname;
    return request.method === 'GET' && !['/','/network-lab','/network-background.html'].includes(pagePath) ? addExamClock(response) : response;
  },
};
