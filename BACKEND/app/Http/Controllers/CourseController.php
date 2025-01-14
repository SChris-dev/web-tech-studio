<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use App\Models\Course;

class CourseController extends Controller
{
    public function createCourse(Request $req) {
        if (!Auth::guard('admin')->check()) { 
            return response()->json([ 
                'status' => 'insufficient_permissions', 
                'message' => 'Access forbidden', 
            ], 403); 
        }

        $validate = Validator::make($req->all(), [
            'name' => 'required',
            'description' => 'nullable',
            'slug' => 'required|unique:courses,slug'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid field(s) in request',
                'errors' => $validate->errors()
            ], 400);
        }

        $course = Course::create([
            'name' => $req->name,
            'description' => $req->description,
            'slug' => $req->slug
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Course successfully added!',
            'data' => $course
        ], 201);


    }

    public function updateCourse(Request $req, string $course_slug) {
        if (!Auth::guard('admin')->check()) { 
            return response()->json([ 
                'status' => 'insufficient_permissions', 
                'message' => 'Access forbidden', 
            ], 403); 
        }

        $course = Course::where('slug', $course_slug)->first();

        if (!$course) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'name' => 'required',
            'description' => 'nullable',
            'is_published' => 'nullable|boolean'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid field(s) in request',
                'errors' => $validate->errors()
            ], 400);
        }

        $updatedCourse = $course->update([
            'name' => $req->name,
            'description' => $req->description,
            'is_published' => $req->is_published
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Course successfully updated',
            'data' => $course
        ], 200);

        
    }

    public function deleteCourse(string $course_slug) {
        if (!Auth::guard('admin')->check()) { 
            return response()->json([ 
                'status' => 'insufficient_permissions', 
                'message' => 'Access forbidden', 
            ], 403); 
        }

        $course = Course::where('slug', $course_slug)->first();

        if (!$course) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        $course->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Course successfully deleted'
        ], 200);
    }

    public function getAllCourse() {
        $courses = Course::all();

        return response()->json([
            'status' => 'success',
            'message' => 'Courses retrieved successfully',
            'data' => [
                'courses' => $courses
            ]
        ], 200);
    }

    public function getCourse(string $course_slug) {
        $course = Course::with('sets.lessons.lesson_contents.options')->where('slug', $course_slug)->first();
    
        if (!$course) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }
    
        $response = [
            'status' => 'success',
            'message' => 'Course details retrieved successfully',
            'data' => [
                'id' => $course->id,
                'name' => $course->name,
                'slug' => $course->slug,
                'description' => $course->description,
                'is_published' => $course->is_published,
                'created_at' => $course->created_at,
                'updated_at' => $course->updated_at,
                'sets' => $course->sets->map(function ($set) {
                    return [
                        'id' => $set->id,
                        'name' => $set->name,
                        'order' => $set->order,
                        'lessons' => $set->lessons->map(function ($lesson) {
                            return [
                                'id' => $lesson->id,
                                'name' => $lesson->name,
                                'order' => $lesson->order,
                                'contents' => $lesson->lesson_contents->map(function ($content) {
                                    $contentData = [
                                        'id' => $content->id,
                                        'type' => $content->type,
                                        'content' => $content->content,
                                        'order' => $content->order,
                                    ];
    
                                    // If content type is 'quiz', include options
                                    if ($content->type === 'quiz') {
                                        $contentData['options'] = $content->options->map(function ($option) {
                                            return [
                                                'id' => $option->id,
                                                'option_text' => $option->option_text,
                                            ];
                                        });
                                    }
    
                                    return $contentData;
                                })
                            ];
                        })
                    ];
                })
            ]
        ];
    
        return response()->json($response, 200);
    }
    
}
