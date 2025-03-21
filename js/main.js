let cards = JSON.parse(localStorage.getItem('cards')) || { column1: [], column2: [], column3: [] };

function render() {
    document.getElementById('cards1').innerHTML = '';
    document.getElementById('cards2').innerHTML = '';
    document.getElementById('cards3').innerHTML = '';

    cards.column1.forEach((card, index) => {
        document.getElementById('cards1').innerHTML += createCardHTML(card, index, 1);
    });
    cards.column2.forEach((card, index) => {
        document.getElementById('cards2').innerHTML += createCardHTML(card, index, 2);
    });
    cards.column3.forEach((card, index) => {
        document.getElementById('cards3').innerHTML += createCardHTML(card, index, 3);
    });
}

function createCardHTML(card, index, column) {
    return `
        <div class="card" style="background-color: ${card.bgColor}; color: ${card.textColor};">
            <h3 contenteditable="true" onblur="editCardTitle(${column}, ${index}, this.innerText)">${card.title}</h3>
            <textarea onblur="editCardDescription(${column}, ${index}, this.value)">${card.description || ''}</textarea>
            <ul>
                ${card.items.map((item, i) => `
                    <li>
                        <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleItem(${column}, ${index}, ${i})">
                        <span contenteditable="true" onblur="editItem(${column}, ${index}, ${i}, this.innerText)">${item.text}</span>
                    </li>
                `).join('')}
            </ul>
            <button onclick="customizeCard(${column}, ${index})">Кастомизировать</button>
            ${card.completedDate ? `<p>Завершено: ${card.completedDate}</p>` : ''}
            ${column === 1 && cards.column2.length < 5 ? '<button onclick="deleteCard(1, ' + index + ')">Удалить</button>' : ''}
        </div>
    `;
}