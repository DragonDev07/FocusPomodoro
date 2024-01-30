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
const toggleButton = document.getElementById('toggle-button');
const spotifyDiv = document.getElementById('spotify-div');
const spotifyLoginButton = document.getElementById('login-button');
const spotifyLoginDiv = document.getElementById('spotify-login');
const volumeSlider = document.getElementById('volume-slider');

// ------ Initialize Variables ------ //
let isPaused = false;
let timer;
let timerState = 'focus';
let pomodoroCount = 0;
let player;
let accessToken;

// ------ Reset Initial Values for Inputs ------ //
focusLengthInput.value = 25;
shortBreakLengthInput.value = 5;
longBreakLengthInput.value = 15;

// ------ Hide Spotify Div until user logs in ------ //
spotifyDiv.style.display = 'none';

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

// ------ Start Function ------ //
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

// ------ On ToggleButton Click ------ //
toggleButton.addEventListener('click', () => {
    if (player) {
        player.togglePlay().then(() => {
            console.log('Toggled playback!');
        }).catch((error) => {
            console.error('Failed to toggle playback', error);
        });
    }
});

// ------ On LoginButton Click ------ //
spotifyLoginButton.addEventListener('click', () => {
    const clientId = '73187b57c897429ab8688f1b927b03a6';

    // TODO: Update Redirect URI
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=http://localhost:5500&scope=streaming%20user-read-email%20user-read-private`;
});

// ------ On Load ------ //
window.addEventListener('load', () => {
    // ------ Reset Access Token ------ //
    accessToken = null;

    // ------ Get the Access Token from the URL ------ //
    const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
            if (item) {
                var parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {});
    window.location.hash = '';

    // ------ Save Access Token ------ //
    accessToken = hash.access_token;
    
    // ------ Hide Spotify-Login & Show Spotify Div ------ //
    if (accessToken) {
        spotifyLoginButton.style.display = 'none';
        spotifyDiv.style.display = 'flex';
    }
});

// ------ On Volume Slider Change ------ //
document.getElementById('volume-slider').addEventListener('input', (event) => {
    // ------ Convert Volume to a Decimal ------ //
    const volume = event.target.value / 100;

    // ------ Update the Volume ------ //
    if (player) {
      player.setVolume(volume);
    }
});

// ------ Spotify API ------ //
window.onSpotifyWebPlaybackSDKReady = () => {

    // Initialize the Web Playback SDK
    player = new Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(accessToken); }
    });

    // ------ Set the Name of the Player ------ //
    player.setName("FocusPomodoro Spotify Player");

    // ------ Update Volume Slider ------ //
    player.getVolume().then(volume => {
        document.getElementById('volume-slider').value = volume * 100;
    });

    // ------ Transfer Playback to Web Playback SDK ------ //
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                device_ids: [device_id],
                play: true
            }),
        });
    });
  
    // ------ Update Track Information ------ //
    player.addListener('player_state_changed', state => {
        console.log('Player State Changed', state);
        // Display the currently playing song name and album
        const trackName = state.track_window.current_track.name;
        const albumName = state.track_window.current_track.album.name;
        const albumArtUrl = state.track_window.current_track.album.images[0].url;

        console.log('Track Name:', trackName);
        console.log('Album Name:', albumName);
        document.getElementById('track-name').innerHTML = `${trackName}`;
        document.getElementById('album-name').innerHTML = `${albumName}`;
        document.getElementById('album-art').src = albumArtUrl;
    });
  
    // ------ Connect to the Player! :D ------ //
    player.connect();
};