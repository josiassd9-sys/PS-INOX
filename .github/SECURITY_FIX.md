# Security Fix: firebase-debug.log Exposure

## Overview

The `firebase-debug.log` file (and related debug logs like `dataconnect-debug.log` and `pglite-debug.log`) have been committed to the Git history of this repository. These files may contain sensitive information including:

- Authentication tokens and credentials
- API keys and secrets
- Project IDs and configuration details
- Internal system paths and structure
- User emails and session data

## Immediate Actions Required

### 1. Revoke and Rotate Credentials

**CRITICAL**: If any credentials were exposed in the debug logs, they must be revoked immediately:

1. **Firebase Authentication Tokens**: Revoke all active sessions in Firebase Console
   - Go to Firebase Console → Authentication → Users
   - Revoke sessions for affected users or service accounts

2. **API Keys**: Rotate any exposed API keys
   - Firebase Console → Project Settings → Service Accounts
   - Generate new private keys and delete old ones

3. **Service Account Credentials**: Revoke and recreate service accounts if exposed
   - Cloud Console → IAM & Admin → Service Accounts
   - Create new service accounts and delete compromised ones

4. **Database Credentials**: If database credentials were exposed, rotate them immediately
   - Update connection strings and passwords in all environments

### 2. Rewrite Git History

To permanently remove the sensitive files from Git history, you have two options:

#### Option A: Using git-filter-repo (Recommended)

1. Install git-filter-repo:
   ```bash
   pip install git-filter-repo
   ```

2. Clone a fresh copy of the repository:
   ```bash
   git clone <repository-url>
   cd <repository>
   ```

3. Run the purge script provided in this repository:
   ```bash
   bash scripts/purge_firebase_debuglog_history.sh
   ```

4. Force push the cleaned history:
   ```bash
   git push origin --force --all
   git push origin --force --tags
   ```

#### Option B: Using BFG Repo-Cleaner

1. Download BFG Repo-Cleaner:
   ```bash
   wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
   ```

2. Clone a mirror of the repository:
   ```bash
   git clone --mirror <repository-url>
   ```

3. Remove the files using BFG:
   ```bash
   java -jar bfg-1.14.0.jar --delete-files firebase-debug.log repo.git
   java -jar bfg-1.14.0.jar --delete-files dataconnect-debug.log repo.git
   java -jar bfg-1.14.0.jar --delete-files pglite-debug.log repo.git
   ```

4. Clean up and push:
   ```bash
   cd repo.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

### 3. Notify All Contributors

After rewriting history:

1. **Notify all team members** that the repository history has been rewritten
2. **Instruct them to re-clone** the repository:
   ```bash
   # Delete old local repository
   rm -rf <repository-name>
   
   # Clone fresh copy
   git clone <repository-url>
   ```

3. **Warn against force-pushing** old history back to the repository

### 4. Audit Cloud Resources

Review your Firebase/Cloud Console for any suspicious activity:

1. **Firebase Console → Authentication → Users**
   - Check for unauthorized user accounts or sessions

2. **Cloud Console → IAM & Admin → Audit Logs**
   - Review for suspicious API calls or access patterns

3. **Firebase Console → Usage and billing**
   - Check for unusual spikes in usage that might indicate compromise

4. **Cloud Console → Security Command Center**
   - Review any security findings or alerts

### 5. Update Security Practices

1. Ensure `.gitignore` is properly configured (already done in this PR)
2. Enable pre-commit hooks to prevent committing sensitive files
3. Implement secret scanning in CI/CD pipeline
4. Use environment variables for all sensitive configuration
5. Regularly audit repository for sensitive data

## Prevention

This PR adds the following protections:

- Updated `.gitignore` to exclude all debug log files
- Updated `functions/.gitignore` to exclude debug logs
- This security documentation
- Automated purge script for history cleanup

## Additional Resources

- [Git Filter-Repo Documentation](https://github.com/newren/git-filter-repo)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [GitHub: Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/security)

## Support

If you need assistance with this security remediation:

1. Contact your security team immediately
2. Review Firebase and GCP documentation
3. Consider engaging a security consultant if credentials were exposed

---

**Remember**: The .gitignore changes only prevent future commits. You MUST rewrite history to remove already-committed sensitive files.
