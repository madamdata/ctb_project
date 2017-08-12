<?php

$file = fopen("foo.txt", "w") or die ("Unable to open file :/");
//$vol = $_POST["Volume"] . "\n";
//$pitch = $_POST["Pitch"] . "\n";
//fwrite($file, $vol);
//fwrite($file, $pitch);
//$params = $_POST['0'];
$jsondata = $_POST["data"];
fwrite($file, $jsondata);
fclose($file);

?>
