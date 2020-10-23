<?php
  header("Access-Control-Allow-Origin: *");
  $coachid = $_GET["coachid"];
  $schid = $_GET["schid"];
  echo shell_exec("./delsch.sh $coachid $schid");
?>