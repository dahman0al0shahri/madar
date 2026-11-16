# Hosted verification

## Verified scope and remaining blocker

On 16 November 2026, the owner requested hosted testing with dedicated accounts and confirmed that no test accounts were available. **Authenticated sign-in, two-account isolation and hosted recovery remain unverified.** The work below verifies anonymous access only; it must not be presented as completion of that account acceptance requirement.

Sites metadata identified the public MADAR Site at `https://madar-word-lab.d7d7y7.chatgpt.site`, project `appgprj_6abf78ca27ec8191a502c42fe942a0e9`. Published version **115** reports source commit `d675b27ee15f85c77288dd87f0eb21477d09c67b` and a successful deployment. GitHub maintenance commits do not automatically redeploy that Site. Recheck native Site metadata before a later hosted test; these are dated observations, not a permanent availability claim.

The first live run passed **12 checks** on 16 November 2026 at 15:05 UTC. Its local result is retained outside tracked source. This PR records the exact code and review/CI results. No Site source, runtime environment, audience, deployment, database migration or protection setting was changed.

## Repeat the anonymous check

Only after the owner authorizes a live check and the Site identity/audience has been verified:

```sh
node scripts/check-hosted-guest.mjs --run-live
```

The explicit flag is required. The command verifies the checked-in Site and repository identities, uses one fixed HTTPS origin, and accepts no URL, cookie, token or other arguments. It makes at most twelve sequential GET requests, with a 20-second timeout per request and a 4 MiB body limit. It does not execute page JavaScript, follow redirects, reuse a browser session, send credentials, download a real account backup, or write application records. Hosting access logs may record ordinary requests.

| Check | Expected result |
| --- | --- |
| Home, applications and network lab | HTTP 200 HTML |
| Account metadata | Guest identity, no administrator role, private/no-store policy |
| Course catalog | Public course content, no account identity, learner notes or review state |
| Progress, account backup, notes, worksheet and shared course-state endpoints | HTTP 401 with sign-in-required response and private/no-store policy |
| Client-supplied identity headers on the progress endpoint | Still HTTP 401; the probe uses a new nonexistent synthetic ID and example.invalid email |
| Sign-in entry | HTTPS redirect only; the destination is not followed and no login is claimed |

The forged-header probe deliberately avoids `/api/account`, which registers an authenticated user on GET. It never uses a real learner's ID. Any failed check stops further requests. Results contain only check names, sanitized paths, status codes and timestamps, not response bodies, identity values, cookies, tokens or OAuth destinations. Evidence is written to the ignored `.sites-runtime/hosted-guest-check-*/result.json` directory.

`status: passed` applies only to `scope: hosted-anonymous-read-only`. Separate report fields retain `authenticatedAccounts: not-tested-no-dedicated-accounts`, `crossAccountIsolation: not-tested` and `hostedRecovery: not-tested`. Do not replace those with success because guest access passed.

## CI boundary

`node scripts/check-repository.mjs` runs offline contract tests using a fake transport. They verify explicit opt-in, identity restrictions, credential-free GET-only behavior, no redirect following, and failure when private data becomes accessible, client identity is accepted, caching is unsafe, or a private endpoint redirects. Failure reports must not leak sentinel private content.

These offline tests do **not** contact production or demonstrate real account isolation. The normal four CI jobs remain; no scheduled production scan, cloud token, cookie, deployment permission or new dependency is added. Run the live command explicitly when it is needed, rather than adding it to every push.

## Completing authenticated acceptance later

1. Provide two dedicated non-admin ChatGPT test accounts that the owner controls. Sign in manually through the real Sites flow using separate fresh browser contexts. Keep passwords, cookies and session files out of chat, source, logs and CI artifacts. Do not substitute the owner's personal account or another learner.
2. Agree on a separate hosted test Site and empty D1/R2 storage before running write/recovery cases. Match the reviewed application version and appearance without copying learner records. Confirm the selected Site's actual guest/access policy; do not widen the live audience for testing.
3. Verify each real account identity independently. Save clearly synthetic notes, bookmarks and state in account A, confirm account B and the guest cannot read them, and test owner mismatch, rejected cross-owner writes and stale revisions against synthetic records only. Verify B's separate records too.
4. Test reload, a fresh session, sign-out, interrupted saves and account export. Compare exported content with each account's own fixtures. Collect sanitized evidence; browser traces can contain sessions and must not be uploaded without inspection.
5. Rehearse operator recovery and R2 media recovery only in that separate target, with an explicit source/target and rollback plan. Review cleanup of test records separately; the existing test command does not delete records.

Sites service-access tokens bypass the Site gate without supplying a user identity. They cannot stand in for the two real accounts. Local `local_seedy` authentication likewise does not prove hosted sign-in. Until the prerequisites exist, retain the blocker instead of weakening authentication or claiming a simulated result as hosted evidence.

See [backup and recovery](BACKUP_RECOVERY.md), [browser tests](BROWSER_TESTS.md), and OWASP's [authorization testing guidance](https://owasp.github.io/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/02-Testing_for_Bypassing_Authorization_Schema).
