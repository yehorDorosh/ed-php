<?php
include "$_SERVER[DOCUMENT_ROOT]/php/db.php";
include "$_SERVER[DOCUMENT_ROOT]/php/headers.php";
include "$_SERVER[DOCUMENT_ROOT]/php/main-db-config.php";

$dbError = [
  "error"=>FALSE,
  "errorMessage"=>""
];

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
