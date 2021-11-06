<?php
include "$_SERVER[DOCUMENT_ROOT]/php/db.php";
include "$_SERVER[DOCUMENT_ROOT]/php/headers.php";
include "$_SERVER[DOCUMENT_ROOT]/php/main-db-config.php";

$dbError = [
  "error"=>FALSE,
  "errorMessage"=>""
];

$tableName = 'weather';

$weatherTableStructure = "
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
id TEXT NOT NULL,
t FLOAT(3, 1),
p INT(6),
a INT(4),
v FLOAT(4, 2)
";

$dbError = array_merge($dbError, createTable($tableName, $weatherTableStructure, $connConfig));

if ($_SERVER["REQUEST_METHOD"] == 'POST') {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    $id = $recivedData['id'];
    $t = $recivedData['t'];
    $p = $recivedData['p'];
    $a = $recivedData['a'];
    $v = $recivedData['v'];

    $itemData = [
      [
        'value' => "$id, $t, $p, $a, $v",
        'col' => 'id, t, p, a, v'
      ],
    ];

    if (checkTable($tableName, $connConfig)) {
      $dbError = array_merge($dbError, saveMultyDataToDB($itemData, $tableName, $connConfig));
      $recivedData["code"] = 0;
    } else {
      $recivedData["code"] = 1; // Invalid income data or budget config table doesn't exist
      $recivedData["errorMsg"] = "Invalid income data or table doesn't exist";
    }

    if ($dbError['error']) {
      $recivedData["code"] = 2; // DB error
      $recivedData["errorMsg"] = $dbError['errorMessage'];
    }
    
    $recivedData["db"] = $dbError;
    echo json_encode($recivedData);
  }
}

if (
  $_SERVER["REQUEST_METHOD"] == "GET" &&
  $_GET["id"]
  ) {
    $id = $_GET["id"];
    $date = $_GET["date"];

    if (!$_GET["date"]) {
      $response = array_merge($dbError,
        // readRowByColValue('id', $id, $tableName, $connConfig) all data
        readLastRowByColValue('id', $id, 'reg_date', $tableName, $connConfig)
      );
    } else if ($_GET["date"]) {
      $response = array_merge($dbError,
        readByColAndDateValue('id', $id, 'reg_date', "$date 00:00:00", "$date 23:59:59", $tableName, $connConfig)
      );
    }
    echo json_encode($response);
}