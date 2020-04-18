const mainPageMap = new Map([
  [
    'main-page',
    {
      title: 'Main Page',
      cards: [
        {
          src: 'img/content/dance.jpg',
          text: 'Action (set A)',
          setId: 'action-0',
          page: 'set',
        },
        {
          src: 'img/content/swim.jpg',
          text: 'Action (set B)',
          setId: 'action-1',
          page: 'set',
        },
        {
          src: 'img/content/drop.jpg',
          text: 'Action (set C)',
          setId: 'action-2',
          page: 'set',
        },
        {
          src: 'img/content/friendly.jpg',
          text: 'Adjective',
          setId: 'adjective-0',
          page: 'set',
        },
        {
          src: 'img/content/cat.jpg',
          text: 'Animal (set A)',
          setId: 'animal-0',
          page: 'set',
        },
        {
          src: 'img/content/bird.jpg',
          text: 'Animal (set B)',
          setId: 'animal-1',
          page: 'set',
        },
        {
          src: 'img/content/blouse.jpg',
          text: 'Clothes',
          setId: 'clothes-0',
          page: 'set',
        },
        {
          src: 'img/content/smile.jpg',
          text: 'Emotion',
          setId: 'emotion-0',
          page: 'set',
        },
      ],
    },
  ],
]);

// main page
export function createMainPage() {
  const mainPageContainer = document.createElement('div');
  mainPageContainer.classList.add('categories-container', 'main-container');
  // const { setId } = history.state;
  mainPageMap.get('main-page').cards.forEach(function (cardData) {
    mainPageContainer.appendChild(mainPageCardCreate(cardData));
  });
  return mainPageContainer;
}

function mainPageCardCreate(data) {
  const card = document.createElement('a');
  card.classList.add('category-card');
  card.insertAdjacentHTML(
    'beforeend',
    `
                           <img src=${data.src}>
                           <p>${data.text}</p>
                         `
  );
  return card;
}
