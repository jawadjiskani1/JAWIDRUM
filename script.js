const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let recording = [];
let isRecording = false;
let recordStartTime = 0;

function playSound(keyCode) {
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${keyCode}"]`);
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();
    key.classList.add('playing');

    if (isRecording) {
        recording.push({ keyCode, timestamp: Date.now() - recordStartTime });
    }
}

// Key & Click Events
window.addEventListener('keydown', (e) => playSound(e.keyCode));
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => playSound(key.getAttribute('data-key')));
    key.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;
        key.classList.remove('playing');
    });
});



// Controls Logic
const recordBtn = document.getElementById('recordBtn');
recordBtn.onclick = () => {
    isRecording = !isRecording;
    if (isRecording) {
        recording = [];
        recordStartTime = Date.now();
        recordBtn.textContent = "Recording...";
        recordBtn.classList.add('recording');
    } else {
        recordBtn.textContent = "Record";
        recordBtn.classList.remove('recording');
    }
};

document.getElementById('playBtn').onclick = () => {
    if (recording.length === 0) return;
    recording.forEach(note => {
        setTimeout(() => playSound(note.keyCode), note.timestamp);
    });
};

document.getElementById('clearBtn').onclick = () => {
    recording = [];
    isRecording = false;
    recordBtn.textContent = "Record";
    recordBtn.classList.remove('recording');
};