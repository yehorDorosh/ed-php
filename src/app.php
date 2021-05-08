<?php
include 'api.php';

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
    $response = readVarFromDb($_POST["readVarName"], $tableName, $connConfig);
    $phpAlert = $response["data"] . "<br>";
}

printVarTable($tableName, $connConfig);
