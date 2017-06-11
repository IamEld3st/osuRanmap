var apiKEY,
	minDiff,
	maxDiff,
	mapSets = [],
	beatMapsData = [];

$('#loading').hide();

$('#btnGenerate').on('click', function () {
	$('#loading').show();
	$('#data').empty();
	mapSets = [];
	beatMapsData = [];
	console.log("btnGenerate pressed!");
	apiKEY = $('#apiKey').val();
	minDiff = $('#minDiff').val();
	maxDiff = $('#maxDiff').val();
	console.log("Set values apiKEY: "+apiKEY+" | minDiff: "+minDiff+" | maxDiff: "+maxDiff);
	var starRange = "("+minDiff+","+maxDiff+")";
	console.log("Star range: "+starRange);
	$.get('https://cors-anywhere.herokuapp.com/https://osusearch.com/random/', { statuses: "Ranked", modes: "Standard", star: starRange })
		.done(function(response){
			console.log("Got response!");
			$('#data').append(response);
			var setItem = 0;
			console.log("Got these Mapsets:");
			$('td').each(function(i){
				if(setItem === 0){
					console.log($(this).text());
					mapSets.push($(this).text());
				}
				setItem += 1;
				if(setItem === 4){setItem = 0};
			});
			console.log("Got "+mapSets.length+" Mapsets");
			$('#data').empty();
			setItem = mapSets.length-1;
			var responseCheck = 1;
			var mapsetInfoTimer = setInterval(getMapsetData, 2000);
			var responseCheckTimer = setInterval(responseCheckFunc, 100);
			function getMapsetData(){
				var mapSet = mapSets[setItem];
				setItem -= 1;
				console.log("Getting beatmaps for "+mapSet+" mapset");
				$.get('https://osu.ppy.sh/api/get_beatmaps', { k: apiKEY, s: mapSet, m: 0, }).done(function(response){
					console.log("Got response with "+response.length+" beatmaps");
					for (var i = response.length - 1; i >= 0; i--) {
						if(response[i].approved === 1){if(response[i].difficultyrating >= minDiff && response[i].difficultyrating <= maxDiff){beatMapsData.push(response[i])}}
					}
					responseCheck += 1;
				});
				if (setItem === 0) {
					clearInterval(mapsetInfoTimer);
				}
			}
			function responseCheckFunc(){
				if (responseCheck === mapSets.length) {
					clearInterval(responseCheckTimer);
					afterResponse();
				}
			}
			function afterResponse(){
				console.log("Got "+beatMapsData.length+" beatmaps");
				$('#loading').hide();
				$("#data").append("<table class=\"table table-condensed\" id=\"beatmapsTable\"><tr><th>Beatmap ID</th><th>Name</th><th>Mapper</th><th>Stars</th></tr></table>");
				for (var i = beatMapsData.length - 1; i >= 0; i--) {
					var bm = beatMapsData[i];
					var data2Append = "<tr><td>"+bm.beatmap_id+"</th><th>"+bm.artist+" - "+bm.title+" ["+bm.version+"]"+"</th><th>"+bm.creator+"</th><th>"+bm.difficultyrating+"</th></tr>";
					$('#beatmapsTable').append(data2Append);
				}
			}
		});
});
