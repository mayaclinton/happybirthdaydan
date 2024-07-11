import config from './config.js';

document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('start-button');
    const landingPage = document.getElementById('landing-page');
    const levelContainer = document.getElementById('level-container');
    const gridContainer = document.getElementById('grid');
    const nextButton1 = document.getElementById('next-button-1');
    const nextButton2 = document.getElementById('next-button-2');
    const nextButton3 = document.getElementById('next-button-3');
    const hintButtonWordplay = document.getElementById('hint-button-wordplay');
    const hintWordplay = document.getElementById('hint-wordplay');
    const hintButtonDefinition = document.getElementById('hint-button-definition');
    const hintDefinition = document.getElementById('hint-definition');
    const crosswordCells = document.querySelectorAll('.crossword-cell');
    const congratulations1 = document.getElementById('congratulations-1');
    const congratulations2 = document.getElementById('congratulations-2');
    const congratulations3 = document.getElementById('congratulations-3');
    const streetViewContainer = document.getElementById('street-view');
    const mapContainer = document.getElementById('map');
    const submitStreetViewGuess = document.getElementById('submit-street-view-guess');
    const streetViewFeedback = document.getElementById('street-view-feedback');
    const congratulationsPage = document.getElementById('congratulations-page');
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
        // { lat: 40.689247, lng: -74.044502, location: 'New York' },
        // { lat: -22.951916, lng: -43.2104872, location: 'Rio de Janeiro' },
        // { lat: 51.5007292, lng: -0.1246254, location: 'London' },
        // { lat: 35.658581, lng: 139.745433, location: 'Tokyo' }
    ];

    let currentStreetViewLocationIndex = 0;

    const groupColors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'];

    let selectedItems = [];
    let groupedItems = 0;
    let currentGroupIndex = 0;

    const countdownTargetDate = new Date('July 24, 2024 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownTargetDate - now;

        if (distance <= 0) {
            startButton.textContent = 'Start the Game';
            startButton.disabled = false;
            clearInterval(countdownInterval);
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            startButton.textContent = `Unlocks in ${days}d ${hours}h ${minutes}m ${seconds}s`;
            startButton.disabled = true;
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call to set the countdown immediately

    startButton.addEventListener('click', () => {
        landingPage.style.display = 'none';
        levelContainer.classList.remove('hidden');
        loadGrid();
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

    nextButton1.addEventListener('click', () => {
        document.getElementById('level-1').classList.add('hidden');
        document.getElementById('level-2').classList.remove('hidden');
    });

    hintButtonWordplay.addEventListener('click', () => {
        hintWordplay.style.display = 'block';
    });

    hintButtonDefinition.addEventListener('click', () => {
        hintDefinition.style.display = 'block';
    });

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

    nextButton2.addEventListener('click', () => {
        document.getElementById('level-2').classList.add('hidden');
        document.getElementById('level-3').classList.remove('hidden');
        loadStreetView();
    });

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

    nextButton3.addEventListener('click', () => {
        document.getElementById('level-3').classList.add('hidden');
        congratulationsPage.classList.remove('hidden');
    });

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

    // Inject the Google Maps script with the API key from config.js
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=geometry`;
    document.head.appendChild(script);
});