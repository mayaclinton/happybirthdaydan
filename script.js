document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('start-button');
    const landingPage = document.getElementById('landing-page');
    const levelContainer = document.getElementById('level-container');
    const gridContainer = document.getElementById('grid');
    const nextButton = document.getElementById('next-button');

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
        const itemName = item.textContent;
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
                    nextButton.classList.remove('hidden');
                    alert('Congratulations! You have found all groups.');
                } else {
                    alert('Correct! You found a group.');
                }
            } else {
                alert('Incorrect grouping. Try again.');
                selectedItems.forEach(selectedItem => {
                    selectedItem.classList.remove('selected');
                });
            }
            selectedItems = [];
        }
    }
});
