#!/bin/bash

BACKUP_DIR="$HOME/backups/projextpal"

echo "Available backups:"
ls -lh $BACKUP_DIR/backup_*.sql.gz

read -p "Enter backup filename to restore: " BACKUP_FILE

if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "⚠️  WARNING: This will overwrite the current database!"
    read -p "Are you sure? (yes/no) " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo "🔄 Restoring database..."
        gunzip -c $BACKUP_DIR/$BACKUP_FILE | docker-compose exec -T postgres psql -U postgres -d projextpal
        echo "✅ Restore complete!"
    else
        echo "❌ Restore cancelled"
    fi
else
    echo "❌ Backup file not found: $BACKUP_FILE"
fi
