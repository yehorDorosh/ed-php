<?php
include "$_SERVER[DOCUMENT_ROOT]/php/headers.php";

if ($_SERVER["REQUEST_METHOD"] == "GET" ) {
  $response = [
    'time' => date("G:i:s"),
  ];
  echo json_encode($response);
}