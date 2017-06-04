

$(document).ready(function(){

	

	function generateGrid( rows, cols ) {					//starting grid with 8 x 16
	    var grid = "<table>";
	    for ( row = 1; row <= rows; row++ ) {	
	        grid += "<tr id="+row+">"; 						//gives each row a unique ID number when made
	        for ( col = 1; col <= cols; col++ ) {      
	            grid += "<td id="+row+"x"+col+"></td>"; 	//gives each column cell a unique ID in relation to row ID thus making coords (eg 5x8, 1x16, 8x16, etc)
	        }												//the coordinate style can be changed to whatever works best i just used this because i could 
	        grid += "</tr>"; 
	    }
	    return grid;
	}

	$( "#tableContainer" ).append( generateGrid( 8, 16) );	//this applies the JS code above to the DOM making the grid visible

	$( "td" ).click(function() {
	    var index = $( "td" ).index( this );
	    var row = Math.floor( ( index ) / 5) + 1;
	    var col = ( index % 5 ) + 1;
	    
	    $( this ).toggleClass('clicked');					//this adds the class 'clicked' to a cell, it's a toggle and can turn off again with a single click
	});

	$('#sub').click(function(){								//this code is the same as the above except it deletes the old grid
		$("#tableContainer").empty();						//and makes a new one with the number of columns the user specified in the text box
	var width = document.getElementById("value");			//gets the value from the text box
	width= parseInt(width.value);							//changes the value from a string to an integer
	cols = width;											//reassigns the value to cols for the genereateGrid function
	function generateGrid( rows, cols ) {					//see above
															//this could have been neater but it works
	    var grid = "<table>";
	    for ( row = 1; row <= rows; row++ ) {
	        grid += "<tr id="+row+">"; 
	        for ( col = 1; col <= cols; col++ ) {      
	            grid += "<td id="+row+"x"+col+"></td>";
	        }
	        grid += "</tr>"; 
	    }
	    return grid;
	}

	$( "#tableContainer" ).append( generateGrid( 8, cols) );

	$( "td" ).click(function() {
	    var index = $( "td" ).index( this );
	    var row = Math.floor( ( index ) / 5) + 1;
	    var col = ( index % 5 ) + 1;
	   
	    $( this ).toggleClass('clicked');
	});
});

});
