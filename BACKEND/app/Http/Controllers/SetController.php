<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use App\Models\Set;
use App\Models\Course;

class SetController extends Controller
{
    public function createSet(Request $req, string $course) {
        if (!Auth::guard('admin')->check()) { 
            return response()->json([ 
                'status' => 'insufficient_permissions', 
                'message' => 'Access forbidden', 
            ], 403); 
        }

        $course = Course::where('slug', $course)->first();

        if (!$course) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'name' => 'required',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid field(s) in request',
                'errors' => $validate->errors()
            ], 400);
        }

        $order = Set::where('course_id', $course->id)->count();

        $set = Set::create([
            'name' => $req->name,
            'order' => $order,
            'course_id' => $course->id
        ]);

        return response()->json([
            'name' => $set->name,
            'order' => $set->order,
            'id' => $set->id
        ], 201);
    }

    public function deleteSet(string $course, string $set_id) {
        if (!Auth::guard('admin')->check()) { 
            return response()->json([ 
                'status' => 'insufficient_permissions', 
                'message' => 'Access forbidden', 
            ], 403); 
        }

        $course = Course::where('slug', $course)->first();

        if (!$course) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        $set = Set::find($set_id);

        if (!$set) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Resource not found'
            ], 404);
        }

        $set->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Set successfully deleted'
        ], 200);

    }
}
