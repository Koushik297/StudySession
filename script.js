// script.js
let totalStudyTime;
let sessionTime;
let breakTime;
let currentSession = 0;
let totalSessions;
let timerInterval;
let timeRemaining;
let breakTimeRemaining;
let isStudyTime = true;
let currentVolume = 1; // Volume level from 0 to 1

const timerElement = document.getElementById('time');
const sessionInfoElement = document.getElementById('session-info');
const breakTimerElement = document.getElementById('break-time');
const breakTimerContainer = document.getElementById('break-timer-container');
const alarm = document.getElementById('alarm');
const backgroundMusic = document.getElementById('background-music');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const setHoursButton = document.getElementById('set-hours-btn');
const studyHoursInput = document.getElementById('study-hours');
const studyDurationInput = document.getElementById('study-duration');
const breakDurationInput = document.getElementById('break-duration');
const volumeDownButton = document.getElementById('volume-down');
const volumeUpButton = document.getElementById('volume-up');
const volumeLevelDisplay = document.getElementById('volume-level');

function setTotalStudyHours() {
    const hours = parseInt(studyHoursInput.value);
    const studyMinutes = parseInt(studyDurationInput.value);
    const breakMinutes = parseInt(breakDurationInput.value);
    
    if (isNaN(hours) || hours <= 0 || isNaN(studyMinutes) || studyMinutes <= 0 || isNaN(breakMinutes) || breakMinutes <= 0) {
        alert('Please enter valid numbers for all fields.');
        return;
    }

    totalStudyTime = hours * 60 * 60; // Convert hours to seconds
    sessionTime = studyMinutes * 60; // Convert study duration to seconds
    breakTime = breakMinutes * 60; // Convert break duration to seconds
    totalSessions = Math.floor(totalStudyTime / (sessionTime + breakTime));
    currentSession = 0;
    timeRemaining = sessionTime;
    updateSessionInfo();
    updateTimerDisplay();
    startButton.disabled = false;
}

function startTimer() {
    startButton.disabled = true;
    stopButton.disabled = false;
    backgroundMusic.volume = currentVolume; // Set initial volume
    backgroundMusic.play(); // Play background music
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    startButton.disabled = false;
    stopButton.disabled = true;
    backgroundMusic.pause(); // Pause background music
    breakTimerContainer.style.display = 'none'; // Hide break timer
}

function updateTimer() {
    if (isStudyTime) {
        timeRemaining--;

        if (timeRemaining <= 0) {
            playAlarm();
            isStudyTime = false;
            breakTimeRemaining = breakTime; // Reset break timer
            breakTimerContainer.style.display = 'block'; // Show break timer
            updateBreakTimerDisplay();
            timeRemaining = sessionTime; // Reset for next session
            updateSessionInfo();
        }
    } else {
        breakTimeRemaining--;

        if (breakTimeRemaining <= 0) {
            playAlarm();
            isStudyTime = true; // Switch back to study
            timeRemaining = sessionTime; // Reset for next study session
            currentSession++;
            breakTimerContainer.style.display = 'none'; // Hide break timer
            if (currentSession >= totalSessions) {
                stopTimer();
                return;
            }
            updateSessionInfo();
        } else {
            updateBreakTimerDisplay();
        }
    }

    updateTimerDisplay();
}

function updateSessionInfo() {
    sessionInfoElement.textContent = `Session: ${currentSession + 1}/${totalSessions}`;
}

function updateTimerDisplay() {
    const hrs = Math.floor(timeRemaining / 3600);
    const mins = Math.floor((timeRemaining % 3600) / 60);
    const secs = timeRemaining % 60;
    timerElement.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateBreakTimerDisplay() {
    const mins = Math.floor(breakTimeRemaining / 60);
    const secs = breakTimeRemaining % 60;
    breakTimerElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function playAlarm() {
    alarm.play();
    setTimeout(() => {
        alarm.pause();
        alarm.currentTime = 0;
    }, 15000); // 15 seconds
}

function increaseVolume() {
    if (currentVolume < 1) {
        currentVolume += 0.1;
        currentVolume = Math.min(currentVolume, 1); // Cap volume to 1
        backgroundMusic.volume = currentVolume;
        updateVolumeDisplay();
    }
}

function decreaseVolume() {
    if (currentVolume > 0) {
        currentVolume -= 0.1;
        currentVolume = Math.max(currentVolume, 0); // Cap volume to 0
        backgroundMusic.volume = currentVolume;
        updateVolumeDisplay();
    }
}

function updateVolumeDisplay() {
    volumeLevelDisplay.textContent = `Volume: ${Math.round(currentVolume * 100)}%`;
}

setHoursButton.addEventListener('click', setTotalStudyHours);
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
volumeUpButton.addEventListener('click', increaseVolume);
volumeDownButton.addEventListener('click', decreaseVolume);
