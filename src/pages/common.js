import { pages, pageSettings, setsData } from '../components/data.js';
import { navigateToSet, createRoute } from '../components/navigation.js';
import { cardsCreate } from '../components/cards/index.js';
import {
  gameHandlers,
  startGameButtonCreate,
  starsCreate,
  toggleThemes,
  randomNumbersArray,
} from '../components/game/index.js';
import { pageHome } from './home.js';

window.onload = () => {
  render();
};

window.onpopstate = () => {
  render();
};

export function render() {
  const { page = pages.home } = history?.state ?? {};
  const { contentContainer } = window;
  const fragment = document.createDocumentFragment();

  let callbackAfterCreating = Function.prototype;
  let pageTitleArgs;
  let activeURL;

  switch (page) {
    case pages.sets: {
      //TODO: refactor as case 'home'
      const { setId } = history.state;
      pageTitleArgs = { setId };
      fragment.append(starsCreate());
      fragment.appendChild(cardsCreate());
      fragment.appendChild(startGameButtonCreate());
      activeURL = createRoute({ page, setId });
      callbackAfterCreating = () => {
        document.querySelectorAll('.set-card .front img').forEach((cardEl) => {
          cardEl.addEventListener(
            'click',
            (() => {
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

        // let gameStorage = window.localStorage()
        const startGameButton = document.querySelector('.game-button');
        startGameButton.addEventListener(
          'click',
          (() => {
            const handlers = gameHandlers({ orderList: randomNumbersArray() });
            // смотреть на класс/переменную игра идёт на body
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
      };
      break;
    }

    case pages.home: {
      fragment.appendChild(pageHome.onCreate());
      activeURL = createRoute({ page });
      callbackAfterCreating = pageHome.afterCreating;
      break;
    }

    default:
      break;
  }

  contentContainer.innerHTML = '';
  contentContainer.append(fragment);
  document.title = pageSettings.get(page).title(pageTitleArgs);
  toggleActiveHeaderLink({ url: activeURL });
  callbackAfterCreating();
}

//TODO: replace to addEventListeners
[navigateToSet, toggleThemes].forEach((func) => {
  window[func.name] = func;
});

/* HEADER NAVIGATION: START */
const toggleMenuInput = document.getElementById('toggle-menu');
const onOutsideHeaderMenuClick = (event) => {
  const ignoredParents = ['label[for="toggle-menu"]', '.header-navigation'];
  if (ignoredParents.every((selector) => !event.target.closest(selector))) {
    toggleMenuInput.checked = false;
    window.removeEventListener('click', onOutsideHeaderMenuClick);
  }
};
const menuLinks = document.querySelectorAll('.header-link');

menuLinks.forEach((el) =>
  el.addEventListener('click', () => {
    toggleMenuInput.checked = false;
  })
);

function toggleActiveHeaderLink({ url }) {
  const activeClass = 'active';
  const prevLink = document.querySelector(`.header-navigation .header-link.${activeClass}`);
  const newLink = document.querySelector(`.header-navigation .header-link[href="${url}"]`);
  if (prevLink) prevLink.classList.remove(activeClass);
  if (newLink) newLink.classList.add(activeClass);
}

toggleMenuInput.addEventListener('click', (inputEvent) => {
  inputEvent.stopPropagation();
  if (toggleMenuInput.checked) window.addEventListener('click', onOutsideHeaderMenuClick);
});

/* HEADER NAVIGATION: END */
