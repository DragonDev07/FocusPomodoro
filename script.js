const timerLengthInput = document.getElementById('timer-length');
const startButton = document.getElementById('start-timer');
const timerDisplay = document.getElementById('timer-display');
const pauseButton = document.getElementById('pause-timer');
const resetButton = document.getElementById('reset-timer');
const progressBar = document.getElementById('progress-bar');

let isPaused = false;
let timer;

// Request permission to send notifications
Notification.requestPermission().then(function (permission) {
    if (permission === 'granted') {
        console.log('Notification permission granted.');
    } else {
        console.log('Unable to get permission to notify.');
    }
});

startButton.addEventListener('click', () => {
    clearInterval(timer);
    const timerLength = timerLengthInput.value * 60;
    let timeLeft = timerLength;

    timerDisplay.textContent = formatTime(timeLeft);

    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            progressBar.style.width = `${(timeLeft / timerLength) * 100}%`;
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            // Send a notification when the timer finishes
            new Notification('Pomodoro Timer', { body: 'Timer finished!' });
        }
    }, 1000);
});

pauseButton.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        pauseButton.textContent = 'Pause Timer';
    } else {
        isPaused = true;
        pauseButton.textContent = 'Resume Timer';
    }
});

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    timerDisplay.textContent = formatTime(timerLengthInput.value * 60);
    progressBar.style.width = '100%';
    isPaused = false;
    pauseButton.textContent = 'Pause Timer';
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}