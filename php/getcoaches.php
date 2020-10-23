<?php
    header("Access-Control-Allow-Origin: *");
    echo shell_exec("./getcoaches.sh");
?>
