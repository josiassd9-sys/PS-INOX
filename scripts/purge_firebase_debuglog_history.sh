#!/bin/bash

# WARNING: This script will rewrite history. Use with caution!

# Use git-filter-repo to remove firebase-debug.log from history
git filter-repo --path firebase-debug.log --invert-paths

# Alternatively, use BFG if you prefer:
# bfg --delete-files firebase-debug.log

# IMPORTANT: Push your changes with force after running this script
# Example: git push origin --force