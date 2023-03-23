// Notas musicais
const notes = {
	C: [ 16.35, 32.7, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093, 4186.01 ],
	Db: [ 17.32, 34.65, 69.3, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92 ],
	D: [ 18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64 ],
	Eb: [ 19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03 ],
	E: [ 20.6, 41.2, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02, 5274.04 ],
	F: [ 21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83, 5587.65 ],
	Gb: [ 23.12, 46.25, 92.5, 185, 369.99, 739.99, 1479.98, 2959.96, 5919.91 ],
	G: [ 24.5, 49, 98, 196, 392, 783.99, 1567.98, 3135.96, 6271.93 ],
	Ab: [ 25.96, 51.91, 103.83, 207.65, 415.3, 830.61, 1661.22, 3322.44, 6644.88 ],
	A: [ 27.5, 55, 110, 220, 440, 880, 1760, 3520, 7040 ],
	Bb: [ 29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31, 7458.62 ],
	B: [ 30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07, 7902.13 ]
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