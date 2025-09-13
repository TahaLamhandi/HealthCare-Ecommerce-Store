<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CategoryPageController extends Controller
{
    public function index()
    {
        return view('categories');
    }
}
