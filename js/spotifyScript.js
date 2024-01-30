const spotifyDiv = document.getElementById('spotify-div');
const spotifyLoginButton = document.getElementById('login-button');
const spotifyLoginDiv = document.getElementById('spotify-login');
const volumeSlider = document.getElementById('volume-slider');
const toggleButton = document.getElementById('toggle-button');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');

// ------ Initialize Variables ------ //
let player;
let accessToken;

// ------ Hide Spotify Div until user logs in ------ //
spotifyDiv.style.display = 'none';

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

// ------ On NextButton Click ------ //
nextButton.addEventListener('click', () => {
    if (player) {
        player.nextTrack();
    }
});

// ------ On PrevButton Click ------ //
prevButton.addEventListener('click', () => {
    if (player) {
        player.previousTrack();
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
        spotifyLoginDiv.style.display = 'none';
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

        const trackName = state.track_window.current_track.name;
        const albumName = state.track_window.current_track.album.name;
        const albumArtUrl = state.track_window.current_track.album.images[0].url;

        document.getElementById('track-name').innerHTML = `${trackName}`;
        document.getElementById('album-name').innerHTML = `${albumName}`;
        document.getElementById('album-art').src = albumArtUrl;
    });
  
    // ------ Connect to the Player! :D ------ //
    player.connect();
};