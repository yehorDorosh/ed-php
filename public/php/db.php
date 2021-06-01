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
      $response["errorMessage"] = "Error creating table: $sqlNewTable " . $conn->error;
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

function saveValueToDbCell($rowName, $rowNameCol, $value, $valueCol, $tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;
  // write
  if (valueIsExistInCol($tableName, $rowName, $rowNameCol, $connConfig)) {
    $sqlSaveValue = "UPDATE $tableName
      SET $valueCol = '$value'
      WHERE $rowNameCol = '$rowName'";
  } else {
    $sqlSaveValue = "INSERT INTO $tableName ($rowNameCol, $valueCol)
      VALUES ('$rowName', '$value')";
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

function saveMultyDataToDB($data, $tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;

  foreach($data as $row) {
    $value = implode(", ", array_map(function($str){return "'$str'";}, explode(", ", $row['value'])));
    $col = $row['col'];
    $sqlSaveValue = "INSERT INTO $tableName ($col) VALUES ($value)";
    // write
    if ($conn->query($sqlSaveValue) === FALSE) {
      $response["error"] = TRUE;
      $response["errorMessage"] = "Error: " . $sqlSaveValue . "<br>" . $conn->error;
      return $response;
    }
  }

  $conn->close();
  return $response;
}

function readCellFromRow($searchCol, $targetRow, $cellName, $tableName, $connConfig) {
  $response = [
    "data"=>NULL,
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;
  // Read data
  $sqlGetData="SELECT * FROM $tableName WHERE $searchCol='$targetRow'";
  if ($conn->query($sqlGetData) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error when read data from db: " . $sqlGetData . "<br>" . $conn->error;
    return $response;
  }
  $result = $conn->query($sqlGetData);
  $conn->close();
  if ($result->num_rows > 0) {
    $response["data"] = $result->fetch_assoc()["$cellName"];
    return $response;
  } else {
    $response["error"] = TRUE;
    $response["errorMessage"] = "The varriable doesn't exist in table";
    return $response;
  }
}

function deleteRow($cellContent, $col, $tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;

  $sql = "DELETE FROM $tableName WHERE $col='$cellContent'";
  if ($conn->query($sql) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error deleting record: " . $conn->error;
    return $response;
  }
  $conn->close();
  return $response;
}

function deleteTable($tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;

  $sql = "DROP TABLE $tableName";
  if ($conn->query($sql) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error droping table: " . $conn->error;
    return $response;
  }
  $conn->close();
  return $response;
}

function checkTable($tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = connToDb($connConfig, $response);
  if (!$conn) return $response;
  // Check table
  $tableIsExist = $conn->query("select 1 from `$tableName` LIMIT 1");
  $conn->close();
  return $tableIsExist;
}
