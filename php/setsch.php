<?php
    header("Access-Control-Allow-Origin: *");
    $data = sprintf('\'{
        "firstName": "%s",
        "lastName": "%s",
        "dayOfTheWeek": "%s",
        "startTime": "%s",
        "endTime": "%s"
    }\'', $_GET["firstname"], $_GET["lastname"], $_GET["day"], $_GET["start"], $_GET["end"]);
    $id = $_GET["id"];
    #echo $data;
    echo shell_exec("./setsch.sh $data $id");
?>
