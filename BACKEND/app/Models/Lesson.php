<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $table = 'lessons';

    protected $fillable = [
        'set_id',
        'name',
        'order'
    ];

    public function set() {
        return $this->belongsTo(Set::class, 'set_id', 'id');
    }

    public function completed_lessons() {
        return $this->hasMany(CompletedLesson::class, 'lesson_id', 'id');
    }

    public function lesson_contents() {
        return $this->hasMany(LessonContent::class, 'lesson_id', 'id');
    }
}
