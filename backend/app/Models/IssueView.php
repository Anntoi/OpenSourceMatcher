<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IssueView extends Model
{
    protected $fillable = [
        'user_id',
        'issue_number',
        'title',
        'repository',
        'url',
        'labels',
        'difficulty',
        'viewed_at',
    ];

    protected function casts(): array
    {
        return [
            'labels' => 'array',
            'viewed_at' => 'datetime',
        ];
    }

    public $timestamps = false;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
