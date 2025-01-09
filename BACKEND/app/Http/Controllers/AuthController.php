<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\Administrator;

class AuthController extends Controller
{
    public function register(Request $req) {
        $validate = Validator::make($req->all(), [
            'full_name' => 'required',
            'username' => 'required|min:3|unique:users,username|regex:/^[a-zA-Z0-9._]+$/',
            'password' => 'required|min:6'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid field(s) in request',
                'errors' => $validate->errors(),
            ], 400);
        }

        $user = User::create([
            'full_name' => $req->full_name,
            'username' => $req->username,
            'password' => bcrypt($req->password),
        ]);

        $token = $user->createToken('user_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Registration success',
            'data' => [
                'full_name' => $user->full_name,
                'username' => $user->username,
                'updated_at' => $user->updated_at,
                'created_at' => $user->created_at,
                'id' => $user->id,
                'token' => $token,
                'role' => 'user'
            ]
        ], 201);
    }

    public function login(Request $req) 
    { 
        $validate = Validator::make($req->all(), [ 
            'username' => 'required', 
            'password' => 'required' 
        ]); 
 
        if ($validate->fails()) { 
            return response()->json([ 
                'message' => $validation->errors() 
            ], 422); 
        } 
 
        $admin = Administrator::where('username', $req->username)->first(); 
        if ($admin && \Hash::check($req->password, $admin->password)) { 
            $token = $admin->createToken('admin_token')->plainTextToken; 
 
            return response()->json([ 
                'status' => 'success', 
                'message' => 'Login successful',
                'data' => [
                    'id' => $admin->id,
                    'username' => $admin->username,
                    'created_at' => $admin->created_at,
                    'updated_at' => $admin->updated_at,
                    'token' => $token,
                    'role' => 'admin'
                ]
            ], 200); 
        } 
 
        
        if (Auth::attempt(['username' => $req->username, 'password' => $req->password])) { 
            $user = Auth::user(); 
            $token = $user->createToken('user_token')->plainTextToken; 
 
            return response()->json([ 
                'status' => 'success', 
                'message' => 'Login successful',
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                    'token' => $token,
                    'role' => 'user'
                ]
            ], 200); 
        } 
 
      
        return response()->json([ 
            "status" => "authentication_failed", 
            "message" => "The username or password you entered is incorrect" 
        ], 400); 
    }

    public function logout(Request $req) {
        $user = Auth::user();

        $user->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout successful'
        ], 200);
        
    }
}
