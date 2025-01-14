<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use App\Models\Set;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonContent;
use App\Models\Option;
use App\Models\CompletedLesson;

class LessonController extends Controller
{
    public function createLesson(Request $req) {
        if (!Auth::guard('admin')->check()) { 
            return response()->json([ 
                'status' => 'insufficient_permissions', 
                'message' => 'Access forbidden', 
            ], 403); 
        }

        $validate = Validator::make($req->all(), [
            'name' => 'required|string|max:255',
            'set_id' => 'required|exists:sets,id',
            'contents' => 'required|array',
            'contents.*.type' => 'required|in:learn,quiz',
            'contents.*.content' => 'required|string',
            'contents.*.options' => 'required_if:contents.*.type,quiz|array',
            'contents.*.options.*.option_text' => 'required_if:contents.*.type,quiz|string',
            'contents.*.options.*.is_correct' => 'required_if:contents.*.type,quiz|boolean',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid field(s) in request',
                'errors' => $validate->errors()
            ], 400);
        }

        $lessonOrder = Lesson::where('set_id', $req->set_id)->count();

        $lesson = Lesson::create([
            'name' => $req->name,
            'set_id' => $req->set_id,
            'order' => $lessonOrder
        ]);

        foreach ($req->contents as $contentData) {
            $lessonContentOrder = LessonContent::where('lesson_id', $lesson->id)->count();
            
            $lessonContent = LessonContent::create([
                'lesson_id' => $lesson->id,
                'type' => $contentData['type'],
                'content' => $contentData['content'],
                'order' => $lessonContentOrder
            ]);

            if ($contentData['type'] === 'quiz' && isset($contentData['options'])) {
                foreach ($contentData['options'] as $optionData) {
                    Option::create([
                        'lesson_content_id' => $lessonContent->id,
                        'option_text' => $optionData['option_text'],
                        'is_correct' => $optionData['is_correct']
                    ]);
                }
            }

        }

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson successfully added',
            'data' => [
                'name' => $lesson->name,
                'order' => $lesson->order,
                'id' => $lesson->id
            ]
        ], 200);

    }

    public function deleteLesson(string $lesson_id) {
        if (!Auth::guard('admin')->check()) { 
            return response()->json([ 
                'status' => 'insufficient_permissions', 
                'message' => 'Access forbidden', 
            ], 403); 
        }

        $lesson = Lesson::find($lesson_id);

        if (!$lesson) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        $lesson->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson successfully deleted'
        ], 200);
    }

    public function checkAnswer(Request $req, string $lesson_id, string $content_id) {
        // if (!Auth::guard('admin')->check()) { 
        //     return response()->json([ 
        //         'status' => 'insufficient_permissions', 
        //         'message' => 'Access forbidden', 
        //     ], 403); 
        // }

        $lesson = Lesson::find($lesson_id);
        $lessonContent = LessonContent::find($content_id);

        if (!$lesson) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        if (!$lessonContent) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'option_id' => 'required|exists:options,id'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid field(s) in request',
                'errors' => $validate->errors()
            ], 400);
        }

        if ($lessonContent->type === 'quiz') {
            $checkAnswer = Option::where('id', $req->option_id)->first();
    
            return response()->json([
                'status' => 'success',
                'message' => 'Check answer success',
                'data' => [
                    'question' => $lessonContent->content,
                    'user_answer' => $checkAnswer->option_text,
                    'is_correct' => $checkAnswer->is_correct
                ]
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Only for quiz content'
        ], 400);
    }

    public function completeLesson(string $lesson_id) {
        $lesson = Lesson::find($lesson_id);
        $user = Auth::user();

        if (!$lesson) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        $complete = CompletedLesson::create([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson successfully completed',
        ], 200);

    }
}
