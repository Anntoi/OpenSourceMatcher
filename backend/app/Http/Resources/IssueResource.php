<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IssueResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'number' => $this->number,
            'title' => $this->title,
            'repository' => $this->repository,
            'url' => $this->url,
            'labels' => $this->labels ?? [],
            'difficulty' => $this->difficulty,
            'created_at' => $this->created_at,
        ];
    }
}
