<?php

function connToDb($connConfig, &$response) {
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Connection to data base failed: " . $conn->connect_error;
    return NULL;
  }
  return $conn;
}