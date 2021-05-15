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

$tableStructure = "
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(50),
password VARCHAR(50),
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
";
$dbError = array_merge($dbError, createTable($regTable, $tableStructure, $connConfig));

if ($_SERVER["REQUEST_METHOD"] == "POST" && !$dbError["error"]) {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    $email = $recivedData["email"];
    $password = $recivedData["password"];
    if (valueIsExistInCol($regTable, $email, "email", $connConfig)) {
      $recivedData["error"] = true;
      $recivedData["code"] = 1; // User already exist
      $recivedData["errorMsg"] = "User already exist";
    } else {
      $dbError = array_merge(saveDataToDB("$email, $password", "email, password", $regTable, $connConfig));
      if (!$dbError["error"]) $recivedData["code"] = 0; // User was registered successful
    }
    $recivedData["password"] = preg_replace('/./', "*", $password);
    $recivedData["db"] = $dbError;
    echo json_encode($recivedData);
  }
}