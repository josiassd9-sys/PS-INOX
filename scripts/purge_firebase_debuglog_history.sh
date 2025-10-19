#!/bin/bash

# Script to purge firebase-debug.log and related debug logs from Git history
# This script uses git-filter-repo to remove sensitive debug log files
#
# WARNING: This will rewrite Git history. Make sure you:
# 1. Have notified all team members
# 2. Have rotated/revoked any exposed credentials
# 3. Have a backup of the repository
# 4. Are prepared to force-push and have all team members re-clone

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${YELLOW}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║  Firebase Debug Log History Purge Script                     ║${NC}"
echo -e "${YELLOW}║  WARNING: This will rewrite Git history                      ║${NC}"
echo -e "${YELLOW}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if git-filter-repo is installed
if ! command -v git-filter-repo &> /dev/null; then
    echo -e "${RED}Error: git-filter-repo is not installed${NC}"
    echo ""
    echo "Please install it first:"
    echo "  pip install git-filter-repo"
    echo ""
    echo "Or on macOS:"
    echo "  brew install git-filter-repo"
    echo ""
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${RED}Error: You have uncommitted changes${NC}"
    echo "Please commit or stash your changes before running this script"
    exit 1
fi

echo -e "${YELLOW}Pre-flight checks:${NC}"
echo ""
echo -e "${RED}⚠️  IMPORTANT CHECKLIST ⚠️${NC}"
echo ""
echo "Before proceeding, ensure you have:"
echo "  [ ] Notified all team members about the history rewrite"
echo "  [ ] Revoked/rotated any exposed credentials"
echo "  [ ] Created a backup of the repository"
echo "  [ ] Read the .github/SECURITY_FIX.md documentation"
echo ""
echo -e "${YELLOW}This script will remove these files from Git history:${NC}"
echo "  - firebase-debug.log"
echo "  - dataconnect-debug.log"
echo "  - pglite-debug.log"
echo ""

# Ask for confirmation
read -p "Are you absolutely sure you want to continue? (type 'yes' to proceed): " -r
echo
if [[ ! $REPLY =~ ^yes$ ]]; then
    echo -e "${YELLOW}Aborted by user${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}Starting history purge...${NC}"
echo ""

# Create a backup branch
BACKUP_BRANCH="backup-before-purge-$(date +%Y%m%d-%H%M%S)"
echo -e "${YELLOW}Creating backup branch: ${BACKUP_BRANCH}${NC}"
git branch "${BACKUP_BRANCH}"

# Define files to remove
FILES_TO_REMOVE=(
    "firebase-debug.log"
    "dataconnect-debug.log"
    "pglite-debug.log"
)

echo ""
echo -e "${YELLOW}Removing files from Git history...${NC}"

# Build the path list for git-filter-repo
PATH_ARGS=()
for file in "${FILES_TO_REMOVE[@]}"; do
    PATH_ARGS+=("--path" "${file}")
    PATH_ARGS+=("--path" "functions/${file}")
done

# Run git-filter-repo to remove the files
echo "Running: git-filter-repo --invert-paths --force" "${PATH_ARGS[@]}"
git-filter-repo --invert-paths --force "${PATH_ARGS[@]}"

echo ""
echo -e "${GREEN}✓ History rewrite complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Verify the changes:"
echo "   git log --all --oneline --graph"
echo ""
echo "2. Check that sensitive files are removed:"
echo "   git log --all --full-history --source --all --remotes -- '*firebase-debug.log'"
echo ""
echo "3. Force push to remote (THIS WILL REWRITE HISTORY ON REMOTE):"
echo "   git remote add origin <your-remote-url>  # if needed"
echo "   git push origin --force --all"
echo "   git push origin --force --tags"
echo ""
echo "4. Notify all team members to re-clone:"
echo "   rm -rf <repository-name>"
echo "   git clone <repository-url>"
echo ""
echo -e "${YELLOW}Backup branch created: ${BACKUP_BRANCH}${NC}"
echo "If something goes wrong, you can restore from this branch"
echo ""
echo -e "${GREEN}Remember to:${NC}"
echo "  • Rotate any exposed credentials"
echo "  • Audit your cloud resources for suspicious activity"
echo "  • Have all collaborators re-clone the repository"
echo ""
