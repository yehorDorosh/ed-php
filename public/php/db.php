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

function clearTable($tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;

  $sql = "DELETE FROM $tableName";
  if ($conn->query($sql) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error deleting record: " . $conn->error;
    return $response;
  }
  $conn->close();
  return $response;
}