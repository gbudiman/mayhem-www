<?php
function logger($db, $t) {
	$query = 'INSERT INTO Log ("Timestamp", "UserAgent", "IPAddress", "Seeking", "Country", "States", "Nudity", "Compensation")
			VALUES('
			.$t['Timestamp'] .', '
			.'"' .$t['UserAgent'] .'", '
			.'"' .$t['IPAddress'] .'", '
			.$t['Seeking'] .', '
			.'"' .$t['Country'] .'", '
			.'"' .$t['States'] .'", '
			.$t['Nudity'] .', '
			.'"' .$t['Compensation'] .'")';
	try {
		$db->query($query);
	} catch (Exception $e) {
		return $e->getMessage();
	}
	return 0;
}