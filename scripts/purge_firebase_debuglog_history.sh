#!/bin/bash

###############################################################################
# Firebase Debug Log History Purge Script
# 
# This script uses git-filter-repo to remove firebase-debug.log files from
# the entire Git history of the repository.
#
# WARNING: This script rewrites Git history and requires a force push.
#          All collaborators will need to re-clone the repository after running.
#
# Prerequisites:
#   - git-filter-repo must be installed: pip install git-filter-repo
#   - All local changes must be committed or stashed
#   - Notify all collaborators before running
#
# Usage:
#   chmod +x scripts/purge_firebase_debuglog_history.sh
#   ./scripts/purge_firebase_debuglog_history.sh
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_section() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

# Check if git-filter-repo is installed
print_section "Checking Prerequisites"

if ! command -v git-filter-repo &> /dev/null; then
    print_error "git-filter-repo is not installed"
    print_info "Install with: pip install git-filter-repo"
    exit 1
fi
print_success "git-filter-repo is installed"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi
print_success "Running in a git repository"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    print_error "You have uncommitted changes"
    print_info "Please commit or stash your changes before running this script"
    exit 1
fi
print_success "No uncommitted changes"

# Warning and confirmation
print_section "⚠️  CRITICAL WARNING ⚠️"
print_warning "This script will:"
print_warning "  1. Rewrite the entire Git history"
print_warning "  2. Remove all firebase-debug.log files from all commits"
print_warning "  3. Require a force push to remote"
print_warning "  4. Require all collaborators to re-clone the repository"
echo ""
print_warning "Before proceeding:"
print_warning "  ✓ Ensure all team members have pushed their changes"
print_warning "  ✓ Notify all collaborators about the upcoming history rewrite"
print_warning "  ✓ Have revoked/rotated any exposed credentials"
print_warning "  ✓ Have a backup of the repository (optional but recommended)"
echo ""

read -p "Are you sure you want to continue? (type 'yes' to proceed): " confirmation

if [ "$confirmation" != "yes" ]; then
    print_info "Operation cancelled"
    exit 0
fi

# Create a backup reference
print_section "Creating Backup"
BACKUP_BRANCH="backup-before-filter-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
print_success "Created backup branch: $BACKUP_BRANCH"
print_info "You can restore from this branch if needed"

# Show files to be removed
print_section "Files to be Removed"
echo "Searching for firebase-debug.log files in history..."
git log --all --full-history --pretty=format:"%h %ad | %s" --date=short -- '*firebase-debug.log' | head -20
echo ""

if [ -z "$(git log --all --full-history --oneline -- '*firebase-debug.log')" ]; then
    print_warning "No firebase-debug.log files found in history"
    print_info "The files may have already been removed, or never existed"
    read -p "Continue anyway? (yes/no): " continue_anyway
    if [ "$continue_anyway" != "yes" ]; then
        print_info "Operation cancelled"
        exit 0
    fi
fi

# Run git-filter-repo
print_section "Purging History"
print_info "Running git-filter-repo to remove firebase-debug.log files..."
print_warning "This may take a while for large repositories..."

git-filter-repo \
    --path 'firebase-debug.log' \
    --path 'firebase-debug.*.log' \
    --invert-paths \
    --force

print_success "History rewrite complete!"

# Clean up
print_section "Cleaning Up"
print_info "Running garbage collection..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive
print_success "Cleanup complete"

# Verification
print_section "Verification"
print_info "Verifying removal..."

if git log --all --full-history --oneline -- '*firebase-debug.log' | grep -q .; then
    print_error "WARNING: firebase-debug.log files may still exist in history"
    print_info "Manual verification needed"
else
    print_success "No firebase-debug.log files found in history - SUCCESS!"
fi

# Final instructions
print_section "Next Steps"
print_warning "IMPORTANT: You must now force push to update the remote repository"
echo ""
print_info "Commands to run:"
echo ""
echo "  # Push all branches (force)"
echo "  git push origin --force --all"
echo ""
echo "  # Push all tags (force)"
echo "  git push origin --force --tags"
echo ""
print_warning "After force pushing:"
print_warning "  1. All collaborators MUST re-clone the repository"
print_warning "  2. DO NOT merge old branches - they contain the old history"
print_warning "  3. Verify the changes worked by checking the repository online"
echo ""
print_info "Collaborators should run:"
echo ""
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
echo "  cd .."
echo "  rm -rf $REPO_NAME"
echo "  git clone <repository-url>"
echo ""
print_success "Script completed successfully!"
print_info "Backup branch available: $BACKUP_BRANCH"
echo ""
