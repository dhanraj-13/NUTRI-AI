
# Script to create the complete backend directory structure
$base = "e:\dhanraj\AI productivity agent\backend"

# All required directories
$dirs = @(
    # API - gateway
    "app\api\gateway",
    # API - middleware
    "app\api\middleware",
    # API - v1 - auth
    "app\api\v1\auth\routes",
    "app\api\v1\auth\controllers",
    "app\api\v1\auth\services",
    "app\api\v1\auth\validators",
    "app\api\v1\auth\dependencies",
    "app\api\v1\auth\tokens",
    "app\api\v1\auth\sessions",
    # API - v1 - users
    "app\api\v1\users\routes",
    "app\api\v1\users\controllers",
    "app\api\v1\users\profile",
    "app\api\v1\users\preferences",
    "app\api\v1\users\settings",
    "app\api\v1\users\personalization",
    # API - v1 - nutrition
    "app\api\v1\nutrition\routes",
    "app\api\v1\nutrition\controllers",
    "app\api\v1\nutrition\services",
    "app\api\v1\nutrition\engines\calorie_engine",
    "app\api\v1\nutrition\engines\macro_engine",
    "app\api\v1\nutrition\engines\meal_engine",
    "app\api\v1\nutrition\engines\nutrition_score_engine",
    "app\api\v1\nutrition\engines\hydration_engine",
    "app\api\v1\nutrition\search\semantic_search",
    "app\api\v1\nutrition\search\filter_engine",
    "app\api\v1\nutrition\search\ranking_engine",
    "app\api\v1\nutrition\search\metadata_search",
    "app\api\v1\nutrition\recommendations\meal_recommendation",
    "app\api\v1\nutrition\recommendations\hydration_recommendation",
    "app\api\v1\nutrition\recommendations\focus_foods",
    "app\api\v1\nutrition\recommendations\productivity_foods",
    "app\api\v1\nutrition\validators",
    "app\api\v1\nutrition\schedulers",
    "app\api\v1\nutrition\processors",
    # API - v1 - hydration
    "app\api\v1\hydration\routes",
    "app\api\v1\hydration\controllers",
    "app\api\v1\hydration\hydration_tracking",
    "app\api\v1\hydration\hydration_scoring",
    "app\api\v1\hydration\hydration_alerts",
    "app\api\v1\hydration\hydration_analytics",
    "app\api\v1\hydration\hydration_notifications",
    # API - v1 - analytics
    "app\api\v1\analytics\routes",
    "app\api\v1\analytics\controllers",
    "app\api\v1\analytics\nutrition_analytics",
    "app\api\v1\analytics\productivity_analytics",
    "app\api\v1\analytics\hydration_analytics",
    "app\api\v1\analytics\trend_analysis",
    "app\api\v1\analytics\graph_generation",
    "app\api\v1\analytics\prediction_engine",
    "app\api\v1\analytics\scoring",
    # API - v1 - ai
    "app\api\v1\ai\chat\controllers",
    "app\api\v1\ai\chat\services",
    "app\api\v1\ai\chat\sessions",
    "app\api\v1\ai\chat\prompts",
    "app\api\v1\ai\chat\memory",
    "app\api\v1\ai\recommendations\meal_ai",
    "app\api\v1\ai\recommendations\hydration_ai",
    "app\api\v1\ai\recommendations\productivity_ai",
    "app\api\v1\ai\recommendations\focus_ai",
    "app\api\v1\ai\orchestration\agent_router",
    "app\api\v1\ai\orchestration\workflow_manager",
    "app\api\v1\ai\orchestration\execution_engine",
    "app\api\v1\ai\orchestration\ai_dispatcher",
    "app\api\v1\ai\reasoning\context_reasoner",
    "app\api\v1\ai\reasoning\nutrition_reasoner",
    "app\api\v1\ai\reasoning\productivity_reasoner",
    "app\api\v1\ai\reasoning\decision_engine",
    "app\api\v1\ai\response_generation\response_builder",
    "app\api\v1\ai\response_generation\formatter",
    "app\api\v1\ai\response_generation\validator",
    "app\api\v1\ai\response_generation\parser",
    # API - v1 - websocket
    "app\api\v1\websocket\connections",
    "app\api\v1\websocket\dashboard_sync",
    "app\api\v1\websocket\realtime_events",
    "app\api\v1\websocket\notifications",
    "app\api\v1\websocket\hydration_events",
    "app\api\v1\websocket\nutrition_events",
    "app\api\v1\websocket\analytics_events",
    "app\api\v1\websocket\ai_events",
    # API - v1 - notifications
    "app\api\v1\notifications\email",
    "app\api\v1\notifications\push",
    "app\api\v1\notifications\sms",
    "app\api\v1\notifications\hydration_reminders",
    "app\api\v1\notifications\meal_reminders",
    "app\api\v1\notifications\ai_notifications",
    # API - v1 - admin
    "app\api\v1\admin\datasets",
    "app\api\v1\admin\monitoring",
    "app\api\v1\admin\ai_logs",
    "app\api\v1\admin\analytics_monitor",
    "app\api\v1\admin\user_monitor",
    "app\api\v1\admin\exports",
    "app\api\v1\admin\system_health",
    # Agents - nutrition_agent
    "app\agents\nutrition_agent\core",
    "app\agents\nutrition_agent\prompts",
    "app\agents\nutrition_agent\memory",
    "app\agents\nutrition_agent\tools",
    "app\agents\nutrition_agent\retrieval",
    "app\agents\nutrition_agent\processors",
    "app\agents\nutrition_agent\validators",
    # Agents - productivity_agent
    "app\agents\productivity_agent\core",
    "app\agents\productivity_agent\prompts",
    "app\agents\productivity_agent\memory",
    "app\agents\productivity_agent\reasoning",
    "app\agents\productivity_agent\analytics",
    "app\agents\productivity_agent\optimization",
    # Agents - analytics_agent
    "app\agents\analytics_agent\core",
    "app\agents\analytics_agent\scoring",
    "app\agents\analytics_agent\trends",
    "app\agents\analytics_agent\predictions",
    "app\agents\analytics_agent\insights",
    # Agents - planner_agent
    "app\agents\planner_agent\workflows",
    "app\agents\planner_agent\scheduling",
    "app\agents\planner_agent\planners",
    "app\agents\planner_agent\task_generation",
    "app\agents\planner_agent\optimization",
    # RAG - ingestion
    "app\rag\ingestion\dataset_loader",
    "app\rag\ingestion\csv_processor",
    "app\rag\ingestion\cleaner",
    "app\rag\ingestion\metadata_builder",
    "app\rag\ingestion\ingestion_pipeline",
    # RAG - embeddings
    "app\rag\embeddings\models",
    "app\rag\embeddings\generators",
    "app\rag\embeddings\batching",
    "app\rag\embeddings\optimization",
    "app\rag\embeddings\caching",
    # RAG - vectorstore
    "app\rag\vectorstore\faiss",
    "app\rag\vectorstore\chroma",
    "app\rag\vectorstore\indexing",
    "app\rag\vectorstore\metadata",
    "app\rag\vectorstore\persistence",
    # RAG - chunking
    "app\rag\chunking\semantic_chunking",
    "app\rag\chunking\recursive_chunking",
    "app\rag\chunking\metadata_chunking",
    "app\rag\chunking\nutrition_chunking",
    # RAG - retriever
    "app\rag\retriever\semantic_search",
    "app\rag\retriever\hybrid_search",
    "app\rag\retriever\reranking",
    "app\rag\retriever\metadata_filters",
    "app\rag\retriever\query_expansion",
    # RAG - pipelines
    "app\rag\pipelines\nutrition_pipeline",
    "app\rag\pipelines\hydration_pipeline",
    "app\rag\pipelines\productivity_pipeline",
    "app\rag\pipelines\recommendation_pipeline",
    "app\rag\pipelines\ai_chat_pipeline",
    # RAG - prompts
    "app\rag\prompts\nutrition",
    "app\rag\prompts\hydration",
    "app\rag\prompts\productivity",
    "app\rag\prompts\analytics",
    "app\rag\prompts\system",
    # RAG - memory
    "app\rag\memory\conversation_memory",
    "app\rag\memory\session_memory",
    "app\rag\memory\vector_memory",
    "app\rag\memory\user_memory",
    "app\rag\memory\memory_manager",
    # RAG - evaluation
    "app\rag\evaluation\retrieval_eval",
    "app\rag\evaluation\response_eval",
    "app\rag\evaluation\hallucination_check",
    "app\rag\evaluation\scoring",
    # Websocket (app-level)
    "app\websocket\manager",
    "app\websocket\handlers",
    "app\websocket\channels",
    "app\websocket\realtime_sync",
    "app\websocket\event_dispatch",
    "app\websocket\heartbeat",
    "app\websocket\recovery",
    # Workers (app-level)
    "app\workers\celery",
    "app\workers\queues",
    "app\workers\schedulers",
    "app\workers\analytics_jobs",
    "app\workers\export_jobs",
    "app\workers\ai_jobs",
    "app\workers\cleanup_jobs",
    "app\workers\retry_jobs",
    # Monitoring (app-level)
    "app\monitoring\metrics",
    "app\monitoring\tracing",
    "app\monitoring\observability",
    "app\monitoring\alerts",
    "app\monitoring\healthchecks",
    "app\monitoring\ai_monitoring",
    "app\monitoring\performance",
    # Cache (app-level)
    "app\cache\redis",
    "app\cache\ai_cache",
    "app\cache\analytics_cache",
    "app\cache\nutrition_cache",
    "app\cache\session_cache",
    # Events (app-level)
    "app\events\nutrition",
    "app\events\hydration",
    "app\events\analytics",
    "app\events\websocket",
    "app\events\ai",
    "app\events\notifications",
    # Datasets (app-level)
    "app\datasets\raw",
    "app\datasets\processed",
    "app\datasets\cleaned",
    "app\datasets\embeddings",
    "app\datasets\exports",
    "app\datasets\backups",
    # Storage (app-level)
    "app\storage\images",
    "app\storage\vectors",
    "app\storage\uploads",
    "app\storage\exports",
    "app\storage\backups",
    # Security (app-level)
    "app\security\jwt",
    "app\security\encryption",
    "app\security\rate_limiting",
    "app\security\permissions",
    "app\security\audits",
    # Tests (app-level)
    "app\tests\unit",
    "app\tests\integration",
    "app\tests\websocket",
    "app\tests\ai",
    "app\tests\rag",
    "app\tests\analytics",
    "app\tests\load_testing",
    # Top-level backend dirs
    "docker",
    "nginx",
    "scripts",
    "docs"
)

# Files to create at root backend level
$rootFiles = @(
    "alembic.ini"
)

# Specific .py files
$specificFiles = @(
    "app\api\gateway\api_gateway.py",
    "app\api\gateway\request_router.py",
    "app\api\gateway\response_mapper.py",
    "app\api\gateway\rate_limiter.py",
    "app\api\middleware\auth_middleware.py",
    "app\api\middleware\logging_middleware.py",
    "app\api\middleware\error_middleware.py",
    "app\api\middleware\cors_middleware.py",
    "app\api\middleware\metrics_middleware.py",
    "app\agents\nutrition_agent\core\nutrition_agent.py",
    "app\agents\nutrition_agent\core\reasoning_engine.py",
    "app\agents\nutrition_agent\core\recommendation_engine.py",
    "app\agents\nutrition_agent\core\planner_engine.py"
)

$created = 0
$skipped = 0
$errors = 0

Write-Host "=== Creating Backend Directory Structure ===" -ForegroundColor Cyan
Write-Host ""

# Create directories and __init__.py files
foreach ($dir in $dirs) {
    $fullPath = Join-Path $base $dir
    if (-not (Test-Path $fullPath)) {
        try {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
            Write-Host "[DIR]  Created: $dir" -ForegroundColor Green
            $created++
        } catch {
            Write-Host "[ERR]  Failed to create dir: $dir - $_" -ForegroundColor Red
            $errors++
        }
    } else {
        $skipped++
    }

    # Create __init__.py in Python package dirs (skip storage/datasets/docker/nginx/docs/scripts)
    $skipInit = @("docker","nginx","scripts","docs","app\datasets\raw","app\datasets\processed","app\datasets\cleaned","app\datasets\embeddings","app\datasets\exports","app\datasets\backups","app\storage\images","app\storage\vectors","app\storage\uploads","app\storage\exports","app\storage\backups")
    $shouldSkip = $false
    foreach ($s in $skipInit) {
        if ($dir -eq $s -or $dir.StartsWith($s + "\")) {
            $shouldSkip = $true
            break
        }
    }

    if (-not $shouldSkip) {
        $initFile = Join-Path $fullPath "__init__.py"
        if (-not (Test-Path $initFile)) {
            try {
                $moduleName = Split-Path $dir -Leaf
                $content = "# $moduleName module`n"
                Set-Content -Path $initFile -Value $content -Encoding UTF8
                Write-Host "[FILE] Created: $dir\__init__.py" -ForegroundColor Yellow
                $created++
            } catch {
                Write-Host "[ERR]  Failed to create __init__.py in: $dir - $_" -ForegroundColor Red
                $errors++
            }
        }
    }
}

# Create specific .py files
foreach ($file in $specificFiles) {
    $fullPath = Join-Path $base $file
    if (-not (Test-Path $fullPath)) {
        try {
            $fileName = Split-Path $file -Leaf
            $moduleName = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
            $content = "# $moduleName`n`n"
            Set-Content -Path $fullPath -Value $content -Encoding UTF8
            Write-Host "[FILE] Created: $file" -ForegroundColor Yellow
            $created++
        } catch {
            Write-Host "[ERR]  Failed to create file: $file - $_" -ForegroundColor Red
            $errors++
        }
    } else {
        $skipped++
    }
}

# Create root-level backend files
foreach ($file in $rootFiles) {
    $fullPath = Join-Path $base $file
    if (-not (Test-Path $fullPath)) {
        try {
            $content = ""
            if ($file -eq "alembic.ini") {
                $content = @"
# A generic, single database configuration.

[alembic]
script_location = migrations
prepend_sys_path = .
version_path_separator = os
sqlalchemy.url = sqlite:///./nutrition.db

[post_write_hooks]

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
"@
            }
            Set-Content -Path $fullPath -Value $content -Encoding UTF8
            Write-Host "[FILE] Created: $file" -ForegroundColor Yellow
            $created++
        } catch {
            Write-Host "[ERR]  Failed to create file: $file - $_" -ForegroundColor Red
            $errors++
        }
    } else {
        Write-Host "[SKIP] Already exists: $file" -ForegroundColor Gray
        $skipped++
    }
}

# Create .gitkeep for non-python leaf dirs
$gitkeepDirs = @(
    "app\datasets\raw",
    "app\datasets\processed",
    "app\datasets\cleaned",
    "app\datasets\embeddings",
    "app\datasets\exports",
    "app\datasets\backups",
    "app\storage\images",
    "app\storage\vectors",
    "app\storage\uploads",
    "app\storage\exports",
    "app\storage\backups",
    "docker",
    "nginx",
    "docs"
)
foreach ($dir in $gitkeepDirs) {
    $fullPath = Join-Path $base $dir
    $gitkeep = Join-Path $fullPath ".gitkeep"
    if (-not (Test-Path $gitkeep)) {
        try {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
            Set-Content -Path $gitkeep -Value "" -Encoding UTF8
            Write-Host "[FILE] Created: $dir\.gitkeep" -ForegroundColor Yellow
            $created++
        } catch {
            Write-Host "[ERR]  Failed to create .gitkeep in: $dir - $_" -ForegroundColor Red
            $errors++
        }
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Created : $created items" -ForegroundColor Green
Write-Host "Skipped : $skipped items (already existed)" -ForegroundColor Gray
Write-Host "Errors  : $errors items" -ForegroundColor Red
Write-Host ""
Write-Host "Structure creation complete!" -ForegroundColor Cyan
