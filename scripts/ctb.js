

$(document).ready(function(){


	function generateGrid( rows, cols ) {					//starting grid with 8 x 16
		var grid = "<table>";
		for ( row = 0; row < rows; row++ ) {	
			grid += "<tr id="+row+">"; 						//gives each row a unique ID number when made
			for ( col = 0; col < cols; col++ ) {      
				grid += "<td row="+row+" col="+col+"></td>"; //each cell has a 'row' and 'col' attribute	
			}												//the coordinate style can be changed to whatever works best i just used this because i could 
			grid += "</tr>"; 
		}
		return grid;
	}

	$( "#tableContainer" ).append( generateGrid( 8, 16) );	//this applies the JS code above to the DOM making the grid visible

	$( "td" ).click(function() {
		//var index = $( "td" ).index( this );
		var row = $(this).attr('row');
		var col = $(this).attr('col');
		var state = 0; 
		$( this ).toggleClass('clicked');					//this adds the class 'clicked' to a cell, it's a toggle and can turn off again with a single click
		if ($(this).hasClass('clicked')) {state = 1}
		else {state = 0};
		//console.log(row,col,state);
		tog(row,col,state);

	});

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

	$('.play').click(function(){startsequence();});

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
