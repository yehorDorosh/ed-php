<?php
$connConfig = [
  "dbHostName" => getenv('ENV_MODE') === "prod" ? "localhost" : "db", //localhost or db. getenv('ENV_MODE') = prod
  "dbUserName" => "admin",
  "dbUserPass" => getenv('ENV_MODE') === "prod" ? getenv("DB_PASS") : "admin", //getenv("DB_PASS")
  "dbName" => "main_db"
];

$tableName = "vars";

// GET
if (
$_SERVER["REQUEST_METHOD"] == "GET" &&
$_GET["readVarName"]
) {
  $response = readVarFromDb($_GET["readVarName"], $tableName, $connConfig);
  echo json_encode([
    $_GET["readVarName"]=>$response["data"]
  ]);
}
// POST
if (
  $_SERVER["REQUEST_METHOD"] == "POST"
) {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    // READ DATA
    if(array_key_exists('read', $recivedData )) {
      $varsList = $recivedData["read"]["vars"];
      $vars = array();
      $error = array();
      foreach ($varsList as &$varName) {
        $response = readVarFromDb($varName, $tableName, $connConfig);
        $vars[$varName] = $response["data"];
        if($response["error"]) $error[$varName] = $response["errorMessage"];
      }
      $recivedData["response"]["vars"] = $vars;
      $recivedData["response"]["onReadError"] = $error;
      $recivedData["response"]["tableVars"] = getVarTable($tableName, $connConfig);
    }
    // WRITE DATA
    if(array_key_exists('write', $recivedData )) {
      $varsList = $recivedData["write"]["vars"];
      $error = array();
      foreach ($varsList as $varName => $varValue) {
        $response = saveVarToDb($varName, $varValue, $tableName, $connConfig);
        if ($response["error"]) {
          $error[$varName] = $response["errorMessage"];
        }
      }
      $recivedData["response"]["tableVars"] = getVarTable($tableName, $connConfig);
      $recivedData["response"]["onWriteError"] = $error;
    }
    echo json_encode($recivedData);
  }
}
// DELETE
if (
  $_SERVER["REQUEST_METHOD"] == "DELETE"
) {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    $varsList = $recivedData["vars"];
    $error = array();
    foreach ($varsList as &$varName) {
      $response = deleteVar($varName, $tableName, $connConfig);
      if($response["error"]) $error[$varName] = $response["errorMessage"];
    }
    if ($recivedData["all"] === TRUE) clearTable($tableName, $connConfig);
    $recivedData["response"]["onDeleteError"] = $error;
    $recivedData["response"]["tableVars"] = getVarTable($tableName, $connConfig);
    echo json_encode($recivedData);
  }
}







function varIsExist($conn, $tableName, $varName) {
  $sql="SELECT varName FROM $tableName WHERE varName='$varName'";
  $result = $conn->query($sql);
  if (!$result->num_rows) return false;
  return true;
}

function saveVarToDb($varName, $varValue, $tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Connection to data base failed: " . $conn->connect_error;
    return $response;
  }
  // Create table
  $sqlNewTable = "CREATE TABLE $tableName(
    varName VARCHAR(65535),
    varValue VARCHAR(65535)
  )";
  $tableIsExist = $conn->query("select 1 from `$tableName` LIMIT 1");
  if (!$tableIsExist) {
    if ($conn->query($sqlNewTable) === FALSE) {
      $response["error"] = TRUE;
      $response["errorMessage"] = "Error creating table: " . $conn->error;
      return $response;
    }
  }
  // write
  if (varIsExist($conn, $tableName, $varName)) {
    $sqlSaveValue = "UPDATE $tableName
      SET varValue = '$varValue'
      WHERE varName = '$varName'";
  } else {
    $sqlSaveValue = "INSERT INTO $tableName (varName, varValue)
      VALUES ('$varName', '$varValue')";
  }
  if ($conn->query($sqlSaveValue) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error: " . $sqlSaveValue . "<br>" . $conn->error;
    return $response;
  }
  $conn->close();
  return $response;
}

function readVarFromDb($varName, $tableName, $connConfig) {
  $response = [
    "data"=>NULL,
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Connection to data base failed: " . $conn->connect_error;
    return $response;
  }
  // Read data
  $sqlGetData="SELECT * FROM $tableName WHERE varName='$varName'";
  if ($conn->query($sqlGetData) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error when read data from db: " . $sqlGetData . "<br>" . $conn->error;
    return $response;
  }
  $result = $conn->query($sqlGetData);
  $conn->close();
  if ($result->num_rows > 0) {
    $response["data"] = $result->fetch_assoc()["varValue"];
    return $response;
  } else {
    $response["error"] = TRUE;
    $response["errorMessage"] = "The varriable doesn't exist in table";
    return $response;
  }
}

function clearTable($tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Connection to data base failed: " . $conn->connect_error;
    return $response;
  }

  $sql = "DELETE FROM $tableName";
  if ($conn->query($sql) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error deleting record: " . $conn->error;
    return $response;
  }
  $conn->close();
  return $response;
}

function deleteVar($varName, $tableName, $connConfig) {
  $response = [
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Connection to data base failed: " . $conn->connect_error;
    return $response;
  }

  $sql = "DELETE FROM $tableName WHERE varName='$varName'";
  if ($conn->query($sql) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error deleting record: " . $conn->error;
    return $response;
  }
  $conn->close();
  return $response;
}

function printVarTable($tableName, $connConfig) {
  $response = [
    "data"=>NULL,
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Connection to data base failed: " . $conn->connect_error;
    return $response;
  }
  // Read data
  $sqlGetData="SELECT * FROM $tableName";
  if ($conn->query($sqlGetData) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error when read data from db: " . $sqlGetData . "<br>" . $conn->error;
    return $response;
  }
  $result = $conn->query($sqlGetData);
  
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      echo "key: " . $row["varName"]. " - Value: " . $row["varValue"] . "<br>";
    }
  } else {
    echo "0 results";
  }
  $conn->close();
  return $response;
}

function getVarTable($tableName, $connConfig) {
  $response = [
    "data"=>NULL,
    "error"=>FALSE,
    "errorMessage"=>""
  ];
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Connection to data base failed: " . $conn->connect_error;
    return $response;
  }
  // Read data
  $sqlGetData="SELECT * FROM $tableName";
  if ($conn->query($sqlGetData) === FALSE) {
    $response["error"] = TRUE;
    $response["errorMessage"] = "Error when read data from db: " . $sqlGetData . "<br>" . $conn->error;
    return $response;
  }
  $result = $conn->query($sqlGetData);
  
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      $response["data"][$row["varName"]] = $row["varValue"];
    }
  } else {
    $response["data"] = "0 results";
  }
  $conn->close();
  return $response;
}
