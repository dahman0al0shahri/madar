# Security and data handling

These instructions describe how to handle sensitive information. They are not a security certification.

## Report a sensitive issue

Do not publish credentials, real learner data, or account-exposing reproduction details in a public issue.

After the GitHub repository is created, use **Security → Report a vulnerability** if the owner has enabled private reporting. Until a private channel is established, contact the owner through a private channel you already know rather than posting sensitive details in Issues.

This draft does not establish a security email address or response-time commitment. A private reporting channel must be confirmed before inviting public contributions.

## Keep out of the repository

- Environment files containing secrets, service keys, and cookies.
- Live databases, backups, account records, and learner progress.
- Screenshots containing personal information or non-test account details.

Adding a file to `.gitignore` does not remove earlier tracked copies from Git history. If a secret has been exposed, address the credential's validity first, then use an appropriate history-remediation procedure.

## Authentication and hosting

Application code reads identity headers supplied by a hosting gateway. Local test identity is not production authentication. Review the trust boundary, storage permissions, and isolation between two accounts and a guest before approving a hosted environment.

## Automated checks

The added workflow requests read access to repository contents, pins actions to full commit hashes, and has no deployment steps or deployment secrets. Local tests and link checks do not replace a review of security, content, and Git history.

Reference: [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).
