import { pageSettings, pages, wordSets } from '../components/data.js';
import { navigateToSet } from '../components/navigation.js';
import { wordSetCards } from '../components/cards/index.js';

export const pageHome = {
  onCreate: () => {
    const mainPageContainer = document.createElement('div');
    mainPageContainer.classList.add('categories-container', 'main-container');

    pageSettings
      .get(pages.home)
      .sets.forEach((setId) => mainPageContainer.appendChild(wordSetCards.createCard(wordSets[setId])));

    return mainPageContainer;
  },
  afterCreating() {
    listenCards();
  },
};
function listenCards() {
  const mainPageContainer = document.querySelector('.main-container');
  mainPageContainer.addEventListener('click', (event) => {
    const { target: activeEl } = event;
    const card = (() => {
      switch (true) {
        case activeEl.classList.contains('category-card'):
          return activeEl;
        case !!activeEl.closest('.category-card'):
          return activeEl.closest('.category-card');
        default:
          return undefined;
      }
    })();

    if (!card) return;

    const { setId } = card.dataset;
    navigateToSet(event, {
      page: pages.sets,
      setId,
      setName: wordSets[setId],
    });
  });
}
