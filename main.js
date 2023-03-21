// Notas musicais
const notes = {
	C: [16.35, 32.7, 65.4, 130.8, 261.6, 523.2, 1046.4, 2092.8, 4185.6],
	Db: [17.32, 34.64, 69.28, 138.56, 277.12, 554.24, 1108.48, 2216.96, 4433.92],
	D: [18.35, 36.7, 73.4, 146.8, 293.6, 587.2, 1174.4, 2348.8, 4697.6],
	Eb: [19.45, 38.9, 77.8, 155.6, 311.2, 622.4, 1244.8, 2489.6, 4979.2],
	E: [20.6, 41.2, 82.4, 164.8, 329.6, 659.2, 1318.4, 2636.8, 5273.6],
	F: [21.83, 43.66, 87.32, 174.64, 349.28, 698.56, 1397.12, 2794.24, 5588.48],
	Gb: [23.12, 46.24, 92.48, 184.96, 369.92, 739.84, 1479.68, 2959.36, 5918.72],
	G: [24.5, 49, 98, 196, 392, 784, 1568, 3136, 6272],
	Ab: [25.96, 51.92, 103.84, 207.68, 415.36, 830.72, 1661.44, 3322.88, 6645.76],
	A: [27.5, 55, 110, 220, 440, 880, 1760, 3520, 7040],
	Bb: [29.14, 58.28, 116.56, 233.12, 466.24, 932.48, 1864.96, 3729.92, 7459.84],
	B: [30.87, 61.74, 123.48, 246.96, 493.92, 987.84, 1975.68, 3951.36, 7902.72]
}

// Variáveis
let pitch = 4
let wave = 'sine'
let attack = 0.001
let sustain = 0
let release = 0.5
let volume = 1

const attackInput = document.getElementById('attackInput')
attackInput.addEventListener('change', () => {
	attack = attackInput.value * 0.01
	attack = Math.max(attack, 0.001)
	attack = Math.min(attack, 1)
})

const sustainInput = document.getElementById('sustainInput')
sustainInput.addEventListener('change', () => {
	sustain = sustainInput.value * 0.01
	sustain = Math.max(sustain, 0.001)
	sustain = Math.min(sustain, 1)
})

const releaseInput = document.getElementById('releaseInput')
releaseInput.addEventListener('change', () => {
	release = releaseInput.value * 0.01
	release = Math.max(release, 0.001)
	release = Math.min(release, 1)
})

const waveButton = document.getElementById('waveButton')
waveButton.addEventListener('click', () => {
	switch(wave) {
		case 'sine': wave = 'triangle'; volume = 1; waveButton.setAttribute('class', 'wave-button triangle'); break;
		case 'triangle': wave = 'sawtooth'; volume = 0.7; waveButton.setAttribute('class', 'wave-button sawtooth'); break;
		case 'sawtooth': wave = 'square'; volume = 0.5; waveButton.setAttribute('class', 'wave-button square'); break;
		default: wave = 'sine'; volume = 1; waveButton.setAttribute('class', 'wave-button sine');
	}
})

const pitchDisplay = document.getElementById('pitchDisplay')

const pitchDown = document.getElementById('pitchDown')
pitchDown.addEventListener('click', () => {
	pitch--
	pitch = Math.max(pitch, 2)
	pitch = Math.min(pitch, 6)
	pitchDisplay.textContent = pitch
})

const pitchUp = document.getElementById('pitchUp')
pitchUp.addEventListener('click', () => {
	pitch++
	pitch = Math.max(pitch, 2)
	pitch = Math.min(pitch, 6)
	pitchDisplay.textContent = pitch
})

// Função de som
const audio = new (window.AudioContext || window.webkitAudioContext)()
window.addEventListener('click', () => audio.resume())

function playSound(wave, frequency, attack, sustain, release) {
	const osc = audio.createOscillator()
	const gain = audio.createGain()
	osc.type = wave
	osc.frequency.value = frequency
	osc.connect(gain)
	gain.connect(audio.destination)
	osc.start()
	gain.gain.value = 0.00001
	gain.gain.linearRampToValueAtTime(volume, audio.currentTime + attack)
	gain.gain.linearRampToValueAtTime(volume, audio.currentTime + attack + sustain)
	gain.gain.linearRampToValueAtTime(0.00001, audio.currentTime + attack + sustain + release)
	osc.stop(audio.currentTime + attack + sustain + release)
}

// Tocar pelo piano virtual
const piano = document.getElementById('piano')
piano.addEventListener('mouseover', ({target, buttons}) => {
	if (buttons === 1) {
		playSound(wave, notes[target.dataset.note][parseInt(target.dataset.pitch) + pitch], attack, sustain, release)
		target.classList.remove('played')
		setTimeout(() => target.classList.add('played'), 1)
	}
})

piano.addEventListener('mousedown', ({target, buttons}) => {
	if (buttons === 1) {
		playSound(wave, notes[target.dataset.note][parseInt(target.dataset.pitch) + pitch], attack, sustain, release)
		target.classList.remove('played')
		setTimeout(() => target.classList.add('played'), 1)
	}
})

// Tocar pelo teclado físico
const keyboard = {
	KeyZ: {note: 'C', pitch: 0},
	KeyS: {note: 'Db', pitch: 0},
	KeyX: {note: 'D', pitch: 0},
	KeyD: {note: 'Eb', pitch: 0},
	KeyC: {note: 'E', pitch: 0},
	KeyV: {note: 'F', pitch: 0},
	KeyG: {note: 'Gb', pitch: 0},
	KeyB: {note: 'G', pitch: 0},
	KeyH: {note: 'Ab', pitch: 0},
	KeyN: {note: 'A', pitch: 0},
	KeyJ: {note: 'Bb', pitch: 0},
	KeyM: {note: 'B', pitch: 0},
	Comma: {note: 'C', pitch: 1},
	KeyQ: {note: 'C', pitch: 1},
	Digit2: {note: 'Db', pitch: 1},
	KeyW: {note: 'D', pitch: 1},
	Digit3: {note: 'Eb', pitch: 1},
	KeyE: {note: 'E', pitch: 1},
	KeyR: {note: 'F', pitch: 1},
	Digit5: {note: 'Gb', pitch: 1},
	KeyT: {note: 'G', pitch: 1},
	Digit6: {note: 'Ab', pitch: 1},
	KeyY: {note: 'A', pitch: 1},
	Digit7: {note: 'Bb', pitch: 1},
	KeyU: {note: 'B', pitch: 1},
	KeyI: {note: 'C', pitch: 2}
}

window.addEventListener('keydown', ({code, repeat}) => {
	if (!repeat && code in keyboard) {
		playSound(wave, notes[keyboard[code].note][keyboard[code].pitch + pitch], attack, sustain, release)
		const key = document.querySelector(`.key[data-note="${keyboard[code].note}"][data-pitch="${keyboard[code].pitch}"]`)
		key.classList.remove('played')
		setTimeout(() => key.classList.add('played'), 1)
	}
})