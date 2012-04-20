<?php
	ini_set('display_errors', 1);
	require_once('compensationdb.php');
	require_once('towndb.php');
	require_once('logger.php');
	$db = new PDO('sqlite:../../../mayhem-overseer/casting.db');
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	if (!$db) die ('Database offline. Please check back later...');

	/*$canadaStates = array("Alberta"
					, "British Columbia"
					, "Manitoba"
					, "Newfoundland and Labrador"
					, "New Brunswick"
					, "Northwest Territories"
					, "Nova Scotia"
					, "Nunavut"
					, "Ontario"
					, "Prince Edward Island"
					, "Quebec"
					, "Saskatchewan"
					, "Yukon Territory");*/

	$debugResponse = '';
	$sql = "SELECT MAX(Runtime) AS Runtime FROM Caster";
	foreach ($db->query($sql) as $row) {
		$date = '"' .$row['Runtime'] .'"';
	}

	if (!in_array("0", $_POST['states'])) {
		$statePlaceholder = rtrim(str_repeat('?, ', count($_POST['states'])), ', ');
	}
	if ($_POST['nudity'] === '2') {
		$nudityValues = Array(0, 1);
		$nudityPlaceholder = '?, ?';
		$nudityURL = '';
	}
	else {
		$nudityValues = Array($_POST['nudity']);
		$nudityPlaceholder = '?';
		$nudityURL = $_POST['nudity'];
	}

	// Prepare SQL statement
	// Order:
	// - Seeking
	// - Nudity
	// - Runtime
	// - Compensation
	// - Country
	// - State[]
	$query = "SELECT
					Caster.Town AS Town
					, Caster.State AS State
					, COUNT(*) AS count
				FROM Caster INNER JOIN Seek ON Caster.ID = Seek.ID
				WHERE Seek.Seeking = ?
					AND Seek.Runtime = $date\n";
	$query .= "	AND Caster.Nudity IN ($nudityPlaceholder)			
				AND Caster.Runtime = $date\n";
	if ($_POST['compensation'] !== '0') {
		$query .= " AND Caster.Compensation = ? \n";
	}
	$query .= " AND Caster.Country IN ? \n";
	if (!in_array("0", $_POST['states'])) {
		$query .= " AND Caster.State IN ($statePlaceholder)\n";
	}
	$query .= " GROUP BY Caster.Town, Caster.State
				ORDER BY 3 DESC";

	// Load values to prepared statement
	$executeArray = array($_POST['seeking']);
	foreach ($nudityValues as $n) {
		array_push($executeArray, $n);
	}

	if ($_POST['compensation'] !== '0') {
		array_push($executeArray, $_POST['compensation']);
	}
	array_push($_POST['country']);
	if (!in_array("0", $_POST['states'])) {
		foreach ($_POST['states'] as $s) {
			array_push($executeArray, $s);
		}
	}
	
	//echo $date;
	//print_r($_POST);
	//echo $query;
	//print_r($executeArray);
	$logging = array("Timestamp" => $_SERVER['REQUEST_TIME']
					, "UserAgent" => $_SERVER['HTTP_USER_AGENT']
					, "IPAddress" => $_SERVER['REMOTE_ADDR']
					, "Seeking" => $_POST['seeking']
					, "Country" => $_POST['country']
					, "States" => ($_POST['states'] === '0' ? '0' : implode(',', $_POST['states']))
					, "Nudity" => $_POST['nudity']
					, "Compensation" => ($_POST['compensation'] === '0' ? '0' : $_POST['compensation']));
	$debugResponse .= logger($db, $logging);
	
	try {
		$statement = $db->prepare($query);
		$resource = $statement->execute($executeArray);
	}
	catch (Exception $e) {
		echo "Exception raised";
		echo $e->getMessage();
	}
	
	if ($resource) {
		$response = array();
		
		while ($row = $statement->fetch()) {
			$urlForm = 'http://www.modelmayhem.com/casting/result/?'
				.'fm_action=Search'
				.'&search_type=casting for'
				.'&m_search_type[]=' .$_POST['seeking']
				.'&cc_country=' .array_search($row['Country'], $countryDict)
				.'&cc_state=' .array_search($row['State'], $stateDict)
				.'&cc_city=' .array_search($row['Town'], $townDict[$row['Country'][$row['State']]])
				.'&search_mile_range=0.05'
				.'&fm_button=+'
				.'&search_start_date='
				.'&search_end_date'
				.'&search_include_cc=cc'
				.'&c_compensation=' .($_POST['compensation'] === '0' ? '' : array_search($_POST['compensation'], $compensationDict))
				.'&c_18=' .$nudityURL
				.'&search_keyword='
				.'&search_mm_id=';
			$response[trim($row['Town']) .", " .trim($row['State'])] = 
				array('count' => (int)$row['count'],
					'url' => $urlForm);
		}
		echo json_encode(array("debug" => $debugResponse, "core" => $response));
	}
	else {
		echo 'Malformed response';
	}
	
?>
