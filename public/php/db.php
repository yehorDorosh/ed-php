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

function createTable($tableName, $tableStructure, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;
  // Create table
  $sqlNewTable = "CREATE TABLE $tableName($tableStructure)";
  $tableIsExist = $conn->query("select 1 from `$tableName` LIMIT 1");
  if (!$tableIsExist) {
    if ($conn->query($sqlNewTable) === FALSE) {
      $response["error"] = TRUE;
      $response["errorMessage"] = "Error creating table: " . $conn->error;
      return $response;
    }
  }
  $conn->close();
  return $response;
}

function valueIsExistInCol($tableName, $value, $col, $connConfig) {
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return NULL;
  // Check
  $sql="SELECT $col from $tableName WHERE $col='$value'";
  $result = $conn->query($sql);
  $conn->close();
  if (!$result->num_rows) return false;
  return true;
}

function saveValueToColumn($value, $col, $tableName, $connConfig) {
  function varIsExist($tableName, $value, $col, $conn) {
    $sql="SELECT $col FROM $tableName WHERE $col='$value'";
    $result = $conn->query($sql);
    if (!$result->num_rows) return false;
    return true;
  }
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;
  // write
  if (varIsExist($tableName, $value, $col, $conn)) {
    $sqlSaveValue = "UPDATE $tableName
      SET $col = '$value'
      WHERE $col = '$value'";
  } else {
    $sqlSaveValue = "INSERT INTO $tableName ($col)
      VALUES ('$value')";
  }
  if ($conn->query($sqlSaveValue) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error: " . $sqlSaveValue . "<br>" . $conn->error;
    return $response;
  }
  $conn->close();
  return $response;
}

function saveDataToDB($value, $col, $tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  $value = implode(", ", array_map(function($str){return "'$str'";}, explode(", ", $value)));
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;
  // write
  $sqlSaveValue = "INSERT INTO $tableName ($col)
      VALUES ($value)";
  if ($conn->query($sqlSaveValue) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error: " . $sqlSaveValue . "<br>" . $conn->error;
    return $response;
  }
  $conn->close();
  return $response;
}