var audioCtx = new (window.AudioContext || window.webkitAudioContext);
var numSamples = 8;
var numSteps = 16;
var sequences;
var params = {
	"oscillator" : { "type" : "sine" },
	"envelope" : { "attack" : 0.05, "decay" : 0.1, "sustain": 0.9, "release":0.05 },
	"filterEnvelope" : { "attack": 0.05, "sustain" : 0.9, "release" : 0.05}
};
var synths = [0,0,0,0,0,0,0,0];
var step = 0;
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

for (i = 0; i<8; i++) {
	synths[i] = new Tone.MonoSynth(params);
	synths[i].toMaster();
	synths[i].volume.value = -10
};
 
//for (i = 0; i<8; i++) {
	//synths[i] = new Tone.Sampler(samplebank[i]);
	//synths[i].toMaster();
	//synths[i].volume.value = -10
//};

// store sample locations 
//for (i = 0; i<8; i++) {
	//samplebank[i] = 
//};


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
	//console.log(row,column,state);
	sequences[row][column] = state;
	console.log(sequences[row]);
};

function randomizeAll() {
	for (i=0;i<8;i++) {
		for (j=0;j<16;j++) {
			sequences[i][j]=Math.round(Math.random());
		}
	}
};

//synth.triggerAttackRelease("C5", +0.5);


//make blank sequences
createSequence(numSamples, numSteps);
console.log(sequences);

//start the loop
var chord = [0, 3, 5, 7, 10, 14, 12, 2];

loop = new Tone.Loop(function(time){
		for (i = 0; i < 8; i++) {
			var note = Tone.Frequency(chord[i]+60, "midi").toNote();
			//var note = 0
			if (sequences[i][step] == 1) {
				synths[i].triggerAttackRelease(note,0.1)
			};
		};
		step = (step + 1) % numSteps;

	}, "8n").start(0);

Tone.Transport.start();
Tone.Transport.bpm.value = 180;
