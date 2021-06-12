<?php
include "$_SERVER[DOCUMENT_ROOT]/php/db.php";
include "$_SERVER[DOCUMENT_ROOT]/php/headers.php";
include "$_SERVER[DOCUMENT_ROOT]/php/main-db-config.php";

$dbError = [
  "error"=>FALSE,
  "errorMessage"=>""
];

$tableName = 'budget';

function createBudgetTable($tableName, $connConfig, &$dbError) {
  if (checkTable($tableName, $connConfig)) return;
  $budgetTableStructure = "
  id TEXT,
  email VARCHAR(50) NOT NULL,
  log_date DATETIME NOT NULL,
  date DATE NOT NULL,
  category_type VARCHAR(50) NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  amount TEXT NOT NULL
  ";
  $dbError = array_merge($dbError, createTable($tableName, $budgetTableStructure , $connConfig));
}

createBudgetTable($tableName, $connConfig, $dbError);

if ($_SERVER["REQUEST_METHOD"] == 'POST') {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    $id = $recivedData['id'];
    $email = $recivedData['email'];
    $log_date = $recivedData['logDate'];
    $date = $recivedData['date'];
    $category_type = $recivedData['categoryType'];
    $category = $recivedData['category'];
    $name = $recivedData['name'];
    $amount = $recivedData['amount'];
    $itemData = [
      [
        'value' => "$id, $email, $log_date, $date, $category_type, $category, $name, $amount",
        'col' => 'id, email, log_date, date, category_type, category, name, amount'
      ],
    ];

    if (checkTable($tableName, $connConfig)) {
      $dbError = array_merge($dbError, saveMultyDataToDB($itemData, $tableName, $connConfig));
      $recivedData["code"] = 0;
    } else {
      $recivedData["code"] = 1; // Invalid income data or budget config table doesn't exist
      $recivedData["errorMsg"] = "Invalid income data or budget config table doesn't exist";
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
  $_GET["email"]
  ) {
    $email = $_GET["email"];

    $response = array_merge($dbError,
      readRowByColValue('email', $email, $tableName, $connConfig)
    );
    echo json_encode($response);
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    $email = $recivedData['email'];
    $id = $recivedData['id'];
    if ($email && $id && checkTable($tableName, $connConfig)) {
      $dbError = array_merge($dbError,
        deleteRowTwoCondition('email', $email, 'id', $id, $tableName, $connConfig)
      );
      if (!$dbError['error']) {
        $recivedData["code"] = 0;
      } else {
        $recivedData["code"] = 1; // DB error
        $recivedData["errorMsg"] = $dbError['errorMessage'];
      }
    } else {
      $recivedData["code"] = 2; // Invalid income data or budget config table doesn't exist
      $recivedData["errorMsg"] = "Invalid income data or budget config table doesn't exist";
    }
  }

  $recivedData["db"] = $dbError;
  echo json_encode($recivedData);
}