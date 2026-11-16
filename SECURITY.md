# Security and data handling

These instructions describe how to handle sensitive information. They are not a security certification.

## Report a sensitive issue

Do not publish credentials, real learner data, or account-exposing reproduction details in a public issue.

The repository exists and Issues are enabled. Use **Security → Report a vulnerability** only if that option is available. Private vulnerability reporting has not been verified as enabled; do not assume that an ordinary Issue is private. Otherwise, contact the owner through an existing private channel rather than posting sensitive details in Issues.

No dedicated security email or response-time commitment has been established. Confirm a usable private reporting route for the now-public repository; do not publish a personal address as that route without the owner's decision.

## Keep out of the repository

- Environment files containing secrets, service keys, and cookies.
- Live databases, backups, account records, and learner progress.
- Screenshots containing personal information or non-test account details.

Adding a file to `.gitignore` does not remove earlier tracked copies from Git history. If a secret has been exposed, address the credential's validity first, then use an appropriate history-remediation procedure.

## Authentication and hosting

Application code reads identity headers supplied by a hosting gateway. Local test identity is not production authentication. Review the trust boundary, storage permissions, and isolation between two accounts and a guest before approving a hosted environment.

## Automated checks

The four-job workflow requests read access to repository contents, pins actions to full commit hashes, and has no deployment steps or deployment secrets. It tests repository safeguards, Windows/Linux startup and recovery, and Linux browser/visual behavior with synthetic data. The hosted guest verifier is opt-in and does not run against production in CI. These checks do not establish comprehensive security, real hosted account isolation, or clearance of Git history and media for public access.

Reference: [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).
