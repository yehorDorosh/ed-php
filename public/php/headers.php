<?php
$origin = $_SERVER['HTTP_ORIGIN'];
$allowed_domains = [
    'http://localhost:7777',
    'http://localhost:3000',
];

if (in_array($origin, $allowed_domains) && getenv('ENV_MODE') !== "prod") {
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header('Access-Control-Allow-Origin: ' . $origin);
}