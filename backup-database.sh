#!/bin/bash

# ProjeXtPal Database Backup Script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/backups/projextpal"
DB_NAME="projextpal"
DB_USER="postgres"
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
echo "📦 Starting backup: $DATE"
docker-compose exec -T postgres pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Check backup size
BACKUP_SIZE=$(du -h $BACKUP_DIR/backup_$DATE.sql.gz | cut -f1)
echo "✅ Backup complete: $BACKUP_SIZE"

# Remove old backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "🧹 Cleaned old backups (>$RETENTION_DAYS days)"

# Log result
echo "$(date): Backup successful - $BACKUP_SIZE" >> $BACKUP_DIR/backup.log
