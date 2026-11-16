# Course integration checklist

Use this checklist when adding a course, lesson, or practice workflow. It provides an English entry point to the existing [detailed integration policy, in Arabic](../COURSE_INTEGRATION.md). Consult that policy for implementation-specific requirements.

## Registration and content

- Register stable course identifiers in `lib/course-base.mjs` and `lib/course-catalog.mjs`.
- Preserve source names, numbering, and provenance.
- Check question quality, content versions, and handling of paused or reported questions.
- Do not infer learner mastery from generated content or synthetic tests.

## Accounts and persistence

- Verify the flow with two separate accounts and a guest.
- Check progress, active sessions, notes, bookmarks, statistics, and review records.
- Check full backup and restore, unsaved-data warnings, revision conflicts, and connection failure.
- Do not automatically import guest data into an account.
- Confirm that shared account services include the new course rather than maintaining a separate inconsistent course list.

## Feedback and user experience

- Connect feedback and problem reports to the relevant course and content.
- Check notifications and actionable error states.
- Preserve the appearance of Advanced Computer Applications, including the effects of shared files, unless the owner explicitly authorizes a change.

## Acceptance evidence

Record what was checked, how it was checked, the result, and any remaining limitations. A visible course page alone is not complete integration. Keep synthetic test fixtures separate from real learner records.
