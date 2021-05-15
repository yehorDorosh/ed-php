<?php //phpinfo(); ?>
<?php if (getenv('ENV_MODE') === "prod") : ?>
  <script>
    window.ENV_MODE = "prod";
  </script>
<?php endif ?>

<?php if ($phpAlert) : ?>
  <div><?php print $phpAlert ?></div>
<?php endif ?>
<form action="<?php echo $_SERVER["PHP_SELF"];?>" method="POST">
  <div>
    <label for="input-text">Save var: </label>
    <input id="input-text-1" type="text" name="saveVarName" placeholder="text"/>
    <input id="input-text-2" type="text" name="saveVarValue" placeholder="text"/>
  </div>
  <div>
    <label for="input-text">Read var: </label>
    <input id="input-text-3" type="text" name="readVarName" placeholder="text"/>
  </div>
  <div>
    <button type="submit" name="send" value="send">Send</button>
  </div>
  <div>
    <button type="submit" name="clear" value="clear">Clear</button>
  </div>
</form>
<button onclick="checkApi()">Check api</button>
<button onclick="checkApiGet()">Check api Get</button>
<button onclick="checkApiDelete()">Check api Delete</button>
<br>
<?php
  if(isset($_POST["clear"])) {
    clearTable($varsTableName, $connConfig);
  }
  
  if (
    $_SERVER["REQUEST_METHOD"] == "POST" &&
    $_POST["saveVarName"] &&
    $_POST["saveVarValue"] &&
    isset($_POST["send"])
    ) {
      $response = saveVarToDb($_POST["saveVarName"], $_POST["saveVarValue"], $varsTableName, $connConfig);
      if ($responseTable["error"]) {
        echo $responseTable["errorMessage"];
      }
  }
  
  if (
    $_SERVER["REQUEST_METHOD"] == "POST" &&
    $_POST["readVarName"] &&
    isset($_POST["send"])
    ) {
      $response = readVarFromDb($_POST["readVarName"], $varsTableName, $connConfig);
      $phpAlert = $response["data"] . "<br>";
  }
  
  $responseTable = printVarTable($varsTableName, $connConfig);
  if ($responseTable["error"]) {
    echo $responseTable["errorMessage"];
  }
?>
<br>
<script src="./js/test-app.js"></script>