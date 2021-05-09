<?php
$origin = $_SERVER['HTTP_ORIGIN'];
$allowed_domains = [
    'http://localhost:7777',
    'http://localhost:3000',
];

if (in_array($origin, $allowed_domains) && getenv('ENV_MODE') !== "prod") {
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header('Access-Control-Allow-Origin: ' . $origin);
}

include "$_SERVER[DOCUMENT_ROOT]/php/vars-db.php";

$connConfig = [
  "dbHostName" => getenv('ENV_MODE') === "prod" ? "localhost" : "db", //localhost or db. getenv('ENV_MODE') = prod
  "dbUserName" => "admin",
  "dbUserPass" => getenv('ENV_MODE') === "prod" ? getenv("DB_PASS") : "admin", //getenv("DB_PASS")
  "dbName" => "main_db"
];

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
