# Backend Documentation - Document Approval System

## Tech Stack

- **Backend**: Laravel 12
- **PHP**: 8.2
- **Database**: PostgreSQL 14+
- **Authentication**: Laravel Sanctum
- **Authorization**: Spatie Permission
- **File Upload**: Laravel Flysystem + Validation
- **Charts**: Chart.js (API endpoints)
- **Export**: Laravel Excel + DomPDF
- **Cache**: Redis
- **Queue**: Redis + Laravel Horizon
- **Testing**: Pest PHP / PHPUnit
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

---

## Project Structure

```
laravel-document-approval/
├── app/
│   ├── Actions/
│   │   ├── CreateProject.php
│   │   ├── UpdateProject.php
│   │   ├── SubmitProject.php
│   │   ├── ApproveProject.php
│   │   ├── RejectProject.php
│   │   ├── RequestRevision.php
│   │   └── UploadDocument.php
│   ├── Enums/
│   │   ├── ProjectStatus.php
│   │   ├── ProjectCategory.php
│   │   └── ReviewNoteType.php
│   ├── Exceptions/
│   │   └── Handler.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── V1/
│   │   │   │   │   ├── AuthController.php
│   │   │   │   │   ├── ProjectController.php
│   │   │   │   │   ├── DocumentController.php
│   │   │   │   │   ├── ReviewController.php
│   │   │   │   │   ├── DashboardController.php
│   │   │   │   │   ├── ExportController.php
│   │   │   │   │   └── StatisticsController.php
│   │   │   │   └── Controller.php
│   │   ├── Middleware/
│   │   │   ├── SanctumMiddleware.php
│   │   │   ├── RoleMiddleware.php
│   │   │   └── ValidateJsonPayload.php
│   │   ├── Requests/
│   │   │   ├── CreateProjectRequest.php
│   │   │   ├── UpdateProjectRequest.php
│   │   │   ├── SubmitProjectRequest.php
│   │   │   ├── ReviewProjectRequest.php
│   │   │   └── UploadDocumentRequest.php
│   │   └── Resources/
│   │       ├── ProjectResource.php
│   │       ├── ProjectListResource.php
│   │       ├── DocumentResource.php
│   │       ├── ReviewNoteResource.php
│   │       └── UserResource.php
│   ├── Jobs/
│   │   ├── ProcessDocumentUpload.php
│   │   ├── SendNotificationEmail.php
│   │   └── GenerateReport.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Project.php
│   │   ├── Document.php
│   │   ├── ReviewNote.php
│   │   ├── ActivityLog.php
│   │   └── Notification.php
│   ├── Policies/
│   │   ├── ProjectPolicy.php
│   │   └── DocumentPolicy.php
│   ├── Repositories/
│   │   ├── ProjectRepository.php
│   │   ├── DocumentRepository.php
│   │   └── ReviewRepository.php
│   ├── Services/
│   │   ├── ProjectService.php
│   │   ├── DocumentService.php
│   │   ├── ReviewService.php
│   │   ├── DashboardService.php
│   │   ├── ExportService.php
│   │   └── NotificationService.php
│   └── Traits/
│       ├── HasRoles.php
│       └── HasPermissions.php
├── bootstrap/
│   └── app.php
├── config/
│   ├── sanctum.php
│   ├── permission.php
│   ├── queue.php
│   ├── horizon.php
│   └── cache.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   │   ├── UserSeeder.php
│   │   └── PermissionSeeder.php
│   └── factories/
│       ├── UserFactory.php
│       ├── ProjectFactory.php
│       └── DocumentFactory.php
├── public/
│   └── storage/
├── resources/
│   └── views/
├── routes/
│   ├── api.php
│   └── channels.php
├── storage/
│   └── app/
│       ├── documents/
│       └── public/
├── tests/
│   ├── Unit/
│   │   ├── ProjectTest.php
│   │   ├── DocumentTest.php
│   │   └── ReviewTest.php
│   └── Feature/
│       ├── AuthTest.php
│       ├── ProjectWorkflowTest.php
│       └── DocumentUploadTest.php
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── Dockerfile
├── docker-compose.yml
├── compose.yaml
├── phpunit.xml
└── pest.php
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nip VARCHAR(50) NULL,
    phone VARCHAR(20) NULL,
    department VARCHAR(255) NULL,
    position VARCHAR(255) NULL,
    bio TEXT NULL,
    avatar VARCHAR(500) NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

### Projects Table
```sql
CREATE TABLE projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status ENUM('draft', 'submitted', 'revision', 'approved', 'rejected') 
        DEFAULT 'draft',
    submitted_at TIMESTAMP NULL,
    reviewed_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_submitted_at (submitted_at)
);
```

### Documents Table
```sql
CREATE TABLE documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    file_size BIGINT UNSIGNED NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_file_type (file_type)
);
```

### Review Notes Table
```sql
CREATE TABLE review_notes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    reviewer_id BIGINT UNSIGNED NOT NULL,
    reviewer_name VARCHAR(255) NOT NULL,
    note TEXT NOT NULL,
    type ENUM('info', 'revision', 'approval', 'rejection') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_project_id (project_id),
    INDEX idx_reviewer_id (reviewer_id),
    INDEX idx_type (type)
);
```

### Activity Logs Table
```sql
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_project_id (project_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    project_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/logout` | Logout user | Yes |
| POST | `/api/v1/auth/forgot-password` | Forgot password | No |
| POST | `/api/v1/auth/reset-password` | Reset password | No |
| GET | `/api/v1/auth/me` | Get current user | Yes |

### Projects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/projects` | List user projects | Yes |
| GET | `/api/v1/projects/{id}` | Get project detail | Yes |
| POST | `/api/v1/projects` | Create project | Yes |
| PUT | `/api/v1/projects/{id}` | Update draft project | Yes |
| DELETE | `/api/v1/projects/{id}` | Delete draft project | Yes |
| POST | `/api/v1/projects/{id}/submit` | Submit for review | Yes |

### Documents

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/projects/{id}/documents` | Upload document | Yes |
| GET | `/api/v1/projects/{id}/documents` | List documents | Yes |
| GET | `/api/v1/documents/{id}/download` | Download document | Yes |
| DELETE | `/api/v1/documents/{id}` | Delete document | Yes |

### Review (Reviewer Only)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/reviewer/projects` | List submitted projects | Yes |
| GET | `/api/v1/reviewer/projects/{id}` | Get project for review | Yes |
| POST | `/api/v1/reviewer/projects/{id}/approve` | Approve project | Yes |
| POST | `/api/v1/reviewer/projects/{id}/reject` | Reject project | Yes |
| POST | `/api/v1/reviewer/projects/{id}/request-revision` | Request revision | Yes |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/dashboard/stats` | Get dashboard statistics | Yes |
| GET | `/api/v1/dashboard/recent-activities` | Get recent activities | Yes |
| GET | `/api/v1/dashboard/charts/status-distribution` | Status chart data | Yes |
| GET | `/api/v1/dashboard/charts/monthly-submissions` | Monthly submissions | Yes |

### Export

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/export/projects/excel` | Export projects to Excel | Yes |
| GET | `/api/v1/export/projects/pdf` | Export project to PDF | Yes |

### Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/profile` | Get profile | Yes |
| PUT | `/api/v1/profile` | Update profile | Yes |
| POST | `/api/v1/profile/avatar` | Upload avatar | Yes |
| PUT | `/api/v1/profile/password` | Change password | Yes |

### Notifications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/notifications` | List user notifications | Yes |
| GET | `/api/v1/notifications/stats` | Get notification stats | Yes |
| PUT | `/api/v1/notifications/{id}/read` | Mark as read | Yes |
| PUT | `/api/v1/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/api/v1/notifications/{id}` | Delete notification | Yes |

---

## Implementation Steps

### 1. Project Setup

```bash
# Create new Laravel project
composer create-project laravel/laravel backend
cd backend

# Install required packages
composer require laravel/sanctum
composer require spatie/laravel-permission
composer require maatwebsite/excel
composer require barryvdh/laravel-dompdf
composer require predis/predis
composer require laravel/horizon

# Install development packages
composer require --dev larastan/larastan
composer require --dev pestphp/pest
composer require --dev pestphp/pest-plugin-laravel
```

### 2. Environment Configuration

```env
# .env
APP_NAME="Document Approval API"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=document_approval
DB_USERNAME=postgres
DB_PASSWORD=

BROADCAST_CONNECTION=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=public
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

SANCTUM_STATEFUL_DOMAINS=127.0.0.1:8000
SANCTUM_TOKEN_EXPIRATION=60

LOG_CHANNEL=daily
LOG_LEVEL=debug

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Email configuration for notifications
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@document.app"
MAIL_FROM_NAME="${APP_NAME}"
```

### 3. Authentication Setup (Sanctum)

```php
// config/sanctum.php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,127.0.0.1',
        env('APP_URL') ? parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),
    'guard' => ['web'],
    'expiration' => null,
    'token_prefix' => '',
];
```

```php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    });
});
```

### 4. Role & Permission Setup

```php
// Database/seeders/PermissionSeeder.php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $applicant = Role::create(['name' => 'applicant']);
        $reviewer = Role::create(['name' => 'reviewer']);
        $admin = Role::create(['name' => 'admin']);

        // Create permissions
        $permissions = [
            'create projects',
            'edit own projects',
            'delete own projects',
            'submit projects',
            'view own projects',
            'review projects',
            'approve projects',
            'reject projects',
            'request revision',
            'view all projects',
            'manage users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign permissions to roles
        $applicant->givePermissionTo([
            'create projects',
            'edit own projects',
            'delete own projects',
            'submit projects',
            'view own projects',
        ]);

        $reviewer->givePermissionTo([
            'review projects',
            'approve projects',
            'reject projects',
            'request revision',
            'view all projects',
        ]);

        $admin->givePermissionTo(Permission::all());
    }
}
```

### 5. File Upload Implementation

```php
// app/Http/Requests/UploadDocumentRequest.php
class UploadDocumentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'document' => [
                'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:10240', // 10MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'document.required' => 'Please select a file to upload.',
            'document.mimes' => 'Only PDF, DOC, and DOCX files are allowed.',
            'document.max' => 'File size must not exceed 10MB.',
        ];
    }
}

// app/Actions/UploadDocument.php
class UploadDocument
{
    public function execute(User $user, Project $project, UploadedFile $file): Document
    {
        // Validate file
        $this->validateFile($file);

        // Store file
        $path = $file->store('documents/' . $project->id, 'public');

        // Create document record
        $document = Document::create([
            'project_id' => $project->id,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
            'file_path' => $path,
        ]);

        // Log activity
        ActivityLog::create([
            'user_id' => $user->id,
            'project_id' => $project->id,
            'action' => 'document_uploaded',
            'description' => "Uploaded document: {$file->getClientOriginalName()}",
        ]);

        return $document;
    }

    private function validateFile(UploadedFile $file): void
    {
        $allowedTypes = ['pdf', 'doc', 'docx'];
        $maxSize = 10 * 1024 * 1024; // 10MB

        if (!in_array($file->getClientOriginalExtension(), $allowedTypes)) {
            throw new \InvalidArgumentException('Invalid file type.');
        }

        if ($file->getSize() > $maxSize) {
            throw new \InvalidArgumentException('File size exceeds 10MB limit.');
        }
    }
}
```

### 6. Queue Implementation

```php
// app/Jobs/ProcessDocumentUpload.php
use Illuminate\Bus\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessDocumentUpload implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public $tries = 3;
    public $timeout = 120;

    public function __construct(
        public User $user,
        public Project $project,
        public string $filePath
    ) {}

    public function handle(): void
    {
        try {
            // Process document (virus scan, OCR, etc.)
            $this->processDocument();

            // Notify user
            dispatch(new SendNotificationEmail(
                $this->user,
                'Document Upload Completed',
                "Your document has been successfully processed."
            ));
        } catch (\Exception $e) {
            $this->release(30);
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Document upload failed', [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
```

### 7. Cache Implementation

```php
// app/Services/ProjectService.php
use Illuminate\Support\Facades\Cache;

class ProjectService
{
    public function getDashboardStats(User $user): array
    {
        $cacheKey = "dashboard_stats_{$user->id}";
        
        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user) {
            return [
                'total' => $user->projects()->count(),
                'draft' => $user->projects()->where('status', 'draft')->count(),
                'submitted' => $user->projects()->where('status', 'submitted')->count(),
                'revision' => $user->projects()->where('status', 'revision')->count(),
                'approved' => $user->projects()->where('status', 'approved')->count(),
                'rejected' => $user->projects()->where('status', 'rejected')->count(),
            ];
        });
    }

    public function updateProject(Project $project, array $data): Project
    {
        $project->update($data);
        
        // Clear cache
        Cache::forget("project_{$project->id}");
        Cache::forget("dashboard_stats_{$project->user_id}");
        Cache::forget("projects_list_{$project->user_id}");
        
        return $project->fresh();
    }
}
```

### 8. Export Implementation

```php
// app/Http/Controllers/Api/V1/ExportController.php
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProjectsExport;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportController extends Controller
{
    public function exportProjectsExcel(Request $request)
    {
        $user = $request->user();
        
        abort_unless($user->can('view all projects'), 403);
        
        $projects = Project::with(['user', 'documents'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->get();
        
        return Excel::download(new ProjectsExport($projects), 'projects.xlsx');
    }

    public function exportProjectPdf(Project $project)
    {
        $this->authorize('view', $project);
        
        $pdf = PDF::loadView('exports.project-pdf', [
            'project' => $project->load('user', 'documents', 'reviewNotes'),
        ]);
        
        return $pdf->download("project-{$project->id}.pdf");
    }
}
```

### 9. Dashboard Charts API

```php
// app/Http/Controllers/Api/V1/DashboardController.php
class DashboardController extends Controller
{
    public function getStatusDistribution(Request $request)
    {
        $user = $request->user();
        
        $stats = DB::table('projects')
            ->when(!$user->hasRole('admin'), fn($q) => $q->where('user_id', $user->id))
            ->selectRaw('
                status,
                COUNT(*) as count
            ')
            ->groupBy('status')
            ->get();
        
        return response()->json([
            'data' => $stats->map(fn($stat) => [
                'status' => $stat->status,
                'count' => $stat->count,
                'percentage' => $stat->count / $stats->sum('count') * 100,
            ]),
        ]);
    }

    public function getMonthlySubmissions(Request $request)
    {
        $user = $request->user();
        
        $submissions = DB::table('projects')
            ->when(!$user->hasRole('admin'), fn($q) => $q->where('user_id', $user->id))
            ->selectRaw('
                DATE_FORMAT(submitted_at, "%Y-%m") as month,
                COUNT(*) as count
            ')
            ->whereNotNull('submitted_at')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->limit(12)
            ->get();
        
        return response()->json([
            'data' => $submissions,
        ]);
    }
}
```

### 10. Notification Implementation

#### Notification Model

```php
// app/Models/Notification.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'title',
        'message',
        'category',
        'type',
        'is_read',
        'data',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'data' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    public function markAsRead(): bool
    {
        return $this->update(['is_read' => true]);
    }
}
```

#### Notification Service

```php
// app/Services/NotificationService.php
namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Jobs\SendNotificationEmail;

class NotificationService
{
    public function create(array $data): Notification
    {
        $notification = Notification::create($data);

        // Dispatch email job if needed
        if (config('notifications.email.enabled')) {
            dispatch(new SendNotificationEmail($notification));
        }

        return $notification;
    }

    public function getUserNotifications(User $user, int $perPage = 20)
    {
        return Notification::query()
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getUnreadCount(User $user): int
    {
        return Notification::query()
            ->where('user_id', $user->id)
            ->where('is_read', false)
            ->count();
    }

    public function getStats(User $user): array
    {
        $total = Notification::where('user_id', $user->id)->count();
        $unread = $this->getUnreadCount($user);
        $read = $total - $unread;

        return [
            'total' => $total,
            'unread' => $unread,
            'read' => $read,
        ];
    }

    public function markAsRead(int $notificationId): ?Notification
    {
        $notification = Notification::find($notificationId);

        if ($notification && !$notification->is_read) {
            $notification->markAsRead();
        }

        return $notification;
    }

    public function markAllAsRead(User $user): void
    {
        Notification::query()
            ->where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    public function delete(int $notificationId): bool
    {
        return Notification::where('id', $notificationId)->delete() > 0;
    }

    // Notification type helpers
    public function notifySubmissionSuccess(User $user, int $projectId, string $projectName): Notification
    {
        return $this->create([
            'user_id' => $user->id,
            'project_id' => $projectId,
            'title' => 'Application Submitted Successfully',
            'message' => "Your project \"{$projectName}\" has been submitted for review.",
            'category' => 'submission_success',
            'type' => 'success',
            'data' => [
                'project_id' => $projectId,
                'project_name' => $projectName,
            ],
        ]);
    }

    public function notifyRevisionRequested(User $user, int $projectId, string $projectName): Notification
    {
        return $this->create([
            'user_id' => $user->id,
            'project_id' => $projectId,
            'title' => 'Revision Requested',
            'message' => "Your project \"{$projectName}\" requires revisions. Please review the notes.",
            'category' => 'revision_requested',
            'type' => 'warning',
            'data' => [
                'project_id' => $projectId,
                'project_name' => $projectName,
            ],
        ]);
    }

    public function notifyApproved(User $user, int $projectId, string $projectName): Notification
    {
        return $this->create([
            'user_id' => $user->id,
            'project_id' => $projectId,
            'title' => 'Application Approved',
            'message' => "Congratulations! Your project \"{$projectName}\" has been approved.",
            'category' => 'application_approved',
            'type' => 'success',
            'data' => [
                'project_id' => $projectId,
                'project_name' => $projectName,
            ],
        ]);
    }

    public function notifyRejected(User $user, int $projectId, string $projectName): Notification
    {
        return $this->create([
            'user_id' => $user->id,
            'project_id' => $projectId,
            'title' => 'Application Rejected',
            'message' => "Your project \"{$projectName}\" has been rejected. Please create a new application.",
            'category' => 'application_rejected',
            'type' => 'error',
            'data' => [
                'project_id' => $projectId,
                'project_name' => $projectName,
            ],
        ]);
    }

    public function notifyNewSubmission(User $reviewer, int $projectId, string $projectName, string $applicantName): Notification
    {
        return $this->create([
            'user_id' => $reviewer->id,
            'project_id' => $projectId,
            'title' => 'New Submission',
            'message' => "New project \"{$projectName}\" from {$applicantName} is awaiting your review.",
            'category' => 'new_submission',
            'type' => 'info',
            'data' => [
                'project_id' => $projectId,
                'project_name' => $projectName,
                'applicant_name' => $applicantName,
            ],
        ]);
    }

    public function notifyResubmission(User $reviewer, int $projectId, string $projectName): Notification
    {
        return $this->create([
            'user_id' => $reviewer->id,
            'project_id' => $projectId,
            'title' => 'Application Resubmitted',
            'message' => "Revised project \"{$projectName}\" has been resubmitted for review.",
            'category' => 'resubmission',
            'type' => 'info',
            'data' => [
                'project_id' => $projectId,
                'project_name' => $projectName,
            ],
        ]);
    }
}
```

#### Notification Controller

```php
// app/Http/Controllers/Api/V1/NotificationController.php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $notifications = $this->notificationService->getUserNotifications(
            $request->user(),
            $perPage
        );

        return response()->json([
            'data' => $notifications->items(),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
                'last_page' => $notifications->lastPage(),
            ],
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $stats = $this->notificationService->getStats($request->user());

        return response()->json([
            'data' => $stats,
        ]);
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notification = $this->notificationService->markAsRead($id);

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found',
            ], 404);
        }

        return response()->json([
            'data' => $notification,
            'message' => 'Notification marked as read',
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead($request->user());

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $deleted = $this->notificationService->delete($id);

        if (!$deleted) {
            return response()->json([
                'message' => 'Notification not found',
            ], 404);
        }

        return response()->json([
            'message' => 'Notification deleted successfully',
        ]);
    }
}
```

#### Notification Routes

```php
// routes/api.php - Add to protected routes
Route::middleware('auth:sanctum')->group(function () {
    // ... other routes

    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/stats', [NotificationController::class, 'stats']);
        Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
    });
});
```

#### Notification Job (Email)

```php
// app/Jobs/SendNotificationEmail.php
namespace App\Jobs;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;

class SendNotificationEmail implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Notification $notification
    ) {}

    public function handle(): void
    {
        $user = $this->notification->user;

        Mail::to($user->email)->send(new \App\Mail\NotificationMail(
            $this->notification
        ));
    }
}
```

#### Notification Mailable

```php
// app/Mail/NotificationMail.php
namespace App\Mail;

use App\Models\Notification;
use Illuminate\Mail\Mailable;

class NotificationMail extends Mailable
{
    public function __construct(
        public Notification $notification
    ) {}

    public function build(): self
    {
        return $this
            ->subject($this->notification->title)
            ->view('emails.notification')
            ->with([
                'notification' => $this->notification,
                'user' => $this->notification->user,
            ]);
    }
}
```

### 11. Testing Implementation

```php
// tests/Feature/ProjectWorkflowTest.php
use Tests\TestCase;
use App\Models\User;
use App\Models\Project;

class ProjectWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_applicant_can_create_project(): void
    {
        $applicant = User::factory()->applicant()->create();
        
        $response = $this->actingAs($applicant, 'sanctum')
            ->postJson('/api/v1/projects', [
                'title' => 'Test Project',
                'description' => 'Test Description',
                'category' => 'permohonan',
            ]);
        
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'status',
                ]
            ]);
        
        $this->assertDatabaseHas('projects', [
            'title' => 'Test Project',
            'status' => 'draft',
        ]);
    }

    public function test_applicant_can_submit_project(): void
    {
        $applicant = User::factory()->applicant()->create();
        $project = Project::factory()->for($applicant)->create([
            'status' => 'draft'
        ]);
        
        $response = $this->actingAs($applicant, 'sanctum')
            ->postJson("/api/v1/projects/{$project->id}/submit");
        
        $response->assertStatus(200);
        
        $this->assertEquals('submitted', $project->fresh()->status);
    }

    public function test_reviewer_can_approve_project(): void
    {
        $reviewer = User::factory()->reviewer()->create();
        $project = Project::factory()->create([
            'status' => 'submitted'
        ]);
        
        $response = $this->actingAs($reviewer, 'sanctum')
            ->postJson("/api/v1/reviewer/projects/{$project->id}/approve", [
                'note' => 'Approved',
            ]);
        
        $response->assertStatus(200);
        
        $this->assertEquals('approved', $project->fresh()->status);
    }
}
```

### 12. Docker Configuration

```dockerfile
# Dockerfile
FROM php:8.2-fpm as base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

EXPOSE 9000
CMD ["php-fpm"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: document-api
    restart: unless-stopped
    working_dir: /var/www/html
    volumes:
      - ./:/var/www/html
    networks:
      - document-network
    depends_on:
      - db
      - redis

  nginx:
    image: nginx:alpine
    container_name: document-nginx
    restart: unless-stopped
    ports:
      - "8000:80"
    volumes:
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    networks:
      - document-network
    depends_on:
      - app

  db:
    image: postgres:15-alpine
    container_name: document-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_DATABASE}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - document-network

  redis:
    image: redis:7-alpine
    container_name: document-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - document-network

  horizon:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: document-horizon
    restart: unless-stopped
    command: php artisan horizon
    volumes:
      - ./:/var/www/html
    networks:
      - document-network
    depends_on:
      - redis

networks:
  document-network:
    driver: bridge

volumes:
  db_data:
  redis_data:
```

### 13. CI/CD Configuration

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: pdo, pdo_pgsql, redis, mbstring, zip
          coverage: none

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Copy environment file
        run: cp .env.example .env

      - name: Run migrations
        run: php artisan migrate --force

      - name: Run tests
        run: ./vendor/bin/pest --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/document-api
            git pull origin main
            composer install --no-dev --optimize-autoloader
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan horizon:terminate
```

---

## Migration Command

```bash
# Run all migrations
php artisan migrate

# Run specific migration
php artisan migrate --path=database/migrations/2024_01_01_create_projects_table

# Rollback migration
php artisan migrate:rollback

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

---

## Seeding Command

```bash
# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=PermissionSeeder

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

---

## Queue Commands

```bash
# Run queue worker
php artisan queue:work

# Run queue in production with monitoring
php artisan queue:work --daemon --tries=3 --timeout=120

# Start Horizon dashboard
php artisan horizon

# Publish Horizon assets
php artisan horizon:publish
```

---

## Cache Commands

```bash
# Clear application cache
php artisan cache:clear

# Clear configuration cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Clear view cache
php artisan view:clear

# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache
```

---

## Testing Commands

```bash
# Run all tests
./vendor/bin/pest

# Run unit tests only
./vendor/bin/pest --tests/unit

# Run feature tests only
./vendor/bin/pest --tests/feature

# Run specific test
./vendor/bin/pest --tests/Feature/ProjectWorkflowTest.php

# Run with coverage
./vendor/bin/pest --coverage

# Generate coverage report
./vendor/bin/pest --coverage --html
```

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Project Title",
    "status": "submitted"
  },
  "message": "Project created successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "errors": {
      "title": [
        "The title field is required."
      ]
    }
  }
}
```

---

## Security Considerations

1. **SQL Injection Prevention**: Use Eloquent ORM and parameterized queries
2. **XSS Prevention**: Sanitize all user input and use Laravel's escaping
3. **CSRF Protection**: Enable CSRF for state-changing operations
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **File Upload Security**: Validate file types, scan for malware, store outside webroot
6. **Authentication**: Use Sanctum tokens with proper expiration
7. **Authorization**: Check permissions for every action
8. **Sensitive Data**: Encrypt passwords, never log sensitive information

---

## Performance Optimization

1. **Eager Loading**: Load relationships to prevent N+1 queries
2. **Query Caching**: Cache frequently accessed data
3. **Database Indexing**: Add indexes on frequently queried columns
4. **Pagination**: Use pagination for large datasets
5. **Queue**: Offload time-consuming tasks to background jobs
6. **CDN**: Serve static assets via CDN
7. **Compression**: Enable gzip compression
8. **Connection Pooling**: Use database connection pooling

---

## Monitoring & Logging

1. **Laravel Telescope**: Debug and monitor requests
2. **Laravel Horizon**: Monitor queue jobs
3. **Error Tracking**: Use Bugsnag or Sentry
4. **Performance Monitoring**: Use New Relic or Blackfire
5. **Log Management**: Use ELK stack or Papertrail

---

## Deployment Checklist

- [ ] Set environment variables
- [ ] Configure database connection
- [ ] Set up Redis for cache and queues
- [ ] Configure file storage (S3 or local)
- [ ] Set up supervisor for queue workers
- [ ] Configure SSL certificate
- [ ] Set up backup strategy
- [ ] Configure monitoring
- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Cache configuration and routes
- [ ] Test all API endpoints
- [ ] Set up CI/CD pipeline
- [ ] Configure firewall rules
- [ ] Set up log rotation

---

## Frontend Integration Notes

### API Base URL Configuration

Update frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Axios Configuration

```javascript
// src/services/api/http.ts
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default http
```

---

## Frontend-Backend Contract

### Project Resource
```json
{
  "id": "string",
  "user_id": "string",
  "title": "string",
  "description": "string",
  "category": "permohonan|pengajuan|permintaan|lainnya",
  "status": "draft|submitted|revision|approved|rejected",
  "submitted_at": "ISO8601 string",
  "reviewed_at": "ISO8601 string",
  "approved_at": "ISO8601 string",
  "rejected_at": "ISO8601 string",
  "created_at": "ISO8601 string",
  "updated_at": "ISO8601 string",
  "documents": [
    {
      "id": "string",
      "file_name": "string",
      "file_type": "pdf|doc|docx",
      "file_size": "number",
      "uploaded_at": "ISO8601 string",
      "download_url": "string"
    }
  ],
  "review_notes": [
    {
      "id": "string",
      "reviewer_id": "string",
      "reviewer_name": "string",
      "note": "string",
      "type": "info|revision|approval|rejection",
      "created_at": "ISO8601 string"
    }
  ]
}
```

### User Resource
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "nip": "string",
  "phone": "string",
  "role": "applicant|reviewer|admin",
  "avatar": "string",
  "department": "string",
  "position": "string",
  "bio": "string",
  "created_at": "ISO8601 string",
  "updated_at": "ISO8601 string"
}
```

---

## Quick Start Backend Development

```bash
# Clone repository
git clone <repository-url>
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create symbolic link for storage
php artisan storage:link

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start development server
php artisan serve

# In another terminal, start queue worker
php artisan queue:work

# Start Horizon (optional)
php artisan horizon
```

---

## Docker Quick Start

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec app php artisan migrate

# Seed database
docker-compose exec app php artisan db:seed

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

---

Dokumentasi ini mencakup semua aspek backend yang diperlukan sesuai dengan frontend yang sudah dibuat. Silakan implementasikan langkah demi langkah untuk membuat backend yang sesuai dengan spesifikasi.
