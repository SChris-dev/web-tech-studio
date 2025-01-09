<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonContent extends Model
{
    protected $table = 'lesson_contents';

    protected $fillable = [
        'lesson_id',
        'type',
        'content',
        'order',
    ];

    public function options() {
        return $this->hasMany(Option::class, 'lesson_content_id', 'id');
    }

    public function lesson() {
        return $this->belongsTo(Lesson::class, 'lesson_id', 'id');
    }
}
