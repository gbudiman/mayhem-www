<?php
$db = new PDO('sqlite:../../../mayhem-overseer/casting.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
if (!$db) die ('Database offline. Please check back later...');

$sql = 'SELECT * FROM Log';
echo '<pre>';
foreach ($db->query($sql) as $row) {
	$humanDate = getdate($row['Timestamp']);
	echo $humanDate['year'] .'-' .$humanDate['month'] .'-' .$humanDate['mday']
		.': ' .$row['IPAddress'] .' (' 
		.$row['Seeking'] .'|' .$row['States'] .'|' .$row['Nudity'] .'|' .$row['Compensation']
		.') ' .$row['UserAgent'] .'\n'; 
}
echo '</pre>';
?>