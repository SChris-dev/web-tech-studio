<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'courses';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_published'
    ];

    public function enrollments() {
        return $this->hasMany(Enrollment::class, 'course_id', 'id');
    }

    public function sets() {
        return $this->hasMany(Set::class, 'course_id', 'id');
    }
}
