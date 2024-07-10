const flags = [
    { country: 'Brazil', img: 'brazil.png' },
    { country: 'Japan', img: 'japan.png' },
    { country: 'Canada', img: 'canada.png' },
    { country: 'Germany', img: 'germany.png' },
];

let currentFlagIndex = 0;
let score = 0;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function loadFlag() {
    const flag = flags[currentFlagIndex];
    document.getElementById('flag-image').src = flag.img;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    const options = flags.map(f => f.country);
    shuffle(options);

    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption) {
    const flag = flags[currentFlagIndex];
    if (selectedOption === flag.country) {
        score++;
        alert('Correct!');
    } else {
        alert(`Wrong! The correct answer is ${flag.country}`);
    }

    currentFlagIndex++;
    if (currentFlagIndex < flags.length) {
        loadFlag();
    } else {
        document.getElementById('game-container').innerHTML = `
            <h2>Congratulations, Daniel!</h2>
            <p>Your final score is: ${score}/${flags.length}</p>
            <p>Happy Birthday!</p>
        `;
    }
}

document.getElementById('next-button').addEventListener('click', loadFlag);

loadFlag();
