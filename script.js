import config from './config.js';

document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('start-button');
    const landingPage = document.getElementById('landing-page');
    const levelContainer = document.getElementById('level-container');
    const gridContainer = document.getElementById('grid');
    const nextButton1 = document.getElementById('next-button-1');
    const nextButton2 = document.getElementById('next-button-2');
    const nextButton3 = document.getElementById('next-button-3');
    const crosswordCells = document.querySelectorAll('.crossword-cell');
    const congratulations1 = document.getElementById('congratulations-1');
    const congratulations2 = document.getElementById('congratulations-2');
    const congratulations3 = document.getElementById('congratulations-3');
    const streetViewContainer = document.getElementById('street-view');
    const mapContainer = document.getElementById('map');
    const submitStreetViewGuess = document.getElementById('submit-street-view-guess');
    const streetViewFeedback = document.getElementById('street-view-feedback');
    const congratulationsPage = document.getElementById('congratulations-page');
    const levelUpSound = document.getElementById('level-up-sound');
    const backgroundMusic = document.getElementById('background-music');

    const startLevel1Button = document.getElementById('start-level-1');
    const startLevel2Button = document.getElementById('start-level-2');
    const startLevel3Button = document.getElementById('start-level-3');

    let panorama;
    let map;
    let marker;
    let currentStreetViewLocation;

    const items = [
        { name: 'Canada', group: 1 },
        { name: 'USA', group: 1 },
        { name: 'Mexico', group: 1 },
        { name: 'Guatemala', group: 1 },
        { name: 'Brazil', group: 2 },
        { name: 'Argentina', group: 2 },
        { name: 'Chile', group: 2 },
        { name: 'Peru', group: 2 },
        { name: 'London', group: 3 },
        { name: 'Paris', group: 3 },
        { name: 'Berlin', group: 3 },
        { name: 'Rome', group: 3 },
        { name: 'Eiffel Tower', group: 4 },
        { name: 'Statue of Liberty', group: 4 },
        { name: 'Big Ben', group: 4 },
        { name: 'Colosseum', group: 4 }
    ];

    const streetViewLocations = [
        { lat: 53.715761, lng: -6.347706, location: 'whitty' }
    ];

    let currentStreetViewLocationIndex = 0;

    const groupColors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'];

    let selectedItems = [];
    let groupedItems = 0;
    let currentGroupIndex = 0;

    const backgrounds = [
        'url(images/background.gif)',
        'url(images/b1.gif)',
        'url(images/background2.gif)'
    ];

    const musicTracks = [
        'sounds/background-music1.mp3',
        'sounds/background-music2.mp3',
        'sounds/background-music3.mp3'
    ];

    startButton.addEventListener('click', () => {
        landingPage.style.display = 'none';
        levelContainer.classList.remove('hidden');
        document.getElementById('character-intro-1').classList.remove('hidden');
        setBackground(0);
        setMusic(0);
        backgroundMusic.play().catch(e => {
            console.log("Autoplay was prevented, waiting for user interaction");
        });
    });

    startLevel1Button.addEventListener('click', () => {
        document.getElementById('character-intro-1').classList.add('hidden');
        document.getElementById('level-1').classList.remove('hidden');
        loadGrid();
    });

    nextButton1.addEventListener('click', () => {
        document.getElementById('level-1').classList.add('hidden');
        document.getElementById('character-intro-2').classList.remove('hidden');
        playLevelUpSound();
        setBackground(1);
        setMusic(1);
        backgroundMusic.play().catch(e => {
            console.log("Autoplay was prevented, waiting for user interaction");
        });
    });

    startLevel2Button.addEventListener('click', () => {
        document.getElementById('character-intro-2').classList.add('hidden');
        document.getElementById('level-2').classList.remove('hidden');
    });

    nextButton2.addEventListener('click', () => {
        document.getElementById('level-2').classList.add('hidden');
        document.getElementById('character-intro-3').classList.remove('hidden');
        playLevelUpSound();
        setBackground(2);
        setMusic(2);
        backgroundMusic.play().catch(e => {
            console.log("Autoplay was prevented, waiting for user interaction");
        });
    });

    startLevel3Button.addEventListener('click', () => {
        document.getElementById('character-intro-3').classList.add('hidden');
        document.getElementById('level-3').classList.remove('hidden');
        loadStreetView();
    });

    nextButton3.addEventListener('click', () => {
        document.getElementById('level-3').classList.add('hidden');
        congratulationsPage.classList.remove('hidden');
        playLevelUpSound();
    });

    function loadGrid() {
        gridContainer.innerHTML = '';
        items.sort(() => 0.5 - Math.random());
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.textContent = item.name;
            div.dataset.group = item.group;
            div.addEventListener('click', () => selectItem(div));
            gridContainer.appendChild(div);
        });
    }

    function selectItem(item) {
        if (item.classList.contains('grouped')) return;

        item.classList.toggle('selected');
        const itemGroup = item.dataset.group;

        if (selectedItems.includes(item)) {
            selectedItems = selectedItems.filter(i => i !== item);
        } else {
            selectedItems.push(item);
        }

        if (selectedItems.length === 4) {
            const allSameGroup = selectedItems.every(i => i.dataset.group === itemGroup);

            if (allSameGroup) {
                selectedItems.forEach(selectedItem => {
                    selectedItem.classList.add('grouped');
                    selectedItem.classList.add(groupColors[currentGroupIndex % groupColors.length]);
                    selectedItem.classList.remove('selected');
                });
                groupedItems += 4;
                currentGroupIndex++;
                if (groupedItems === items.length) {
                    congratulations1.style.display = 'block';
                    nextButton1.classList.remove('hidden');
                } else {
                    showTemporaryMessage('Correct! You found a group.');
                }
            } else {
                showTemporaryMessage('Incorrect grouping. Try again.');
                selectedItems.forEach(selectedItem => {
                    selectedItem.classList.remove('selected');
                });
            }
            selectedItems = [];
        }
    }

    function showTemporaryMessage(message) {
        const tempMessage = document.createElement('div');
        tempMessage.className = 'temp-message';
        tempMessage.textContent = message;
        levelContainer.appendChild(tempMessage);
        tempMessage.style.display = 'block';
        setTimeout(() => {
            tempMessage.style.display = 'none';
            tempMessage.remove();
        }, 2000);
    }

    function playLevelUpSound() {
        levelUpSound.play();
    }

    function setBackground(level) {
        document.body.style.backgroundImage = backgrounds[level];
    }

    function setMusic(level) {
        backgroundMusic.src = musicTracks[level];
        backgroundMusic.load();
    }

    // Inject the Google Maps script with the API key from config.js
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=geometry`;
    document.head.appendChild(script);

    crosswordCells.forEach(cell => {
        cell.addEventListener('input', checkCrossword);
    });

    function checkCrossword() {
        const answer = Array.from(crosswordCells).map(cell => cell.value.toUpperCase()).join('');
        if (answer === 'EMU') {
            congratulations2.style.display = 'block';
            nextButton2.classList.remove('hidden');
        }
    }

    function loadStreetView() {
        currentStreetViewLocationIndex = Math.floor(Math.random() * streetViewLocations.length);
        currentStreetViewLocation = streetViewLocations[currentStreetViewLocationIndex];

        if (!panorama) {
            panorama = new google.maps.StreetViewPanorama(
                streetViewContainer,
                {
                    position: currentStreetViewLocation,
                    pov: { heading: 165, pitch: 0 },
                    zoom: 1
                }
            );
        } else {
            panorama.setPosition(currentStreetViewLocation);
        }

        if (!map) {
            map = new google.maps.Map(mapContainer, {
                center: { lat: 0, lng: 0 },
                zoom: 2
            });

            map.addListener('click', (e) => {
                placeMarker(e.latLng, map);
            });
        }

        streetViewFeedback.style.display = 'none';
        if (marker) marker.setMap(null);  // Remove the existing marker
    }

    function placeMarker(position, map) {
        if (marker) {
            marker.setPosition(position);
        } else {
            marker = new google.maps.Marker({
                position: position,
                map: map
            });
        }
    }

    submitStreetViewGuess.addEventListener('click', () => {
        if (!marker) {
            streetViewFeedback.textContent = 'Please place a marker on the map.';
            streetViewFeedback.style.display = 'block';
            return;
        }

        const guessedLocation = marker.getPosition();
        const actualLocation = new google.maps.LatLng(currentStreetViewLocation.lat, currentStreetViewLocation.lng);

        const distance = google.maps.geometry.spherical.computeDistanceBetween(guessedLocation, actualLocation) / 1000; // Distance in km
        const score = Math.max(0, 100 - distance); // Simple scoring: 100 points max, decreasing with distance

        streetViewFeedback.textContent = `Your guess was ${distance.toFixed(2)} km away. Your score: ${score.toFixed(2)}`;
        streetViewFeedback.style.display = 'block';

        if (score >= 90) { // Arbitrary threshold for "success"
            congratulations3.style.display = 'block';
            nextButton3.classList.remove('hidden');
        }
    });
});
