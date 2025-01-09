<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Administrator extends Model
{
    use HasApiTokens;

    protected $table = 'administrators';

    protected $fillable = [
        'username',
        'password',
        'remember_token',
    ];
}
