<?php
// File Name: proxy.php
// reference: http://stackoverflow.com/questions/12683530/origin-http-localhost-is-not-allowed-by-access-control-allow-origin
if (!isset($_GET['url'])) die();
$url = $_GET['url'];
$urlFlat = 'http://' . str_replace('http://', '', $url);
$urlFile = str_replace('http://', '', $url);
$urlFile = str_replace('/', '@', $urlFile);
$urlFile = str_replace('&', '@', $urlFile);
$urlFile = str_replace('?', '@', $urlFile);
$urlFile = str_replace('.', '@', $urlFile);
$urlFile = "results/".$urlFile.".json";

if(file_exists("../".$urlFile)){
			$host  = $_SERVER['HTTP_HOST'];			
			$uri   = rtrim(dirname(dirname($_SERVER['PHP_SELF'])), '/\\');
			header("Content-Type: application/json; charset=utf-8");
			header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
		    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
		    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
		    header("Cache-Control: post-check=0, pre-check=0", false);
		    header("Pragma: no-cache");
			header("Location: http://$host$uri/$urlFile");			
			exit;
}else{

			$dataResult = file_get_contents($urlFlat);
			$fp = fopen("../".$urlFile,'w');
			fwrite($fp,utf8_encode($dataResult));
			fclose($fp);
			header("Content-Type: application/json; charset=utf-8");
			header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
		    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
		    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
		    header("Cache-Control: post-check=0, pre-check=0", false);
		    header("Pragma: no-cache");
		    echo utf8_encode($dataResult);
}
?>