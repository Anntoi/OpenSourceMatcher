<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Issue extends Model
{
    protected $fillable = [
        'number',
        'title',
        'repository',
        'url',
        'labels',
        'difficulty',
    ];

    protected function casts(): array
    {
        return [
            'labels' => 'array',
        ];
    }
}
