// ------ Get DOM Elements ------ //
const focusLengthInput = document.getElementById('focus-length');
const shortBreakLengthInput = document.getElementById('short-break-length');
const longBreakLengthInput = document.getElementById('long-break-length');
const startButton = document.getElementById('start-timer');
const timerDisplay = document.getElementById('timer-display');
const pauseButton = document.getElementById('pause-timer');
const progressBar = document.getElementById('progress-bar');
const focusInputContainer = document.getElementById('focus-input-container');
const shortInputContainer = document.getElementById('short-input-container');
const longInputContainer = document.getElementById('long-input-container');
const pomodoroCountDisplay = document.getElementById('focus-number-container')

// ------ Initialize Variables ------ //
let isPaused = false;
let timer;
let timerState = 'focus';
let pomodoroCount = 0;

// ------ Reset Initial Values for Inputs ------ //
focusLengthInput.value = 25;
shortBreakLengthInput.value = 5;
longBreakLengthInput.value = 15;

// ------ Request Notification Permission ------ //
Notification.requestPermission().then(function (permission) {
    if (permission === 'granted') {
        console.log('Notification permission granted.');
    } else {
        console.log('Unable to get permission to notify.');
    }
});

// ------ On StartButton Click ------ //
startButton.addEventListener('click', () => {
    // ------ Hide Input Elements ------ //
    focusInputContainer.style.display = 'none';
    shortInputContainer.style.display = 'none';
    longInputContainer.style.display = 'none';

    // ------ Show Number of Focuses ------ //
    pomodoroCountDisplay.style.display = 'flex';

    // ------ Update StartButton Text ------ //
    startButton.textContent = 'Restart Timer';

    // ------ Update Timer State ------ //
    if (timerState === 'none') {
        // Reset Timer State
        timerState = 'focus';

        // Reset Pomodoro Count
        pomodoroCount = 0;
    }

    // ------ Start Timer ------ //
    switch (timerState) {
        // ------ Start Focus Timer ------ //
        case 'focus':
            startTimer(focusLengthInput.value);
            break;
        
        // ------ Start Short Break Timer ------ //  
        case 'short-break':
            startTimer(shortBreakLengthInput.value);
            break;

        // ------ Start Long Break Timer ------ //
        case 'long-break':
            startTimer(longBreakLengthInput.value);
            break;
    }
});

function startTimer(length) {
    // ------ Reset Timer ------ //
    clearInterval(timer);

    // ------ Initialize Timer ------ //
    let timeLeft = length * 60;

    // ------ Unpause Timer ------ //
    if (isPaused) {
        isPaused = false;
        pauseButton.textContent = 'Pause Timer';
    }

    // ------ Update Timer Display ------ //
    timerDisplay.textContent = formatTime(timeLeft);

    timer = setInterval(() => {
        // ------ Update Timer if Not Paused ------ //
        if (!isPaused) {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            progressBar.style.width = `${(timeLeft / (length * 60)) * 100}%`;
        }

        // ------ Check if Timer is Finished ------ //
        if (timeLeft <= 0) {
            clearInterval(timer);
            
            // ------ Switch to Next Timer ------ //
            switch (timerState) {
                // ------ Focus Timer ------ //
                case 'focus':
                    // Increment Pomodoro Count
                    pomodoroCount++;
                    updatePomodoroCountDisplay()

                    // If PomodoroCount is 4, start a long break
                    if(pomodoroCount >= 4) {
                        timerState = 'long-break';
                        pomodoroCountDisplay.textContent = pomodoroCount + " Pomodoros Completed! Take a Long Break! :D";
                    } else {
                        timerState = 'short-break';
                    }

                    // Send Notification
                    new Notification('FocusPomodoro', { body: 'Focus Timer Finished!' });

                    // Set Progress Bar to 100%
                    progressBar.style.width = '100%';

                    // Start the next timer
                    startButton.click();

                    // Exit the function
                    break;

                // ------ Short Break Timer ------ //
                case 'short-break':
                    // Reset the timer state
                    timerState = 'focus';

                    // Send Notification
                    new Notification('FocusPomodoro', { body: 'Short Break Timer Finished!' });

                    // Set Progress Bar to 100%
                    progressBar.style.width = '100%';

                    // Start the next timer
                    startButton.click();

                    // Exit the function
                    break;

                // ------ Long Break Timer ------ //
                case 'long-break':
                    // Reset the timer state
                    timerState = 'none';

                    // Show Input Elements
                    focusInputContainer.style.display = 'flex';
                    shortInputContainer.style.display = 'flex';
                    longInputContainer.style.display = 'flex';

                    // Hide Number of Focuses
                    pomodoroCountDisplay.style.display = 'none';

                    // Change StartButton Text to "Start Timer"
                    startButton.textContent = 'Start Timer';

                    // Notify the user that the long break is over
                    new Notification('FocusPomodoro', { body: 'Long Break Timer Finished!' });

                    // Exit the function
                    break;
            }
        }
    }, 1000);
}

// ------ On PauseButton Click ------ //
pauseButton.addEventListener('click', () => {
    // ------ Toggle Pause ------ //
    if (isPaused) {
        // Update Value
        isPaused = false;

        // Update PauseButton Text
        pauseButton.textContent = 'Pause Timer';

        // Hide Input Elements
        focusInputContainer.style.display = 'none';
        shortInputContainer.style.display = 'none';
        longInputContainer.style.display = 'none';

        // Hide Number of Focuses
        pomodoroCountDisplay.style.display = 'none';
    } else {
        // Update Value
        isPaused = true;

        // Update PauseButton Text
        pauseButton.textContent = 'Resume Timer';

        // Show Input Elements
        focusInputContainer.style.display = 'flex';
        shortInputContainer.style.display = 'flex';
        longInputContainer.style.display = 'flex';

        // Show Number of Focuses
        pomodoroCountDisplay.style.display = 'flex';
    }
});

// ------ Format Time ------ //
function formatTime(seconds) {
    // ------ Calculate Minutes and Seconds ------ //
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // ------ Return Formatted Time ------ //
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// ------ Update Pomodoro Count Display ------ //
function updatePomodoroCountDisplay() {
    pomodoroCountDisplay.textContent = "Number of Focuses So Far: " + pomodoroCount;
}