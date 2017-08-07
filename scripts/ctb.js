

$(document).ready(function(){

	//name various controls
	var tempoSlider = $("input[id$='temposlider']");
	var numStepsSlider = $("input[id$='numSteps']");
	var pitchSlider = $("input[id$='pitchslider']");
	var startSlider = $("input[id$='startslider']");
	var lengthSlider = $("input[id$='lengthslider']");
	var sampleSelectors = $("[name='sampleselector']");
	var tracksampleselectors = $("[id='tracksample']");
	var playButton = $("[id='play']");
	var stopButton = $("[id='stop']");
	var randomizeButton = $('.randomize');
	var resetButton = $("[id='reset']");

	//link controls to functions
	playButton.click(function(){startSequence();});
	stopButton.click(function(){stopSequence();});
	sampleSelectors.click(function(){selectSample(this.value)});
	tracksampleselectors.change(function() {changeTrackSample($(this).attr('tracknumber'),this.value)});
	tempoSlider.change(function() { changeTempo(this.value)});
	pitchSlider.change(function() { changePitch(this.value)});
	startSlider.change(function() { changeStart(this.value/1000)});
	lengthSlider.change(function() { changeLength(this.value/1000)});
	numStepsSlider.change(function() { changeNumSteps(this.value)});
	randomizeButton.click(function(){randomizeAll();});
	resetButton.click(function(){clearAll()});

	// function to generate a grid of buttons with row and column attributes
	function generateGrid( rows, cols ) {
		var grid = "<table>";
		for ( row = 0; row < rows; row++ ) {	
			grid += "<tr id="+row+">";
			for ( col = 0; col < cols; col++ ) {      
				grid += "<td row="+row+" col="+col+"></td>";
			};
			grid += "</tr>"; 
		}
		return grid;
	}


	//this applies the JS code above to the DOM making the grid visible
	$( "#tableContainer" ).append( generateGrid( 8, 16) );

	//click function
	$( "td" ).click(function() {
		var row = $(this).attr('row');
		var col = $(this).attr('col');
		var state = 0; 
		$( this ).toggleClass('clicked');
		if ($(this).hasClass('clicked')) {state = 1}
		else {state = 0};
		tog(row,col,state);

	});

	//submit new gridsize function - same as above with different parameters
	$('#sub').click(function(){
		$("#tableContainer").empty();
		var width = document.getElementById("value");
		width= parseInt(width.value);
		cols = width;
		function generateGrid( rows, cols ) {
			var grid = "<table>";
			for ( row = 0; row < rows; row++ ) {
				grid += "<tr id="+row+">"; 
				for ( col = 0; col < cols; col++ ) {      
					grid += "<td row="+row+" col="+col+"></td>";
				}
				grid += "</tr>"; 
			}
			return grid;
		}

		//draw grid
		$( "#tableContainer" ).append( generateGrid( 8, cols) );

		//resizeGrid is a sound.js function that lets the audio code know that the gridsize has changed.
		resizeGrid(cols);

		//make sure the Loop Length slider doesn't allow selecting a loop longer than the number of columns/steps
		numStepsSlider.prop("max", cols);

		$( "td" ).click(function() {
			var row = $(this).attr('row');
			var col = $(this).attr('col');
			var state = 0; 
			$( this ).toggleClass('clicked');
			if ($(this).hasClass('clicked')) {state = 1} else {state = 0};
			//trigger the function "tog" defined in sound.js
			tog(row,col,state);

		});

	});



	var rangeSlider = function(){
		var slider = $('.range-slider'),
			range = $('.range-slider__range'),
			value = $('.range-slider__value');

		slider.each(function(){

			value.each(function(){
				var value = $(this).prev().attr('value');
				$(this).html(value);
			});

			range.on('input', function(){
				$(this).next(value).html(this.value);
			});
		});
	};

	rangeSlider();


	$("div.step_settings").hide();
	$("input[name$='sampleselector']").click(function() {
		var test = $(this).val();
		$("div.step_settings").hide();
		$("#" + test).show();
	});

});
