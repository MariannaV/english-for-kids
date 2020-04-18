import { setData, cardsCreate } from '../components/cards/index.js';
import { gameHandlers, startGameButtonCreate, starsCreate } from '../components/game/index.js';
import { createMainPage } from './home';

// export from module to window
[navigateToSet, toggleThemes].forEach((func) => {
  window[func.name] = func;
});

window.onpopstate = () => {
  render();
};

function render() {
  const { setId } = history?.state;
  const { contentContainer } = window;
  const fragment = document.createDocumentFragment();
  console.log('render with', setId);
  if (setId) {
    fragment.append(starsCreate());
    fragment.appendChild(cardsCreate());
    fragment.appendChild(startGameButtonCreate());
  } else if (setId === 'main-page') {
    console.log('createMainPage');
    fragment.appendChild(createMainPage());
    // return contentContainer.insertAdjacentElement('beforebegin', createMainPage())
  }

  contentContainer.innerHTML = '';
  contentContainer.append(fragment);

  // rotate cards
  document.querySelectorAll('.set-card').forEach((cardEl) => {
    cardEl.querySelector('.rotate-block').addEventListener('click', () => cardEl.classList.add('rotate'));
    cardEl.addEventListener('mouseleave', () => cardEl.classList.remove('rotate'));
  });
  // start button => repeat button
  const startGameButton = document.querySelector('.game-button');
  // let gameStorage = window.localStorage()
  startGameButton.addEventListener(
    'click',
    (() => {
      const handlers = gameHandlers({ orderList: randomNumbersArray() });
      // смотреть на класс/переменную игра идёт на body
      return () => {
        if (startGameButton.classList.contains('game-button')) {
          // handlers = gameHandlers({orderList: randomNumbersArray()})
          document.querySelectorAll('.set-card').forEach((el, index) =>
            el.addEventListener('click', () => {
              handlers.check(el, index);
            })
          );
          handlers.audioWord.play();
        }
        startGameButton.classList.add('repeat-button');
        startGameButton.classList.remove('game-button');

        if (startGameButton.classList.contains('repeat-button')) {
          console.log('REPEAT', handlers);
          handlers.audioWord.play();
        }
      };
    })()
  );
  // const repeatButton = document.querySelector('.repeat-button');
  // console.log(repeatButton)
  //     repeatButton.addEventListener('click', () =>{
  //         handlers.audioWord.play();
  // })
}

function navigateToSet(event, { setId, setName }) {
  history.pushState({ setId }, setName);
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
    }
    body.classList.add(el.dataset.off);
  } else if (el.classList.contains('orange')) {
    el.classList.remove('orange');
    el.classList.add('green');
    if (body.classList.contains(el.dataset.off)) {
      body.classList.remove(el.dataset.off);
    }
    body.classList.add(el.dataset.on);
  }
}
// end toggle theme
const toggleMenuInput = document.getElementById('toggle-menu');
const menuLinks = document.querySelectorAll('.header-link');
// (function hideMenu(){
menuLinks.forEach((el) =>
  el.addEventListener('click', () => {
    toggleMenuInput.checked = false;
  })
);
