<?php

return [
    'default' => 'gmail_smtp',
    
    'mailers' => [
        'gmail_smtp' => [
            'transport' => 'smtp',
            'host' => 'smtp.gmail.com',
            'port' => 587,
            'encryption' => 'tls',
            'username' => 'tahalamhandi11@gmail.com',
            'password' => 'your_app_password_here', // You need to set this
            'timeout' => null,
        ],
    ],
    
    'from' => [
        'address' => 'tahalamhandi11@gmail.com',
        'name' => 'BioEcleel',
    ],
];








