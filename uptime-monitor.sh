#!/bin/bash

URL="${1:-http://localhost:8000/api/health/}"
LOG_DIR="$HOME/logs/projextpal"
LOG_FILE="$LOG_DIR/uptime.log"

mkdir -p $LOG_DIR

echo "🔍 Starting uptime monitor for: $URL"
echo "📝 Logging to: $LOG_FILE"

while true; do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [ $RESPONSE -eq 200 ]; then
        echo "$TIMESTAMP - ✅ UP (200)" | tee -a $LOG_FILE
    else
        echo "$TIMESTAMP - ❌ DOWN ($RESPONSE)" | tee -a $LOG_FILE
    fi
    
    sleep 300  # Check every 5 minutes
done
