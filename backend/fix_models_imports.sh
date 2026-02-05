#!/bin/bash

echo "🔧 Fixing django.db.models imports across all methodologies"
echo "============================================================"

FIXED=0

# Fix waterfall/views.py - add Max to existing import
if grep -q "from django.db.models import Sum, Count, Q" waterfall/views.py; then
    echo "📝 Fixing waterfall/views.py..."
    sed -i.bak 's/from django.db.models import Sum, Count, Q/from django.db.models import Sum, Count, Q, Max, Min, Avg/' waterfall/views.py
    rm waterfall/views.py.bak 2>/dev/null
    FIXED=$((FIXED + 1))
    echo "   ✅ Added Max, Min, Avg to imports"
fi

# Check all other views.py files for similar issues
for views_file in agile/views.py kanban/views.py prince2/views.py scrum/views.py; do
    if [ -f "$views_file" ]; then
        # Check if file uses aggregate functions but doesn't import them
        if grep -q "\.aggregate\|\.annotate" "$views_file"; then
            if ! grep -q "from django.db.models import.*Max\|Min\|Avg\|Sum\|Count" "$views_file"; then
                echo "📝 Fixing $views_file..."
                # Add comprehensive import after first django import
                sed -i.bak '/^from django/a\
from django.db.models import Sum, Count, Avg, Max, Min, Q
' "$views_file"
                rm "${views_file}.bak" 2>/dev/null
                FIXED=$((FIXED + 1))
                echo "   ✅ Added models imports to $views_file"
            fi
        fi
    fi
done

echo ""
echo "============================================================"
echo "✅ Fixed $FIXED file(s)"

