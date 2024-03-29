function loadVisualization(init) {
	if (init == 0) {
		loadStates();
	}
	var options = {
		region: $('#country option:selected').val(),
		displayMode: 'markers',
		resolution: 'provinces',
		enableRegionInteractivity: true,
		colorAxis: {colors: ['#FF0000', '#00FF00', '#0000FF']}
	};
	var geochart = new google.visualization.GeoChart(
		document.getElementById('visualization'));
	google.visualization.events.addListener(geochart, 'regionClick', function(e) { regionClicked(e); });
	var mxdata = new google.visualization.DataTable();
	mxdata.addColumn('string', 'Hotspot');
	mxdata.addColumn('number', 'Casting Count');
	if (init != 0) {
		$('#status').html("Fetching data...");
		var jsonRequest = $.ajax({
			type: "POST",
			url: "./scripts/populate.php",
			data: { 'seeking' : $("#seeking").val()
					, 'country' : $("#country").val()
					, 'states' : $("#stateSelector").val()
					, 'nudity' : $("input[name='nudity']:checked").val()
					, 'compensation' : $("input[name='compensation']:checked").val() },
			dataType: "json"	
		}).done(function(t) {
			var chartData = [];
			$.each(t.core, function(index, value) {
				chartData.push([index, value.count]);	
			});
			mxdata.addRows(chartData);
			updateTable(t.core);
			$('#status').html("");
			
			geochart.draw(mxdata, options);
		});
	}
	else {		
		geochart.draw(mxdata, options);
	}
}

function loadStates() {
	var lstate;
	$("#stateSelector").empty();
	switch ($('#country option:selected').val()) {
		case 'US':
			lstate = new Array(
				'Alabama'
				, 'Alaska'
				, 'Arizona'
				, 'Arkansas'
				, 'California'
				, 'Colorado'
				, 'Connecticut'
				, 'Delaware'
				, 'District of Columbia'
				, 'Florida'
				, 'Georgia'
				, 'Hawaii'
				, 'Idaho'
				, 'Illinois'
				, 'Indiana'
				, 'Iowa'
				, 'Kansas'
				, 'Kentucky'
				, 'Louisiana'
				, 'Maine'
				, 'Maryland'
				, 'Massachusetts'
				, 'Michigan'
				, 'Minnesota'
				, 'Mississippi'
				, 'Missouri'
				, 'Montana'
				, 'Nebraska'
				, 'Nevada'
				, 'New Hampshire'
				, 'New Jersey'
				, 'New Mexico'
				, 'New York'
				, 'North Carolina'
				, 'North Dakota'
				, 'Ohio'
				, 'Oklahoma'
				, 'Oregon'
				, 'Pennsylvania'
				, 'Rhode Island'
				, 'South Carolina'
				, 'South Dakota'
				, 'Tennessee'
				, 'Texas'
				, 'Utah'
				, 'Vermont'
				, 'Virginia'
				, 'Washington'
				, 'Washington Dc'
				, 'West Virginia'
				, 'Wisconsin'
				, 'Wyoming');
		break;
		case 'CA': {
			lstate = new Array('Alberta'
				, 'British Columbia'
				, 'Manitoba'
				, 'New Brunswick'
				, 'Newfoundland and Labrador'
				, 'Northwest Territories'
				, 'Nova Scotia'
				, 'Nunavut'
				, 'Ontario'
				, 'Prince Edward Island'
				, 'Quebec'
				, 'Saskatchewan'
				, 'Yukon');
		}
		break;
	}
	$("#stateSelector")
		.append($("<option></option>")
			.attr("value", 0)
			.attr("selected", "selected")
			.text("Select All"));
	$.each(lstate, function(k, v) {
		$("#stateSelector")
			.append($("<option></option>")
				.attr("value", v)
				.text(v));
	});
}

function regionClicked(e) {
	var statePair = {'CA-AB': 'Alberta',
						'CA-BC': 'British Columbia',
						'CA-MB': 'Manitoba',
						'CA-NB': 'New Brunswick',
						'CA-NL': 'Newfoundland and Labrador',
						'CA-NT': 'Northwest Territories',
						'CA-NS': 'Nova Scotia',
						'CA-NU': 'Nunavut',
						'CA-ON': 'Ontario',
						'CA-PE': 'Prince Edward Island',
						'CA-QC': 'Quebec',
						'CA-SK': 'Saskatchewan',
						'CA-YT': 'Yukon',
						'US-AL': 'Alabama',
						'US-AK': 'Alaska',
						'US-AZ': 'Arizona',
						'US-AR': 'Arkansas',
						'US-CA': 'California',
						'US-CO': 'Colorado',
						'US-CT': 'Connecticut',
						'US-DE': 'Delaware',
						'US-DC': 'District of Columbia',
						'US-FL': 'Florida',
						'US-GA': 'Georgia',
						'US-HI': 'Hawaii',
						'US-ID': 'Idaho',
						'US-IL': 'Illinois',
						'US-IN': 'Indiana',
						'US-IA': 'Iowa',
						'US-KS': 'Kansas',
						'US-KY': 'Kentucky',
						'US-LA': 'Louisiana',
						'US-ME': 'Maine',
						'US-MD': 'Maryland',
						'US-MA': 'Massachusetts',
						'US-MI': 'Michigan',
						'US-MN': 'Minnesota',
						'US-MS': 'Mississippi',
						'US-MO': 'Missouri',
						'US-MT': 'Montana',
						'US-NE': 'Nebraska',
						'US-NV': 'Nevada',
						'US-NH': 'New Hampshire',
						'US-NJ': 'New Jersey',
						'US-NM': 'New Mexico',
						'US-NY': 'New York',
						'US-NC': 'North Carolina',
						'US-ND': 'North Dakota',
						'US-OH': 'Ohio',
						'US-OK': 'Oklahoma',
						'US-OR': 'Oregon',
						'US-PA': 'Pennsylvania',
						'US-RI': 'Rhode Island',
						'US-SC': 'Soutch Carolina',
						'US-SD': 'South Dakota',
						'US-TN': 'Tennessee',
						'US-TX': 'Texas',
						'US-UT': 'Utah',
						'US-VT': 'Vermont',
						'US-VA': 'Virginia',
						'US-WA': 'Washington',
						'US-WV': 'West Virginia',
						'US-WI': 'Wisconsin',
						'US-WY': 'Wyoming'};
	$('#stateSelector option[value=0]').attr("selected", false);
	$('#stateSelector option[value="' + statePair[e.region] + '"]').attr("selected", "selected");
}

function clearState() {
	$("#stateSelector option:selected").removeAttr('selected');
	$('#stateSelector option[value=0]').attr("selected", true);
}

function updateTable(t) {
	$(".tablescroll_head").empty();
	$("#castingTable").empty();
	$("#castingTable").append('<thead><tr><td>State</td><td>Town</td><td>Total</td></tr></thead><tbody>');
	$.each(t, function(l, value) {
		hotspot = l.split(',');
		$("#castingTable").append('<tr><td>' + hotspot[1] + '</td><td>' + hotspot[0] + '</td>'
								+ '<td class="numeric"><a target="_blank" href="' + value.url + '">' 
								+ value.count + '</a></td></tr>');
	});
	$("#castingTable").append('</tbody>');
	$("#castingTable tr:even").addClass("alt");
	$(".tablescroll_head").first().remove();
	$.fn.tableScroll.defaults =
	{
		flush: true, // makes the last thead and tbody column flush with the scrollbar
		width: null, // width of the table (head, body and foot), null defaults to the tables natural width
		height: 512,
		containerClass: 'tablescroll' // the plugin wraps the table in a div with this css class
	};
	
	jQuery(document).ready(function($)
	{
		//$('#castingTable').tableScroll({height:800});
	
		// other examples
	
		// sets the table to have a scrollable area of 200px
		//$('#castingTable').tableScroll({height:200});
	
		// sets a hard width limit for the table, setting this too small
		// may not always work
		$('#castingTable').tableScroll({width:328});
	
		// by default the plugin will wrap everything in a div with this
		// css class, if it finds that you have manually wrapped the
		// table with a custom element using this same css class it
		// will forgo creating a container DIV element
		//$('#castingTable').tableScroll({containerClass:'myCustomClass'});
	});
}
