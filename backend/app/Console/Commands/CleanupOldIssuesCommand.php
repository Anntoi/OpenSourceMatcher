<?php

namespace App\Console\Commands;

use App\Models\Issue;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CleanupOldIssuesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'issues:cleanup {--days=30 : Number of days to keep}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove GitHub issues older than N days to prevent database bloat';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $cutoffDate = Carbon::now()->subDays($days);

        $deleted = Issue::query()
            ->where('updated_at', '<', $cutoffDate)
            ->delete();

        $this->info("Deleted {$deleted} issues older than {$days} days.");
    }
}
