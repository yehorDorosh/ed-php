<?php
include './api/api.php';

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

$responseTable = printVarTable($tableName, $connConfig);
if ($responseTable["error"]) {
  echo $responseTable["errorMessage"];
}
