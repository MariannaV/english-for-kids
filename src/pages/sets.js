import { setsData } from '../components/data.js';
import { gameHandlers, randomNumbersArray, starsCreate, startGameButtonCreate } from '../components/game/index.js';
import { cardsCreate } from '../components/cards/index.js';

export const pageSets = {
  onCreate: () => {
    const mainPageContainer = document.createDocumentFragment();
    mainPageContainer.append(starsCreate(), cardsCreate(), startGameButtonCreate());
    return mainPageContainer;
  },
  afterCreating: () => {
    document.querySelectorAll('.set-card .front img').forEach((cardEl) => {
      cardEl.addEventListener(
        'click',
        (() => {
          const { setId } = history.state;
          const { cardId } = cardEl.closest('.set-card').dataset;
          const { audioSrc } = setsData.get(setId).cards.find(({ word }) => word === cardId);
          const audioWord = new Audio(`/assets/${audioSrc}`);
          return () => document.body.classList.contains('train') && audioWord.play();
        })()
      );
      cardEl
        .closest('.set-card')
        .querySelector('.rotate-block')
        .addEventListener('click', () => cardEl.closest('.set-card').classList.add('rotate'));
      cardEl
        .closest('.set-card')
        .addEventListener('mouseleave', () => cardEl.closest('.set-card').classList.remove('rotate'));
    });
    const startGameButton = document.querySelector('.game-button');
    startGameButton.addEventListener(
      'click',
      (() => {
        const handlers = gameHandlers({ orderList: randomNumbersArray() });
        return () => {
          if (startGameButton.classList.contains('game-button'))
            document.querySelectorAll('.set-card').forEach((el, index) =>
              el.addEventListener('click', () => {
                handlers.check(el, index);
              })
            );

          startGameButton.classList.add('repeat-button');
          startGameButton.classList.remove('game-button');
          handlers.audioWord.play();
        };
      })()
    );
  },
};
