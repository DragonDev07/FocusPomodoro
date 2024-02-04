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
const pomodoroCountDisplay = document.getElementById('focus-number-container');

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
    startButton.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';

    updatePomodoroCountDisplay();

    // ------ Update Timer State ------ //
    if (timerState === 'none') {
        // Reset Timer State
        timerState = 'focus';

        // Reset Pomodoro Count
        pomodoroCount = 0;

        // Reset Pomodoro Count Display
        updatePomodoroCountDisplay();
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

// ------ Start Function ------ //
function startTimer(length) {
    // ------ Reset Timer ------ //
    clearInterval(timer);

    // ------ Initialize Timer ------ //
    let timeLeft = length * 60;

    // ------ Unpause Timer ------ //
    if (isPaused) {
        isPaused = false;
        pauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
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
                    startButton.innerHTML = '<i class="fa-solid fa-play"></i>';

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
        pauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';

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
        pauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';

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

function updatePomodoroCountDisplay() {
    let html = '';
    if (timerState === 'long-break') {
        html += `<i class="fa-solid fa-mug-saucer"></i>`;
    } else {
        for(let i = 0; i < 4; i++) {
            if(i < pomodoroCount) {
                html += `<i class="fa-solid fa-circle pomodoro_icon" data-count="${i+1}"></i> `;
            } else {
                html += `<i class="fa-regular fa-circle pomodoro_icon" data-count="${i+1}"></i> `;
            }
        }
    }

    pomodoroCountDisplay.innerHTML = html;

    // Add event listeners to the icons
    let icons = document.querySelectorAll('.pomodoro_icon');
    icons.forEach((icon, index) => {
        icon.addEventListener('click', function() {
            pomodoroCount = index + 1;
            startButton.click();
        });
    });
}