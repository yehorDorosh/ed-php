<?php
  //phpinfo();
?>
<?php if (getenv('ENV_MODE') === "prod") : ?>
  <script>
    window.ENV_MODE = "prod";
  </script>
<?php endif ?>
<?php require_once './app.php'?>
<?php if ($phpAlert) : ?>
  <div><?php print $phpAlert ?></div>
<?php endif ?>
<form action="<?php echo $_SERVER["PHP_SELF"];?>" method="POST">
  <div>
    <label for="input-text">Save var: </label>
    <input id="input-text" type="text" name="saveVarName" placeholder="text"/>
    <input id="input-text" type="text" name="saveVarValue" placeholder="text"/>
  </div>
  <div>
    <label for="input-text">Read var: </label>
    <input id="input-text" type="text" name="readVarName" placeholder="text"/>
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
<script src="./js/test-app.js"></script>