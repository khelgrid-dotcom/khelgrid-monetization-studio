# KhelGrid Supabase Google Drive Backups

This workflow creates a compressed Supabase database backup every day at 18:30 UTC and uploads it to the Google Drive account used for OAuth (intended: khelgrid@gmail.com).

## GitHub Actions secrets

Add these repository secrets:

- `SUPABASE_DB_URL`: Supabase production database connection string from the Connect panel. Prefer the Session Pooler connection string.
- `GOOGLE_CLIENT_ID`: OAuth 2.0 Web/Desktop client ID.
- `GOOGLE_CLIENT_SECRET`: OAuth 2.0 client secret.
- `GOOGLE_REFRESH_TOKEN`: refresh token generated after authorizing the KhelGrid backup OAuth client with khelgrid@gmail.com.
- `GOOGLE_DRIVE_FOLDER_ID`: ID of the Google Drive folder where backups should be stored.

Never commit any of these values to the repository.

## Google Drive OAuth

Create a Google Cloud project, enable the Google Drive API, create an OAuth 2.0 client, and authorize the account `khelgrid@gmail.com` with Drive access. Store the resulting refresh token only in GitHub Actions Secrets.

Create a folder such as:

`KhelGrid-Supabase-Backups`

Copy its folder ID into `GOOGLE_DRIVE_FOLDER_ID`.

## Backup contents

The workflow creates:

- roles.sql
- schema.sql
- data.sql
- created_at.txt

These are compressed into a dated `.tar.gz` archive.

The workflow excludes Supabase internal vector storage tables that are not needed for a normal database restore. Supabase Storage file objects are not included in the database dump and should be backed up separately if KhelGrid begins storing important user files there.

## Schedule

Daily at 18:30 UTC, which is 00:00 IST.

The workflow can also be started manually from GitHub Actions.

## Retention

Keep the Google Drive folder limited to a sensible retention window, such as the latest 30 daily archives. The current workflow uploads daily backups; automatic deletion/retention can be added after the first successful upload is verified.

## Restore

Keep at least one tested backup before relying on the system for disaster recovery. Restore should be tested against a separate Supabase/Postgres environment before production use.
