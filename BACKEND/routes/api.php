<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\SetController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\UserController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

    // courses
    Route::post('/courses', [CourseController::class, 'createCourse']);
    Route::put('/courses/{course_slug}', [CourseController::class, 'updateCourse']);
    Route::delete('/courses/{course_slug}', [CourseController::class, 'deleteCourse']);
    Route::get('/courses', [CourseController::class, 'getAllCourse']);
    Route::get('/courses/{course_slug}', [CourseController::class, 'getCourse']);

    // sets
    Route::post('/courses/{course}/sets', [SetController::class, 'createSet']);
    Route::delete('/courses/{course}/sets/{set_id}', [SetController::class, 'deleteSet']);

    // lesson
    Route::post('/lessons', [LessonController::class, 'createLesson']);
    Route::delete('/lessons/{lesson_id}', [LessonController::class, 'deleteLesson']);
    Route::post('/lessons/{lesson_id}/contents/{content_id}/check', [LessonController::class, 'checkAnswer']);
    Route::put('/lessons/{lesson_id}/complete', [LessonController::class, 'completeLesson']);

    // users
    Route::post('/courses/{course_slug}/register', [UserController::class, 'registerUser']);
    Route::get('/users/progress', [UserController::class, 'progressUser']);
});

