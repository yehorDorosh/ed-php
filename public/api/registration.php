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

$usersTableStructure = "
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
user_name VARCHAR(50),
email VARCHAR(50),
password VARCHAR(50),
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
";

$newUserTableStructure = "
parameter TEXT,
value TEXT
";

$dbError = array_merge($dbError, createTable($regTable, $usersTableStructure, $connConfig));

if ($_SERVER["REQUEST_METHOD"] == "POST" && !$dbError["error"]) {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    $email = $recivedData["email"];
    $userName = strstr($email, "@", true);
    $password = $recivedData["password"];
    if (valueIsExistInCol($regTable, $userName, "user_name", $connConfig)) {
      $recivedData["error"] = true;
      $recivedData["code"] = 1; // User already exist
      $recivedData["errorMsg"] = "User already exist";
    } else {
      $dbError = array_merge($dbError, saveDataToDB("$userName, $email, $password", "user_name, email, password", $regTable, $connConfig));
      $dbError = array_merge($dbError, createTable($userName, $newUserTableStructure, $connConfig));
      $dbError = array_merge($dbError, saveDataToDB("Expense categories, all", "parameter, value", $userName, $connConfig));
      $dbError = array_merge($dbError, saveDataToDB("Income categories, all", "parameter, value", $userName, $connConfig));
      if (!$dbError["error"]) $recivedData["code"] = 0; // User was registered successful
    }
    $recivedData["password"] = preg_replace('/./', "*", $password);
    $recivedData["db"] = $dbError;
    echo json_encode($recivedData);
  }
}