let timer;
let startTime;
let elapsedTime = 0;
let running = false;
let lapCounter = 1;
let previousLapTime = 0;
const laps = [];

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsContainer = document.getElementById('laps');
const themeToggle = document.getElementById('themeToggle');

startStopBtn.addEventListener('click', () => {
    if (running) {
        stopTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
themeToggle.addEventListener('click', toggleTheme);

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateDisplay, 100);
    startStopBtn.textContent = 'Pause';
    lapBtn.disabled = false;
    resetBtn.disabled = false;
    running = true;
}

function stopTimer() {
    clearInterval(timer);
    elapsedTime = Date.now() - startTime;
    startStopBtn.textContent = 'Resume';
    running = false;
}

function resetTimer() {
    clearInterval(timer);
    elapsedTime = 0;
    lapCounter = 1;
    previousLapTime = 0;
    laps.length = 0;
    display.textContent = '00:00:00.0';
    startStopBtn.textContent = 'Start';
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    lapsContainer.innerHTML = '';
    running = false;
}

function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    const time = new Date(elapsedTime);
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(time.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(Math.floor(time.getUTCMilliseconds() / 100)).padStart(1, '0');
    display.textContent = `${minutes}:${seconds}:${milliseconds}`;
}

function recordLap() {
    if (!running) return;
    const lapTime = elapsedTime - previousLapTime;
    previousLapTime = elapsedTime;

    const lapElement = document.createElement('div');
    lapElement.classList.add('lap');

    const totalLapTime = formatTime(elapsedTime);
    const lapDuration = formatTime(lapTime);

    lapElement.innerHTML = `
        <span>Lap ${lapCounter}</span>
        <span>Start: ${formatTime(previousLapTime - lapTime)}</span>
        <span>End: ${totalLapTime}</span>
        <span>Duration: ${lapDuration}</span>
    `;
    lapsContainer.appendChild(lapElement);
    laps.push({ lap: lapCounter, startTime: formatTime(previousLapTime - lapTime), endTime: totalLapTime, duration: lapDuration });

    saveLaps();
    lapCounter++;
}

function formatTime(time) {
    const t = new Date(time);
    const minutes = String(t.getUTCMinutes()).padStart(2, '0');
    const seconds = String(t.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(Math.floor(t.getUTCMilliseconds() / 100)).padStart(1, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
}

function saveLaps() {
    localStorage.setItem('laps', JSON.stringify(laps));
}

function loadLaps() {
    const savedLaps = JSON.parse(localStorage.getItem('laps')) || [];
    savedLaps.forEach(lap => {
        const lapElement = document.createElement('div');
        lapElement.classList.add('lap');
        lapElement.innerHTML = `
            <span>Lap ${lap.lap}</span>
            <span>Start: ${lap.startTime}</span>
            <span>End: ${lap.endTime}</span>
            <span>Duration: ${lap.duration}</span>
        `;
        lapsContainer.appendChild(lapElement);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.stopwatch').classList.toggle('dark-mode');
}

document.addEventListener('DOMContentLoaded', loadLaps);
