<?php

return [
    'smtp' => [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'encryption' => 'tls',
        'username' => 'tahalamhandi11@gmail.com',
        'password' => env('MAIL_PASSWORD', 'your-app-password-here'),
        'from' => [
            'address' => 'tahalamhandi11@gmail.com',
            'name' => 'BioEcleel'
        ]
    ]
];





