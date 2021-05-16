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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    $email = $recivedData["email"];
    $password = $recivedData["password"];
    $dbPassword = readCellFromRow("email", $email, "password", $regTable, $connConfig);
    if ($dbPassword["error"]) {
      $recivedData["error"] = true;
      $recivedData["code"] = 1; // Incorrect user name
      $recivedData["errorMsg"] = "Incorrect user name";
      $dbError["error"] = $dbPassword["error"];
      $dbError["errorMessage"] = $dbPassword["errorMessage"];
    } else if ($dbPassword["data"] === $password) {
      $recivedData["code"] = 0; // User is valid
      $dbError["error"] = $dbPassword["error"];
      $dbError["errorMessage"] = $dbPassword["errorMessage"];
    } else {
      $recivedData["code"] = 2; // Incorrect password
      $recivedData["errorMsg"] = "Incorrect password";
      $dbError["error"] = $dbPassword["error"];
      $dbError["errorMessage"] = $dbPassword["errorMessage"];
    }
    $recivedData["password"] = preg_replace('/./', "*", $password);
    $recivedData["db"] = $dbError;
    echo json_encode($recivedData);
  }
}