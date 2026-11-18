# Security and data handling

These instructions describe how to handle sensitive information. They are not a security certification.

## Report a sensitive issue

Do not publish credentials, real learner data, or account-exposing reproduction details in a public issue.

Use [Report a vulnerability](https://github.com/dahman0al0shahri/madar/security/advisories/new) for sensitive reports. Private reporting was enabled and verified through the GitHub API on 18 November 2026. The owner has not established a response-time commitment.

## Keep out of the repository

- Environment files containing secrets, service keys, and cookies.
- Live databases, backups, account records, and learner progress.
- Screenshots containing personal information or non-test account details.

Adding a file to `.gitignore` does not remove earlier tracked copies from Git history. If a secret has been exposed, address the credential's validity first, then use an appropriate history-remediation procedure.

## Authentication and hosting

Application code reads identity headers supplied by a hosting gateway. Local test identity is not production authentication. Review the trust boundary, storage permissions, and isolation between two accounts and a guest before approving a hosted environment.

## Automated checks

The four-job workflow requests read access to repository contents, pins actions to full commit hashes, and deploys the checked source atlas to GitHub Pages after a successful main run. It tests repository safeguards, Windows/Linux startup and recovery, and Linux browser/visual behavior with synthetic data. The hosted guest verifier is opt-in and does not run against production in CI. These checks do not establish comprehensive security, real hosted account isolation, or clearance of Git history and media for public access.

Reference: [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).
