<?php
include "$_SERVER[DOCUMENT_ROOT]/php/vars-db.php";
include "$_SERVER[DOCUMENT_ROOT]/php/headers.php";
include "$_SERVER[DOCUMENT_ROOT]/php/main-db-config.php";

$varsTableName = "vars";

// GET
if (
$_SERVER["REQUEST_METHOD"] == "GET" &&
$_GET["readVarName"]
) {
  $response = readVarFromDb($_GET["readVarName"], $varsTableName, $connConfig);
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
        $response = readVarFromDb($varName, $varsTableName, $connConfig);
        $vars[$varName] = $response["data"];
        if($response["error"]) $error[$varName] = $response["errorMessage"];
      }
      $recivedData["response"]["vars"] = $vars;
      $recivedData["response"]["onReadError"] = $error;
      $recivedData["response"]["tableVars"] = getVarTable($varsTableName, $connConfig);
    }
    // WRITE DATA
    if(array_key_exists('write', $recivedData )) {
      $varsList = $recivedData["write"]["vars"];
      $error = array();
      foreach ($varsList as $varName => $varValue) {
        $response = saveVarToDb($varName, $varValue, $varsTableName, $connConfig);
        if ($response["error"]) {
          $error[$varName] = $response["errorMessage"];
        }
      }
      $recivedData["response"]["tableVars"] = getVarTable($varsTableName, $connConfig);
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
      $response = deleteVar($varName, $varsTableName, $connConfig);
      if($response["error"]) $error[$varName] = $response["errorMessage"];
    }
    if ($recivedData["all"] === TRUE) clearTable($varsTableName, $connConfig);
    $recivedData["response"]["onDeleteError"] = $error;
    $recivedData["response"]["tableVars"] = getVarTable($varsTableName, $connConfig);
    echo json_encode($recivedData);
  }
}
