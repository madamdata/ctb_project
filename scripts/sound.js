var audioCtx = new (window.AudioContext || window.webkitAudioContext);
var numSamples = 8;
var numSteps = 16;
var maxSteps = 64;
var gridSize = 16;
var sequences;
var params = [{},{},{},{},{},{},{},{}];
var synths = [0,0,0,0,0,0,0,0];
var step = 0;
var bpm = 180;
var loop;
var allsaves;
//var samplebank = [
	//"./samples/ctbseqchords.wav",
	//"./samples/min_kick_13_E.wav",
	//"./samples/mkbsnare2.wav",
	//"./samples/TL-60Hat_C04.wav",
	//"./samples/TL-60Hat_O04.wav",
	//"./samples/crackle1-0.wav",
	//"./samples/cracklePew1-1.wav",
	//"./samples/TL-60Snare61.wav"
//];
var samplebank = [
	"samples/YAW Drum Kit Cymbal.wav",
	"samples/YAW Drum Kit Kick.wav",
	"samples/YAW Drum Kit Shaker.wav",
	"samples/YAW Drum Kit Snare.wav",
	"samples/YAW Drum Kit Tom.wav",
	"samples/Air Conditioner, Chinatown.wav",
	"samples/Baby At Home.wav",
	"samples/Birds Chirping, Chinatown.wav",
	"samples/Community Meeting, Chinatown.wav",
	"samples/Construction, Chinatown.wav",
	"samples/Cooking Dinner.wav",
	"samples/Dinner Break.wav",
	"samples/Fountain, Franklin Square Park.wav",
	"samples/Freshen Up, Sunday Breakfast Rescue Mission.wav",
	"samples/Locking up, Asian Arts Initiative.wav",
	"samples/Moving Boxes, Chinatown.wav",
	"samples/Moving Cart, Chinatown.wav",
	"samples/Music Playing in Restaurant, Chinatown.wav",
	"samples/Office Sounds, Sunday Breakfast Rescue Mission.wav",
	"samples/Passing Cars, 13th and Vine.wav",
	"samples/Race-Vine Station.wav",
	"samples/Restaurant, Chinatown.wav",
	"samples/Sirens, 10th and Race.wav",
	"samples/the Broad Street Line.wav",
	"samples/The Commute, Asian Arts Initiative.wav",
	"samples/Throwing Rocks, Pearl St Viaduct.wav",
	"samples/Walk Sign is On, 10th and Callowhill.wav",
	"samples/Walk Sign is On, 11th and Callowhill.wav",
];
var totalSamples = samplebank.length;
var currentSample = 0;

//ajax var ajaxrequest = new XMLHttpRequest()

// CREATE SYNTHS AND INITIALIZE PARAMS
for (i = 0; i<8; i++) {
	params[i] = {
		Pitch: 0,
		Volume: -10,
		Start: 0,
		Length: 0.35,
	};
	synths[i] = new Tone.Sampler(samplebank[i]);
	//synths[i].buffer = buffers[i];
	synths[i].toMaster();
	synths[i].volume.value = -10
	synths[i].player.loop = false;
};

// DEFINE FUNCTIONS

function populateSampleMenu() {
	var tracksampleselectors = $('.tracksample');
	for (var i = 0; i < samplebank.length; i++) {
		//$("[id='tracksample']")
		var samplename = samplebank[i].replace(/^.*(\\|\/|\:)/, '').replace('.wav', '').substring(0,22);
		var optionstring = "<option value='" + i + "'>" + samplename + "</option>";
		tracksampleselectors.append(optionstring);
	};
	for (i=0;i<8;i++) {
		var track = $("[class$='tracksample rounded'][tracknumber="+i+"]");
		track.val(i);
	};
};
populateSampleMenu();

function createSequence(nsamp,nsteps) {
	sequences = new Array(nsamp);
	for (var i = 0; i < nsamp; i++) {
		sequences[i] = new Array(nsteps);
		sequences[i].fill(0);
	}
};

function testnote(freq, duration) {
	sine.frequency.value = freq;
	sine.start(audioCtx.currentTime);
	sine.stop(audioCtx.currentTime + duration);
};

function tog(row,column,state) {
	sequences[row][column] = state;
};

function randomizeAll() {
	$("td").removeClass('clicked');
	for (i=0;i<8;i++) {
		for (j=0;j<gridSize;j++) {
			stepvalue = Math.round(Math.random()-0.3);
			sequences[i][j]=stepvalue
			if (stepvalue==1) {
				thisstep = $("[row="+i+"][col="+j+"]");
				thisstep.addClass('clicked');
			}
		}
	}
};

function clearAll() {
	$("td").removeClass('clicked');
	for (i=0;i<8;i++) {
		for (j=0;j<gridSize;j++) {
			sequences[i][j] = 0;
		}
	}
}

//updateGUI() checks the sequence array and makes sure the grid reflects the states of each step
function updateGUI() {
	for (i=0;i<8;i++) {
		for (j=0;j<gridSize;j++) {
			thisstep = $("[row="+i+"][col="+j+"]");
			if (sequences[i][j] == 1) {
				if (!(thisstep.hasClass('clicked'))) {
					thisstep.addClass('clicked');
				};
			} else {
				if (thisstep.hasClass('clicked')) {
					thisstep.removeClass('clicked');
				};
			}
		}
	}
}

function clearBlink() {
	$("td").removeClass('highlight');
}

//transport functions
function startSequence() {
	Tone.Transport.start('+0.05');
	loop.start();
	Tone.Transport.bpm.value = bpm;
}

function stopSequence() {
	Tone.Transport.stop();
	clearBlink();
	step = 0;
}

//global playback functions

function selectSample(which) {
	currentSample = which;
	updateSliders();
}

function changeTrackSample(track, sample) {
	//console.log(synths[track].player);
	synths[track].player.load(samplebank[sample]);
}

//         updates the pitch, start and end sliders to reflect current sample parameters
function updateSliders() {
	var pitchSlider = $("input[id$='pitchslider']");
	var startSlider = $("input[id$='startslider']");
	var lengthSlider = $("input[id$='lengthslider']");
	var volumeSlider = $("input[id$='volumeslider']");
	var pitchDisplay = $("[id='pitchsliderdisplay']");
	var startDisplay = $("[id='startsliderdisplay']");
	var lengthDisplay = $("[id='lengthsliderdisplay']");
	var volumeDisplay = $("[id='volumesliderdisplay']");
	var currentPitch = params[currentSample].Pitch;
	var currentStart = params[currentSample].Start;
	var currentLength = params[currentSample].Length * 1000;
	var currentVolume = params[currentSample].Volume;
	pitchSlider.val(currentPitch);
	pitchDisplay.html(currentPitch);
	startSlider.val(currentStart);
	startDisplay.html(currentStart);
	lengthSlider.val(currentLength);
	lengthDisplay.html(currentLength);
	volumeSlider.val(currentVolume);
	volumeDisplay.html(currentVolume);
}

function changeTempo(tempo) {
	bpm = tempo
	Tone.Transport.bpm.value = tempo
}

function changeNumSteps(number) {
	numSteps = number;
}

function resizeGrid(number) {
	if (numSteps > number) {
		numSteps = number
	};
	gridSize = number;
	updateGUI();
}

//individual sample playback functions
// called by the pitch slider, modifies the pitch of the current sample
function changePitch(value) {
	params[currentSample].Pitch = value;
}

function changeStart(value) {
	params[currentSample].Start = value;
}

function changeLength(value) {
	params[currentSample].Length = value;
}

function changeVolume(value) {
	params[currentSample].Volume = value;
}

//SAVING AND LOADING

function sendData(stuffToSend) {
	var jsonstring = JSON.stringify(stuffToSend);
	var request = $.ajax({
		url: "saves/save.php",
		type: "post",
		data: {data:jsonstring},
	});
}

function getData(url, func) {
	var request = $.ajax({
		url:url,
		type: "get",
	});
	request.done(func);
}

function validateEmail(email) {

}

function validateUserName(username) {
	var re = /^[a-z0-9]+$/i;
	return re.test(username);
}
	
function submitComp() {
	//console.log(params);
	var userid = $("[id$='useridinput']").val();
	var emailaddress = $("[id$='emailinput']").val();
	var newdata = {user:userid, email:emailaddress, params:params, sequences:sequences};
	var olddata;
	if (validateUserName(userid)) {
	var getOld = $.ajax({
		url: "saves/foo.txt",
		type: "get",
	});
	//if save file doesn't exist, initialize an empty array
	getOld.fail(function(response) {
		olddata = [];
		olddata.push(newdata);
		sendData(olddata);
	});

	// if save file exists, read contents into an array and append the new data
	getOld.done(function(response) {
		olddata = JSON.parse(response); 
		//push the new data onto the end of old data
		olddata.push(newdata);
		sendData(olddata);
	});
	} else {console.log("ERROR BAD USERNAME")};
} 

//display list of all saved compositions
function browseComps() {
	var listbox = $("[id$='listofcomps']");
	var usernames = [];
	listbox.empty();
	getData("saves/foo.txt", function(response) { 
		var saved = JSON.parse(response);
		for (i=0;i<(saved.length);i++) {
			usernames.push(saved[i].user);
		};
		console.log(usernames);
		for (i=0;i<(usernames.length);i++) {
			var optionstring = "<option value="+i+">"+usernames[i]+"</option>";
			listbox.append(optionstring);
		};
		allsaves = saved;
	});
}

function loadComp() {
	var listbox = $("[id$='listofcomps']");
	var selectedcomp = allsaves[listbox.val()];
	params = selectedcomp.params;
	sequences = selectedcomp.sequences;
	updateGUI();
	updateSliders();

}

//make blank sequences
createSequence(numSamples, maxSteps);

//start the loop
var chord = [0, 3, 5, 7, 10, 14, 12, 2];

loop = new Tone.Loop(function(time){
		const twelfthroot = Math.pow(2, (1/12));
		prevstep = step;
		step = (step + 1) % numSteps;
		for (i = 0; i < 8; i++) {
			//var note = Tone.Frequency(chord[i]+60, "midi").toNote();
			if (sequences[i][step] == 1) {
				var note = params[i].Pitch;
				var start = params[i].Start * synths[i].player.buffer.duration;
				var length = params[i].Length;
				var volume = params[i].Volume;
				//synths[i].player.loopStart = start;
				synths[i].volume.value = volume;
				synths[i].player.playbackRate = Math.pow(twelfthroot, note);
				synths[i].player.start((time+0.01),start, length);
				synths[i].envelope.triggerAttackRelease(length,(time+0.01));
			};
		};
		$("[col="+step+"]").addClass('highlight')
		$("[col="+prevstep+"]").removeClass('highlight')
		//console.log(step)

	}, "16n");
loop.humanize=false;

updateSliders();
//startaudiocontext - needed for iOS devices to manually start the audio engine. 

StartAudioContext(Tone.context, "#play");
