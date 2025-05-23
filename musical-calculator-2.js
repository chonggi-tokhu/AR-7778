
var AudioContext = window.AudioContext || window.webkitAudioContext || false;
var ac = new AudioContext || new webkitAudioContext;
var Soundfont = window['Soundfont'];
function AR7778({ length, semitone_up } = { length: 2000, semitone_up: false }) {
    //this.notes = ["A4", "As4", "A5", "As5", "A6", "As6", "B4", "B5", "B6", "C4", "Cs4", "C5", "Cs5", "C6", "Cs6", "D4", "Ds4", "D5", "Ds5", "D6", "Ds6", "E4", "E5", "E6", "F4", "Fs4", "F5", "Fs5", "F6", "Fs6", "G4", "Gs4", "G5", "Gs5", "G6", "Gs6"];
    this.notes0 = ["C3", "D3", "E3", "F3", "G3", "A4", "B4", "C4", "D4", "E4", "F4", "G4", "A5", "B5", "C5", "D5", "E5", "F5", "G5", "A6", "B6", "C6"];
    this.notes1 = ["Cs3", "Ds3", "F3", "Fs3", "Gs3", "As4", "C4", "Cs4", "Ds4", "F4", "Fs4", "Gs4", "As5", "C5", "Cs5", "Ds5", "F5", "Fs5", "Gs5", "As6", "C3"];
    this.instrument = null;
    this.currKeys = {};
    this.config = { length, semitone_up };
}
AR7778.prototype = {
    init(cbfunc) {
        Soundfont.instrument(ac, "AR-7778").then((instrument) => {
            this.instrument = instrument;
            if (typeof cbfunc === 'function') {
                cbfunc(instrument);
            }
        });
    },
    playNote(notename) {
        var a = this.instrument.play(notename, 0, { duration: this.config.length - 100 });
        this.currKeys[notename] = a;
    },
    stopNote(notename) {
        this.instrument.stop(0, [this.currKeys[notename]]);
        this.currKeys[notename] = null;
    },
    playButton(buttonidx, el, hand) {
        var notes = (this.config.semitone_up ? this.notes1 : this.notes0);
        //console.log((this.config.semitone_up ? this.notes1 : this.notes0));
        //console.log(buttonidx);
        if (!notes[buttonidx]) {
            return;
        }
        this.playNote(notes[buttonidx]);
        if (el instanceof HTMLElement) {
            el.classList.add("highlight");
        }
        setTimeout(() => {
            if (!hand) {
                return; Z
            }
            this.stopNote(notes[buttonidx]);
            if (el instanceof HTMLElement) {
                el.classList.remove("highlight");
            }
        }, this.config.length - 100);
    },
    stopButton(buttonidx, el) {
        var notes = (this.config.semitone_up ? this.notes1 : this.notes0);
        //console.log((this.config.semitone_up ? this.notes1 : this.notes0));
        //console.log(buttonidx);
        if (!notes[buttonidx]) {
            return;
        }
        this.stopNote(notes[buttonidx]);
        if (el instanceof HTMLElement) {
            el.classList.remove("highlight");
        }
    },
    setConfig({ length, semitone_up } = { length: null, semitone_up: null }) {
        this.length = length === null ? this.length : length;
        this.semitone_up = semitone_up === null ? this.semitone_up : semitone_up;
    },
}