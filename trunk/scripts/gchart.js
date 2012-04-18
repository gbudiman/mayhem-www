function loadVisualization(init) {
	var options = {
		region: 'US',
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
			data: $("#cquery").serialize(),
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

function regionClicked(e) {
	var statePair = {'AL': 'Alabama',
						'AK': 'Alaska',
						'AZ': 'Arizona',
						'AR': 'Arkansas',
						'CA': 'California',
						'CO': 'Colorado',
						'CT': 'Connecticut',
						'DE': 'Delaware',
						'DC': 'District of Columbia',
						'FL': 'Florida',
						'GA': 'Georgia',
						'HI': 'Hawaii',
						'ID': 'Idaho',
						'IL': 'Illinois',
						'IN': 'Indiana',
						'IA': 'Iowa',
						'KS': 'Kansas',
						'KY': 'Kentucky',
						'LA': 'Louisiana',
						'ME': 'Maine',
						'MD': 'Maryland',
						'MA': 'Massachusetts',
						'MI': 'Michigan',
						'MN': 'Minnesota',
						'MS': 'Mississippi',
						'MO': 'Missouri',
						'MT': 'Montana',
						'NE': 'Nebraska',
						'NV': 'Nevada',
						'NH': 'New Hampshire',
						'NJ': 'New Jersey',
						'NM': 'New Mexico',
						'NY': 'New York',
						'NC': 'North Carolina',
						'ND': 'North Dakota',
						'OH': 'Ohio',
						'OK': 'Oklahoma',
						'OR': 'Oregon',
						'PA': 'Pennsylvania',
						'RI': 'Rhode Island',
						'SC': 'Soutch Carolina',
						'SD': 'South Dakota',
						'TN': 'Tennessee',
						'TX': 'Texas',
						'UT': 'Utah',
						'VT': 'Vermont',
						'VA': 'Virginia',
						'WA': 'Washington',
						'WV': 'West Virginia',
						'WI': 'Wisconsin',
						'WY': 'Wyoming'};
	$('#stateSelector option[value=0]').attr("selected", false);
	$('#stateSelector option[value="' + statePair[e.region[3] + e.region[4]] + '"]').attr("selected", "selected");
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
