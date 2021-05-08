<?php
$connConfig = [
  "dbHostName" => "db",
  "dbUserName" => "admin",
  "dbUserPass" => "admin",
  "dbName" => "main_db"
];

$tableName = "vars";

if(isset($_POST["clear"])) {
  clearTable($tableName, $connConfig);
}

if (
  $_SERVER["REQUEST_METHOD"] == "POST" &&
  $_POST["saveVarName"] &&
  $_POST["saveVarValue"] &&
  isset($_POST["send"])
  ) {
    saveVarToDb($_POST["saveVarName"], $_POST["saveVarValue"], $tableName, $connConfig);
}

if (
  $_SERVER["REQUEST_METHOD"] == "POST" &&
  $_POST["readVarName"] &&
  isset($_POST["send"])
  ) {
    $phpAlert = readVarFromDb($_POST["readVarName"], $tableName, $connConfig) . "<br>" ;
}

printVarTable($tableName, $connConfig);



function saveVarToDb($varName, $varValue, $tableName, $connConfig) {
  function varIsExist($conn, $tableName, $varName) {
    $sql="SELECT varName FROM $tableName WHERE varName='$varName'";
    $result = $conn->query($sql);
    if (!$result->num_rows) return false;
    return true;
  }
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    die("Connection to data base failed: " . $conn->connect_error . "<br>");
  }
  // Create table
  $sqlNewTable = "CREATE TABLE $tableName(
    varName VARCHAR(65535),
    varValue VARCHAR(65535)
  )";
  $tableIsExist = $conn->query("select 1 from `$tableName` LIMIT 1");
  if (!$tableIsExist) {
    if ($conn->query($sqlNewTable) === FALSE) {
      die("Error creating table: " . $conn->error . "<br>");
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
    die("Error: " . $sqlSaveValue . "<br>" . $conn->error . "<br>");
  }
  $conn->close();
}

function readVarFromDb($varName, $tableName, $connConfig) {
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    die("Connection to data base failed: " . $conn->connect_error . "<br>");
  }
  // Read data
  $sqlGetData="SELECT * FROM $tableName WHERE varName='$varName'";
  if ($conn->query($sqlGetData) === FALSE) {
    die("Error when read data from db: " . $sqlGetData . "<br>" . $conn->error . "<br>");
  }
  $result = $conn->query($sqlGetData);
  $conn->close();
  if ($result->num_rows > 0) {
    return $result->fetch_assoc()["varValue"];
  } else {
    return null;
  }
}

function clearTable($tableName, $connConfig) {
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    die("Connection to data base failed: " . $conn->connect_error . "<br>");
  }

  $sql = "DELETE FROM $tableName";
  if ($conn->query($sql) === FALSE) {
    die("Error deleting record: " . $conn->error . "<br>");
  }
  $conn->close();
}

function printVarTable($tableName, $connConfig) {
  // Connection
  $conn = new mysqli(
    $connConfig["dbHostName"],
    $connConfig["dbUserName"],
    $connConfig["dbUserPass"],
    $connConfig["dbName"]
  );
  if ($conn->connect_error) {
    die("Connection to data base failed: " . $conn->connect_error . "<br>");
  }
  // Read data
  $sqlGetData="SELECT * FROM $tableName";
  if ($conn->query($sqlGetData) === FALSE) {
    die("Error when read data from db: " . $sqlGetData . "<br>" . $conn->error . "<br>");
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
}
