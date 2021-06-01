<?php
include "$_SERVER[DOCUMENT_ROOT]/php/db.php";
include "$_SERVER[DOCUMENT_ROOT]/php/headers.php";
include "$_SERVER[DOCUMENT_ROOT]/php/main-db-config.php";

$dbError = [
  "error"=>FALSE,
  "errorMessage"=>""
];

function addCategory($newCategoryName, $categoryType, $userConfigTable, $connConfig, &$dbError) {
  $newCategoryName = trim($newCategoryName);
  $response = readCellFromRow('parameter', $categoryType, 'value', $userConfigTable, $connConfig);
  if($response['error']) {
    $dbError = $response;
    return;
  }
  $categoryArr = json_decode($response['data']);
  if (in_array($newCategoryName, $categoryArr)) return json_encode($categoryArr);
  array_push($categoryArr, $newCategoryName);
  return json_encode($categoryArr);
}

if (
  $_SERVER["REQUEST_METHOD"] == "GET" &&
  $_GET["email"] &&
  $_GET["categoryType"]
  ) {
    $userName = strstr($_GET["email"], "@", true);
    $userConfigTable = $userName;

    if ($_GET["categoryType"] === 'expense') {
      $targetRow = 'Expense categories';
    } else if ($_GET["categoryType"] === 'income') {
      $targetRow = 'Income categories';
    } else {
      $targetRow = '';
    }

    $response = array_merge($dbError,
    readCellFromRow('parameter', $targetRow, 'value', $userConfigTable, $connConfig)
    );
    echo json_encode($response);
}

if ($_SERVER["REQUEST_METHOD"]) {
  $recivedData = json_decode(file_get_contents('php://input'), true);
  if (is_array($recivedData)) {
    $email = $recivedData["email"];
    $userName = strstr($email, "@", true);
    if ($recivedData["categoryName"] && checkTable($userName, $connConfig)) {
      if ($recivedData["categoryType"] === 'expense') {
        $newCategoryList = addCategory($recivedData["categoryName"], 'Expense categories', $userName, $connConfig, $dbError); 
        $dbError = saveValueToDbCell('Expense categories', 'parameter', $newCategoryList, 'value', $userName, $connConfig);
        if (!$dbError["error"]) $recivedData["code"] = 0;
      } else if ($recivedData["categoryType"] === 'income') {
        $newCategoryList = addCategory($recivedData["categoryName"], 'Income categories', $userName, $connConfig, $dbError);
        $dbError = saveValueToDbCell('Income categories', 'parameter', $newCategoryList, 'value', $userName, $connConfig);
        if (!$dbError["error"]) $recivedData["code"] = 0;
      } else {
        $recivedData["code"] = 1; // Uncknown type
        $recivedData["errorMsg"] = "Unknown category type";
      }
    } else {
      $recivedData["code"] = 2; // Invalid category name or user config table doesn't exist
      $recivedData["errorMsg"] = "Invalid category name or user config table doesn't exist";
    }
    
    $recivedData["db"] = $dbError;
    echo json_encode($recivedData);
  }
}