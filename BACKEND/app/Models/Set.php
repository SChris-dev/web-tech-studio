<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Set extends Model
{
    protected $table = 'sets';

    protected $fillable = [
        'name',
        'course_id',
        'order',
    ];

    public function course() {
        return $this->belongsTo(Course::class, 'course_id', 'id');
    }

    public function lessons() {
        return $this->hasMany(Lesson::class, 'set_id', 'id');
    }
}
