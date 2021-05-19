<?php
include "$_SERVER[DOCUMENT_ROOT]/php/db.php";
include "$_SERVER[DOCUMENT_ROOT]/php/headers.php";


$connConfig = [
  "dbHostName" => getenv('ENV_MODE') === "prod" ? "localhost" : "db", //localhost or db. getenv('ENV_MODE') = prod
  "dbUserName" => "admin",
  "dbUserPass" => getenv('ENV_MODE') === "prod" ? getenv("DB_PASS") : "admin", //getenv("DB_PASS")
  "dbName" => "main_db"
];
$regTable = "users";
$dbError = [
  "error"=>FALSE,
  "errorMessage"=>""
];

function removeUser($email, $regTable, $connConfig, &$dbError) {
  $userName = strstr($email, "@", true);
  $dbError = array_merge($dbError, deleteRow($email, "email", $regTable, $connConfig));
  $dbError = array_merge($dbError, deleteTable($userName, $connConfig));
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    $email = $recivedData["email"];
    removeUser($email, $regTable, $connConfig, $dbError);
    if ($dbError['error']) {
      $recivedData["error"] = true;
      $recivedData["code"] = 1; // User already exist
      $recivedData["errorMsg"] = $dbError['errorMessage'];
    } else {
      $recivedData["code"] = 0;
    }
    $recivedData["db"] = $dbError;
    echo json_encode($recivedData);
  }
}