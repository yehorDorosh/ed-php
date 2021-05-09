<?php
include './api/api.php';

if(isset($_POST["clear"])) {
  clearTable($varsTableName, $connConfig);
}

if (
  $_SERVER["REQUEST_METHOD"] == "POST" &&
  $_POST["saveVarName"] &&
  $_POST["saveVarValue"] &&
  isset($_POST["send"])
  ) {
    $response = saveVarToDb($_POST["saveVarName"], $_POST["saveVarValue"], $varsTableName, $connConfig);
    if ($responseTable["error"]) {
      echo $responseTable["errorMessage"];
    }
}

if (
  $_SERVER["REQUEST_METHOD"] == "POST" &&
  $_POST["readVarName"] &&
  isset($_POST["send"])
  ) {
    $response = readVarFromDb($_POST["readVarName"], $varsTableName, $connConfig);
    $phpAlert = $response["data"] . "<br>";
}

$responseTable = printVarTable($varsTableName, $connConfig);
if ($responseTable["error"]) {
  echo $responseTable["errorMessage"];
}
