var audioCtx = new (window.AudioContext || window.webkitAudioContext);
var numSamples = 8;
var numSteps = 16;
var maxSteps = 64;
var gridSize = 16;
var sequences;
var params = {
	"oscillator" : { "type" : "sine" },
	"envelope" : { "attack" : 0.05, "decay" : 0.1, "sustain": 0.9, "release":0.05 },
	"filterEnvelope" : { "attack": 0.05, "sustain" : 0.9, "release" : 0.05}
};
var synths = [0,0,0,0,0,0,0,0];
var step = 0;
var bpm = 180;
var loop;
var samplebank = [
	"./samples/ctbseqchords.wav",
	"./samples/min_kick_13_E.wav",
	"./samples/mkbsnare2.wav",
	"./samples/TL-60Hat_C04.wav",
	"./samples/TL-60Hat_O04.wav",
	"./samples/crackle1-0.wav",
	"./samples/cracklePew1-1.wav",
	"./samples/TL-60Snare61.wav"
];

//for (i = 0; i<8; i++) {
	//synths[i] = new Tone.MonoSynth(params);
	//synths[i].toMaster();
	//synths[i].volume.value = -10
//};
 
for (i = 0; i<8; i++) {
	synths[i] = new Tone.Sampler(samplebank[i]);
	synths[i].toMaster();
	synths[i].volume.value = -10
};

// DEFINE FUNCTIONS

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
	//console.log(sequences[row]);
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

function startSequence() {
	Tone.Transport.start();
	loop.start();
	Tone.Transport.bpm.value = bpm;
}

function stopSequence() {
	Tone.Transport.stop();
	clearBlink();
	step = 0;
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


//synth.triggerAttackRelease("C5", +0.5);


//make blank sequences
createSequence(numSamples, maxSteps);
//console.log(sequences);

//start the loop
var chord = [0, 3, 5, 7, 10, 14, 12, 2];

loop = new Tone.Loop(function(time){
		for (i = 0; i < 8; i++) {
			//var note = Tone.Frequency(chord[i]+60, "midi").toNote();
			var note = 0
			if (sequences[i][step] == 1) {
				synths[i].triggerAttackRelease(note,0.1,time)
			};
		};
		prevstep = step;
		step = (step + 1) % numSteps;
		$("[col="+step+"]").addClass('highlight')
		$("[col="+prevstep+"]").removeClass('highlight')
		//console.log(step)

	}, "16n");
loop.humanize=false;

//Tone.Transport.start();
//Tone.Transport.bpm.value = 180;
