<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use App\Models\Set;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonContent;
use App\Models\Option;
use App\Models\CompletedLesson;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function registerUser(string $course_slug) {
        $user = Auth::user();
        $course = Course::where('slug', $course_slug)->first();

        if (!$course) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        $checkEnrolment = Enrollment::where('user_id', $user->id)->where('course_id', $course->id)->first();
        if (!$checkEnrolment) {

            Enrollment::create([
                'user_id' => $user->id,
                'course_id' => $course->id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'User registered successful',
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'The user is already registered for this course'
        ], 400);

    }

    public function progressUser() {
        $user = Auth::user();

        $progress = User::with('enrollments.course.sets.lessons.completed_lessons')->find($user->id);

        Log::info([
            'progress' => $progress,
        ]);

        $response = [
            'status' => 'success',
            'message' => 'User progress retrieved successfully',
            'data' => [
                'progress' => $progress->enrollments->map(function ($enrollment) {
                    $course = $enrollment->course;
    
                    return [
                        'course' => [
                            'id' => $course->id,
                            'name' => $course->name,
                            'slug' => $course->slug,
                            'description' => $course->description,
                            'is_published' => $course->is_published,
                            'created_at' => $course->created_at,
                            'updated_at' => $course->updated_at,
                        ],
                        'completed_lessons' => $course->sets->flatMap(function ($set) {
                            return $set->lessons->flatMap(function ($lesson) {
                                return $lesson->completed_lessons->map(function($completed_lesson) use ($lesson) {
                                    return [
                                        'id' => $completed_lesson->lesson_id,
                                        'name' => $lesson->name,
                                        'order' => $lesson->order,
                                    ];
                                });
                            });
                        })
                    ];
                })
            ]
        ];

        return response()->json($response, 200);
    }
}
