

$(document).ready(function(){


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

	//name various controls
	var tempoSlider = $("input[id$='temposlider']");
	tempoSlider.change(function() { changeTempo(this.value)});
	var numStepsSlider = $("input[id$='numSteps']");
	numStepsSlider.change(function() { changeNumSteps(this.value)});

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

	//submit new gridsize function
	$('#sub').click(function(){								//this code is the same as the above except it deletes the old grid
		$("#tableContainer").empty();						//and makes a new one with the number of columns the user specified in the text box
		var width = document.getElementById("value");			//gets the value from the text box
		width= parseInt(width.value);							//changes the value from a string to an integer
		cols = width;											//reassigns the value to cols for the genereateGrid function
		function generateGrid( rows, cols ) {					//see above
			//this could have been neater but it works
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

		$( "#tableContainer" ).append( generateGrid( 8, cols) );
		resizeGrid(cols);
		numStepsSlider.prop("max", cols);

		$( "td" ).click(function() {
			//var index = $( "td" ).index( this );
			var row = $(this).attr('row');
			var col = $(this).attr('col');
			var state = 0; 
			$( this ).toggleClass('clicked');					//this adds the class 'clicked' to a cell, it's a toggle and can turn off again with a single click
			if ($(this).hasClass('clicked')) {state = 1}
			else {state = 0};
			//console.log(row,col,state);
			//trigger the function "tog" defined in sound.js
			tog(row,col,state);

		});

	});

	$('.randomize').click(function(){
		randomizeAll();
	});

	$("[id='play']").click(function(){startSequence();});
	$("[id='stop']").click(function(){stopSequence();});

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
	$("input[name$='stepselect']").click(function() {
		var test = $(this).val();
		$("div.step_settings").hide();
		$("#" + test).show();
	});

});
