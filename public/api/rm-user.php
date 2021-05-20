<?php
include "$_SERVER[DOCUMENT_ROOT]/php/db.php";
include "$_SERVER[DOCUMENT_ROOT]/php/headers.php";
include "$_SERVER[DOCUMENT_ROOT]/php/main-db-config.php";

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
      $recivedData["code"] = 1; // DB error
    } else {
      $recivedData["code"] = 0;
    }
    $recivedData["db"] = $dbError;
    echo json_encode($recivedData);
  }
}