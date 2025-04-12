//import MIDIFile from './midi_reader_2';
var MIDIFile = this['MIDIFile'];
var midi_reader = new MIDIFile();
function parseMidi(midi_arrayBuffer) {
    midi_reader = new MIDIFile();
    var parsed = midi_reader.loadSongWithCbfunc(midi_arrayBuffer, false,
        function (param) {
            return param.parseSong();
        }
    );
    return parsed;
}
function midiToJsonObj(midi_arrayBuffer) {
    var parsed = parseMidi(midi_arrayBuffer);
    //console.log(parsed);
    var rtobj = {
        tracknotes: [],
        sustain: false,
        beats: [],
    };
    rtobj.tracknotes = parsed?.tracks?.map((val, idx, arr) => {
        return val?.notes?.map((val1, idx1, arr1) => {
            return { begin: val1?.when * 1000, duration: val1?.duration * 1000, end: (val1?.when + val1?.duration) * 1000, pitch: val1?.pitch, sustain: val1?.sustain };
        });
    });
    rtobj.sustain = parsed?.sustain;
    return rtobj;
}
var pitchnumbers = {
    21: 'A0',
    22: 'A#0',
    23: 'B0',
    24: 'C1',
    25: 'C#1',
    26: 'D1',
    27: 'D#1',
    28: 'E1',
    29: 'F1',
    30: 'F#1',
    31: 'G1',
    32: 'G#1',
    33: 'A1',
    34: 'A#1',
    35: 'B1',
    36: 'C2',
    37: 'C#2',
    38: 'D2',
    39: 'D#2',
    40: 'E2',
    41: 'F2',
    42: 'F#2',
    43: 'G2',
    44: 'G#2',
    45: 'A2',
    46: 'A#2',
    47: 'B2',
    48: 'C3',
    49: 'C#3',
    50: 'D3',
    51: 'D#3',
    52: 'E3',
    53: 'F3',
    54: 'F#3',
    55: 'G3',
    56: 'G#3',
    57: 'A3',
    58: 'A#3',
    59: 'B3',
    60: 'C4',
    61: 'C#4',
    62: 'D4',
    63: 'D#4',
    64: 'E4',
    65: 'F4',
    66: 'F#4',
    67: 'G4',
    68: 'G#4',
    69: 'A4',
    70: 'A#4',
    71: 'B4',
    72: 'C5',
    73: 'C#5',
    74: 'D5',
    75: 'D#5',
    76: 'E5',
    77: 'F5',
    78: 'F#5',
    79: 'G5',
    80: 'G#5',
    81: 'A5',
    82: 'A#5',
    83: 'B5',
    84: 'C6',
    85: 'C#6',
    86: 'D6',
    87: 'D#6',
    88: 'E6',
    89: 'F6',
    90: 'F#6',
    91: 'G6',
    92: 'G#6',
    93: 'A6',
    94: 'A#6',
    95: 'B6',
    96: 'C7',
    97: 'C#7',
    98: 'D7',
    99: 'D#7',
    100: 'E7',
    101: 'F7',
    102: 'F#7',
    103: 'G7',
    104: 'G#7',
    105: 'A7',
    107: 'A#7',
    108: 'B7',
    109: 'C8',
}
var _1minute = 60;
function midiToJson(midi_arrayBuffer) {
    return JSON.stringify(midiToJsonObj(midi_arrayBuffer));
}
function midi_player(midi_arrayBuffer) {
    this.midi_arrayBuffer = midi_arrayBuffer || '';
    this.song = null;
    this.sampleRate = 5;
    this.tick = 0;
    this.playfunc = () => { };
    this.intervalId = null;
    this.tempo = 60;
    this.playing = false;
    this.fulldur = 0;
}
midi_player.prototype = {
    getTempoInSec() {
        return 60 / this.tempo;
    },
    set_midi_arrayBuffer(midi_arrayBuffer) {
        this.midi_arrayBuffer = midi_arrayBuffer;
    },
    parse() {
        this.song = midiToJsonObj(this.midi_arrayBuffer);
    },
    play_midi(playfunc) {
        if (typeof playfunc === 'function') {
            this.playfunc = playfunc;
        }
        this.fulldur = this.song.tracknotes[this.song.tracknotes.length - 1][this.song.tracknotes[this.song.tracknotes.length - 1].length - 1].end;
    },
    parse_and_play_midi(playfunc) {
        this.parse();
        if (typeof playfunc === 'function') {
            this.playfunc = playfunc;
        }
        this.fulldur = this.song.tracknotes[this.song.tracknotes.length - 1][this.song.tracknotes[this.song.tracknotes.length - 1].length - 1].end;
    },
    parseJSON(jsonparam) {
        this.song = JSON.parse(jsonparam);
    },
    parseJSON_and_play_midi(jsonparam, playfunc) {
        this.song = JSON.parse(jsonparam);
        this.play_midi(playfunc);
    },
    play() {
        this.playing = true;
        this.intervalId = window.setTimeout(() => {
            this.playNotes();
            this.tick += this.sampleRate * this.getTempoInSec();
        }, this.sampleRate * this.getTempoInSec());
    },
    playNotes() {
        this.song.tracknotes.forEach((val, idx, arr) => {
            val?.forEach((val1, idx1, arr1) => {
                //console.log(val1);
                /* if (this.tick < val1?.end * this.getTempoInSec() + ((this.sampleRate * this.getTempoInSec())) && this.tick >= val1?.end * this.getTempoInSec()) {
                    var val1copy = {};
                    for (var prop in val1) {
                        val1copy[prop] = val1[prop];
                    }
                    val1copy.name = "Note off";
                    val1copy.noteNumber = val1copy.pitch;
                    val1copy.noteName = pitchnumbers[val1copy.pitch];
                    this.playfunc(val1copy);
                } else if (this.tick < val1?.begin * this.getTempoInSec() + ((this.sampleRate * this.getTempoInSec())) && this.tick >= val1?.begin * this.getTempoInSec()) {
                    var val1copy = {};
                    for (var prop in val1) {
                        val1copy[prop] = val1[prop];
                    }
                    val1copy.name = "Note on";
                    val1copy.noteNumber = val1copy.pitch;
                    val1copy.noteName = pitchnumbers[val1copy.pitch];
                    this.playfunc(val1copy);
                } */
                if (this.tick < val1?.end * this.getTempoInSec() + ((this.sampleRate * this.getTempoInSec())) && this.tick >= val1?.end * this.getTempoInSec()) {
                    var val1copy = {};
                    for (var prop in val1) {
                        val1copy[prop] = val1[prop];
                    }
                    val1copy.name = "Note off";
                    val1copy.noteNumber = val1copy.pitch;
                    val1copy.noteName = pitchnumbers[val1copy.pitch];
                    this.playfunc(val1copy);
                } else if (this.tick < val1?.begin * this.getTempoInSec() + ((this.sampleRate * this.getTempoInSec())) && this.tick >= val1?.begin * this.getTempoInSec()) {
                    var val1copy = {};
                    for (var prop in val1) {
                        val1copy[prop] = val1[prop];
                    }
                    val1copy.name = "Note on";
                    val1copy.noteNumber = val1copy.pitch;
                    val1copy.noteName = pitchnumbers[val1copy.pitch];
                    this.playfunc(val1copy);
                }
                if (/* idx1 >= arr1.length - 1 && idx >= arr.length - 1 */this.tick >= this.fulldur) {
                    this.pause();
                    this.playing = false;
                } else {
                    this.playing = true;
                }
            });
        });
        if (this.playing) {
            this.play();
        }
    },
    pause() {
        clearInterval(this.intervalId);
    },
    changeSampleRate(numb) {
        this.sampleRate = !isNaN(numb) ? numb : this.sampleRate;
    },
    setTempo(tempo) {
        this.tempo = !isNaN(tempo) ? tempo : this.tempo;
    }
}/* 
function multiple_midi_player() { }
multiple_midi_player.prototype = {
    readJSON(jsonparam, playersparam, cbfunc) {
        var parsed = JSON.parse(jsonparam);
        if (parsed instanceof Array) {
            parsed.forEach((val, idx, arr) => {
                playersparam.forEach((val1, idx1, arr1) => {
                    if (val1?.instrumentname === val?.inst) {
                        typeof cbfunc === 'function' ? cbfunc(parsed?.song, arr1[idx1]) : {};
                    }
                });
            })
        }
    }
} */