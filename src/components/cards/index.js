import { setsData } from '../data.js';

export const wordSetCards = {
  createCard: (data) => {
    const card = document.createElement('a');
    card.classList.add('category-card');
    card.dataset.setId = data.setId;
    card.insertAdjacentHTML(
      'beforeend',
      `
          <img src=${data.src}>
          <p>${data.text}</p>`
    );
    return card;
  },
};

export const wordCards = {
  // cardCreate:
  // cardsCreate
};

export function cardsCreate() {
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('categories-container');
  const { setId } = history.state;
  setsData.get(setId).cards.forEach(function (cardData) {
    cardsContainer.appendChild(cardCreate(cardData));
  });
  return cardsContainer;
}

export function cardCreate(data) {
  const card = document.createElement('div');
  card.classList.add('set-card');
  card.dataset.cardId = data.word;
  card.insertAdjacentHTML(
    'beforeend',
    `
               <div class='front'>
                   <img src=${data.image}>
                   <p>${data.word}</p>
                   <div class='rotate-block'></div>
               </div>
               <div class="back">
                   <img src=${data.image}>
                   <p>${data.translation}</p>
               </div>
         `
  );
  return card;
}
