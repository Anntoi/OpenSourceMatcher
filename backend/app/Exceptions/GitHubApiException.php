<?php

namespace App\Exceptions;

use Exception;

class GitHubApiException extends Exception
{
    public function __construct(
        string $message,
        private readonly int $statusCode = 502,
    ) {
        parent::__construct($message, $statusCode);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public static function repositoryNotFound(): self
    {
        return new self('Repository not found', 404);
    }

    public static function rateLimitExceeded(): self
    {
        return new self('GitHub API rate limit exceeded. Please try again later.', 429);
    }

    public static function apiError(int $statusCode, ?string $message = null): self
    {
        return new self($message ?? "GitHub API error: {$statusCode}", $statusCode);
    }
}
