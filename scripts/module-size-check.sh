#!/bin/bash
# Module Size Analysis Script
# Run with: bash scripts/module-size-check.sh

echo "📊 PracticeLink Module Size Analysis"
echo "===================================="
echo ""

# Check if src/pages/modules exists
if [ ! -d "src/pages/modules" ]; then
    echo "❌ No modules directory found at src/pages/modules"
    exit 1
fi

total_files=0
total_lines=0

echo "📁 Module Analysis:"
echo "-------------------"

for module in src/pages/modules/*/; do
    if [ -d "$module" ]; then
        module_name=$(basename "$module")
        
        # Count TypeScript/React files
        file_count=$(find "$module" -name "*.tsx" -o -name "*.ts" | wc -l)
        
        # Count lines of code
        if [ $file_count -gt 0 ]; then
            line_count=$(find "$module" -name "*.tsx" -o -name "*.ts" -exec wc -l {} + | tail -1 | awk '{print $1}')
        else
            line_count=0
        fi
        
        # Calculate folder size
        folder_size=$(du -sh "$module" 2>/dev/null | cut -f1)
        
        echo "📦 $module_name:"
        echo "   📄 Files: $file_count"
        echo "   📝 Lines: $line_count"
        echo "   💾 Size: $folder_size"
        
        # Status indicators
        if [ $file_count -gt 100 ]; then
            echo "   🔴 STATUS: Too large - consider extraction"
        elif [ $file_count -gt 50 ]; then
            echo "   🟡 STATUS: Growing large - monitor closely"
        elif [ $file_count -gt 20 ]; then
            echo "   🟢 STATUS: Healthy size"
        else
            echo "   🟢 STATUS: Small module"
        fi
        
        # Add to totals
        total_files=$((total_files + file_count))
        total_lines=$((total_lines + line_count))
        
        echo ""
    fi
done

echo "📊 Summary:"
echo "-----------"
echo "🗂️  Total modules: $(find src/pages/modules -maxdepth 1 -type d | wc -l | awk '{print $1-1}')"
echo "📄 Total files: $total_files"
echo "📝 Total lines: $total_lines"
echo ""

# Overall project health
if [ $total_files -gt 500 ]; then
    echo "🔴 PROJECT STATUS: Very large - consider module extraction strategy"
elif [ $total_files -gt 200 ]; then
    echo "🟡 PROJECT STATUS: Large - monitor module growth"
else
    echo "🟢 PROJECT STATUS: Healthy size"
fi

echo ""
echo "💡 Recommendations:"
echo "-------------------"

# Check for largest modules
largest_module=""
largest_count=0

for module in src/pages/modules/*/; do
    if [ -d "$module" ]; then
        module_name=$(basename "$module")
        file_count=$(find "$module" -name "*.tsx" -o -name "*.ts" | wc -l)
        
        if [ $file_count -gt $largest_count ]; then
            largest_count=$file_count
            largest_module=$module_name
        fi
    fi
done

if [ $largest_count -gt 50 ]; then
    echo "⚠️  Consider extracting '$largest_module' module ($largest_count files)"
fi

if [ $total_files -gt 300 ]; then
    echo "⚠️  Consider implementing code splitting"
    echo "⚠️  Consider extracting largest modules to separate projects"
fi

echo "✅ Run 'npm run build' to check bundle sizes"
echo "✅ Use 'npm run analyze' to see detailed bundle analysis"