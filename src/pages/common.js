import { setData, cardsCreate } from '../components/cards/index.js';
import { gameHandlers, startGameButtonCreate, starsCreate } from '../components/game/index.js';
import { pageHome } from './home.js';

export const pages = {
    home: 'home',
    sets: 'sets',
  },
  routes = {
    home: '/home',
    sets: '/sets/:setId',
  },
  wordSets = {
    'action-0': {
      src: 'img/content/dance.jpg',
      text: 'Action (set A)',
      setId: 'action-0',
    },
    'action-1': {
      src: 'img/content/swim.jpg',
      text: 'Action (set B)',
      setId: 'action-1',
    },
    'action-2': {
      src: 'img/content/drop.jpg',
      text: 'Action (set C)',
      setId: 'action-2',
    },
    'adjective-0': {
      src: 'img/content/friendly.jpg',
      text: 'Adjective',
      setId: 'adjective-0',
    },
    'animal-0': {
      src: 'img/content/cat.jpg',
      text: 'Animal (set A)',
      setId: 'animal-0',
    },
    'animal-1': {
      src: 'img/content/bird.jpg',
      text: 'Animal (set B)',
      setId: 'animal-1',
    },
    'clothes-0': {
      src: 'img/content/blouse.jpg',
      text: 'Clothes',
      setId: 'clothes-0',
    },
    'emotion-0': {
      src: 'img/content/smile.jpg',
      text: 'Emotion',
      setId: 'emotion-0',
    },
  },
  pageSettings = new Map([
    [
      pages.home,
      {
        title: () => 'Главная',
        page: pages.home,
        sets: [
          wordSets['action-0'].setId,
          wordSets['action-1'].setId,
          wordSets['action-2'].setId,
          wordSets['adjective-0'].setId,
          wordSets['animal-0'].setId,
          wordSets['animal-1'].setId,
          wordSets['clothes-0'].setId,
          wordSets['emotion-0'].setId,
        ],
      },
    ],
    [
      pages.sets,
      {
        page: pages.sets,
        title: ({ setId }) => wordSets[setId].text,
      },
    ],
  ]);

window.onload = () => {
  render();
};

window.onpopstate = () => {
  render();
};

function render() {
  const { page = pages.home } = history?.state ?? {},
    { contentContainer } = window,
    fragment = document.createDocumentFragment();

  let callbackAfterCreating = Function.prototype,
    pageTitleArgs,
    activeURL;

  switch (page) {
    case pages.sets: {
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
              const { cardId } = cardEl.closest('.set-card').dataset,
                { audioSrc } = setData.get(setId).cards.find(({ word }) => word === cardId),
                audioWord = new Audio(`/assets/${audioSrc}`);
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

export function navigateToSet(event, { setId, setName, page }) {
  event?.preventDefault?.();
  history.pushState({ setId, page }, setName);
  render();
}

function randomNumbersArray() {
  const randomArray = new Set();
  const currentSet = setData.get(history.state.setId).cards;
  while (randomArray.size < currentSet.length) randomArray.add(parseInt(Math.random() * currentSet.length)); // currenSet[...].word
  return randomArray;
}

function toggleThemes(el) {
  const { body } = document;
  if (el.classList.contains('green')) {
    el.classList.remove('green');
    el.classList.add('orange');
    if (body.classList.contains(el.dataset.on)) {
      body.classList.remove(el.dataset.on);
      render();
    }
    body.classList.add(el.dataset.off);
  } else if (el.classList.contains('orange')) {
    el.classList.remove('orange');
    el.classList.add('green');
    if (body.classList.contains(el.dataset.off)) {
      body.classList.remove(el.dataset.off);
      render();
    }
    body.classList.add(el.dataset.on);
  }
}

[navigateToSet, toggleThemes].forEach((func) => {
  window[func.name] = func;
});

/* HEADER NAVIGATION: START */
const toggleMenuInput = document.getElementById('toggle-menu'),
  onOutsideHeaderMenuClick = (event) => {
    const ignoredParents = ['label[for="toggle-menu"]', '.header-navigation'];
    if (ignoredParents.every((selector) => !event.target.closest(selector))) {
      toggleMenuInput.checked = false;
      window.removeEventListener('click', onOutsideHeaderMenuClick);
    }
  },
  menuLinks = document.querySelectorAll('.header-link');

menuLinks.forEach((el) =>
  el.addEventListener('click', () => {
    toggleMenuInput.checked = false;
  })
);

function toggleActiveHeaderLink({ url }) {
  const activeClass = 'active',
    prevLink = document.querySelector(`.header-navigation .header-link.${activeClass}`),
    newLink = document.querySelector(`.header-navigation .header-link[href="${url}"]`);
  if (prevLink) prevLink.classList.remove(activeClass);
  if (newLink) newLink.classList.add(activeClass);
}

function createRoute({ page, ...params }) {
  const url = routes[page];
  if (!Object.keys(params).length) return url;
  return url.replace(
    new RegExp(
      Object.keys(params)
        .map((param) => `:${param}`)
        .join('|'),
      'g'
    ),
    (match) => {
      const paramKey = match.substring(1);
      return params[paramKey];
    }
  );
}

toggleMenuInput.addEventListener('click', (inputEvent) => {
  inputEvent.stopPropagation();
  if (toggleMenuInput.checked) window.addEventListener('click', onOutsideHeaderMenuClick);
});

/* HEADER NAVIGATION: END */
