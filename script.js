document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('start-button');
    const landingPage = document.getElementById('landing-page');
    const levelContainer = document.getElementById('level-container');

    startButton.addEventListener('click', () => {
        landingPage.style.display = 'none';
        levelContainer.classList.remove('hidden');
        // Add code to initialize and display the first level
    });
});
