<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompletedLesson extends Model
{
    protected $table = 'completed_lessons';

    protected $fillable = [
        'user_id',
        'lesson_id'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function lesson() {
        return $this->belongsTo(Lesson::class, 'lesson_id', 'id');
    }
}
