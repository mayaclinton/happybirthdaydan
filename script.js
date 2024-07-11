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
    const riddle = document.getElementById('riddle');
    const riddleAnswerInput = document.getElementById('riddle-answer');
    const submitRiddleAnswer = document.getElementById('submit-riddle-answer');
    const riddleFeedback = document.getElementById('riddle-feedback');

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

    const riddles = [
        { question: 'What has keys but can’t open locks?', answer: 'keyboard' },
        { question: 'What can travel around the world while staying in a corner?', answer: 'stamp' },
        { question: 'What gets wetter as it dries?', answer: 'towel' }
    ];
    let currentRiddleIndex = 0;

    const groupColors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'];

    let selectedItems = [];
    let groupedItems = 0;
    let currentGroupIndex = 0;

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
        loadRiddle();
    });

    function loadRiddle() {
        if (currentRiddleIndex < riddles.length) {
            riddle.textContent = riddles[currentRiddleIndex].question;
            riddleAnswerInput.value = '';
            riddleFeedback.style.display = 'none';
        } else {
            congratulations3.style.display = 'block';
            nextButton3.classList.remove('hidden');
        }
    }

    submitRiddleAnswer.addEventListener('click', () => {
        const userAnswer = riddleAnswerInput.value.trim().toLowerCase();
        if (userAnswer === riddles[currentRiddleIndex].answer) {
            currentRiddleIndex++;
            loadRiddle();
        } else {
            riddleFeedback.textContent = 'Incorrect answer. Try again.';
            riddleFeedback.style.display = 'block';
        }
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
});
