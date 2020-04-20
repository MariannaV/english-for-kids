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
  afterCreating: () => {
    document.querySelectorAll('.category-card').forEach((card) => {
      card.addEventListener('click', (event) => {
        const { setId } = card.dataset;
        navigateToSet(event, {
          page: pages.sets,
          setId,
          setName: wordSets[setId],
        });
      });
    });
  },
};
