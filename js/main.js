new Vue({
    el: '#app',
    data() {
        return {
            cards: JSON.parse(localStorage.getItem('cards')) || { column1: [], column2: [], column3: [] }
        };
    },
    methods: {
        render() {
            localStorage.setItem('cards', JSON.stringify(this.cards));
        },
        addCard(column) {
            const title = prompt('Введите заголовок карточки:');
            let numberOfItems;
            do {
                numberOfItems = parseInt(prompt('Введите количество пунктов списка (от 3 до 5):'), 10);
            } while (isNaN(numberOfItems) || numberOfItems < 3 || numberOfItems > 5);

            const items = [];
            for (let i = 0; i < numberOfItems; i++) {
                const itemText = prompt(`Введите текст пункта списка ${i + 1}:`);
                items.push({ text: itemText, completed: false });
            }

            const newCard = { title, items, bgColor: '#fff', textColor: '#000', description: '' };

            if (column === 1 && this.cards.column1.length < 3) {
                this.cards.column1.push(newCard);
            } else if (column === 2 && this.cards.column2.length < 5) {
                this.cards.column2.push(newCard);
            } else if (column === 3) {
                // В третьем столбце нет ограничений
                this.cards.column3.push(newCard);
            } else {
                alert('Достигнуто максимальное количество карточек в этом столбце.');
            }

            this.render();
        },
        editCardTitle(column, index, newTitle) {
            this.cards['column' + column][index].title = newTitle;
            this.render();
        },
        editCardDescription(column, index, newDescription) {
            this.cards['column' + column][index].description = newDescription;
            this.render();
        },
        editItem(column, cardIndex, itemIndex, newText) {
            this.cards['column' + column][cardIndex].items[itemIndex].text = newText;
            this.render();
        },
        customizeCard(column, index) {
            const bgColor = prompt('Введите цвет фона (например, red, green, blue):', this.cards['column' + column][index].bgColor);
            const textColor = prompt('Введите цвет текста (например, red, green, blue):', this.cards['column' + column][index].textColor);
            this.cards['column' + column][index].bgColor = bgColor;
            this.cards['column' + column][index].textColor = textColor;
            this.render();
        },
        toggleItem(column, cardIndex, itemIndex) {
            const card = this.cards['column' + column][cardIndex];
            card.items[itemIndex].completed = !card.items[itemIndex].completed;

            const completedCount = card.items.filter(item => item.completed).length;
            const totalCount = card.items.length;

            if (column === 1 && completedCount > totalCount / 2 && this.cards.column2.length < 5) {
                this.cards.column2.push(this.cards.column1.splice(cardIndex, 1)[0]);
            } else if (column === 2 && completedCount === totalCount) {
                const completedCard = this.cards.column2.splice(cardIndex, 1)[0];
                this.cards.column3.push(completedCard);
            }
            this.render();
        },
        clearAll() {
            this.cards = { column1: [], column2: [], column3: [] };
            this.render();
        },
        canMoveToNextColumn(column) {
            return (column === 1 && this.cards.column2.length < 5) || (column === 2);
        }
    },
    mounted() {
        this.render();
    },
    template: `
     <div class="container">
       <div id="cards1" class="column">
         <h2>Столбец 1</h2>
         <button v-if="cards.column1.length < 3" @click="addCard(1)">Добавить карточку</button>
         <div v-for="(card, index) in cards.column1" :key="index" class="card" :style="{ backgroundColor: card.bgColor, color: card.textColor }">
           <h3 contenteditable="true" @blur="editCardTitle(1, index, $event.target.innerText)">{{ card.title }}</h3>
           <textarea @blur="editCardDescription(1, index, $event.target.value)">{{ card.description }}</textarea>
           <ul>
             <li v-for="(item, i) in card.items" :key="i">
               <input type="checkbox" :checked="item.completed" @change="toggleItem(1, index, i)" :disabled="!canMoveToNextColumn(1)">
               <span contenteditable="true" @blur="editItem(1, index, i, $event.target.innerText)">{{ item.text }}</span>
             </li>
           </ul>
           <button @click="customizeCard(1, index)">Кастомизировать</button>
         </div>
         <button @click="clearAll">Очистить все карточки</button>
       </div>
 
       <div id="cards2" class="column">
         <h2>Столбец 2</h2>
         <button v-if="cards.column2.length < 5" @click="addCard(2)">Добавить карточку</button>
         <div v-for="(card, index) in cards.column2" :key="index" class="card" :style="{ backgroundColor: card.bgColor, color: card.textColor }">
           <h3 contenteditable="true" @blur="editCardTitle(2, index, $event.target.innerText)">{{ card.title }}</h3>
           <textarea @blur="editCardDescription(2, index, $event.target.value)">{{ card.description }}</textarea>
           <ul>
             <li v-for="(item, i) in card.items" :key="i">
               <input type="checkbox" :checked="item.completed" @change="toggleItem(2, index, i)" :disabled="!canMoveToNextColumn(2)">
               <span contenteditable="true" @blur="editItem(2, index, i, $event.target.innerText)">{{ item.text }}</span>
             </li>
           </ul>
           <button @click="customizeCard(2, index)">Кастомизировать</button>
         </div>
       </div>
 
       <div id="cards3" class="column">
         <h2>Столбец 3</h2>
         <button @click="addCard(3)">Добавить карточку</button>
         <div v-for="(card, index) in cards.column3" :key="index" class="card" :style="{ backgroundColor: card.bgColor, color: card.textColor }">
           <h3 contenteditable="true" @blur="editCardTitle(3, index, $event.target.innerText)">{{ card.title }}</h3>
           <textarea @blur="editCardDescription(3, index, $event.target.value)">{{ card.description }}</textarea>
           <ul>
             <li v-for="(item, i) in card.items" :key="i">
               <input type="checkbox" :checked="item.completed" @change="toggleItem(3, index, i)" disabled>
               <span contenteditable="true" @blur="editItem(3, index, i, $event.target.innerText)">{{ item.text }}</span>
             </li>
           </ul>
           <button @click="customizeCard(3, index)">Кастомизировать</button>
         </div>
       </div>
     </div>
   `
});