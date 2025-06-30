#!/bin/bash

# Script to fix commit attribution for all commits from June 29-30, 2025
# Changes author from "williammillerwo" to "williammillerworks"

git filter-branch --env-filter '
OLD_EMAIL="41694034-williammillerwo@users.noreply.replit.com"
CORRECT_NAME="williammillerworks"
CORRECT_EMAIL="william.miller.works@gmail.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags