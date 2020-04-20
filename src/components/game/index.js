import { setsData, pages } from '../data.js';
import { navigateToSet } from '../navigation.js';
import { render } from '../../pages/common.js';

export function gameHandlers({ orderList }) {
  let currentIndex = 0;
  const gameErrors = [];

  const mainContainer = document.getElementById('contentContainer');
  const errorSign = new Audio('assets/audio/error.mp3');
  const failureSign = new Audio('assets/audio/failure.mp3');
  const successSign = new Audio('assets/audio/success.mp3');
  const correctSign = new Audio('assets/audio/correct.mp3');

  return {
    get currentId() {
      return [...orderList][currentIndex];
    },
    get audioWord() {
      return new Audio(`/assets/${setsData.get(history.state.setId).cards[this.currentId].audioSrc}`);
    },
    next() {
      currentIndex++;
      if (currentIndex !== orderList.size) setTimeout(() => this.audioWord.play(), 1000);
      else {
        if (gameErrors.length === 0) {
          mainContainer.innerHTML =
            '<div class="result-block success"><p>Win!</p><img src="img/content/success.jpg"></div>';
          successSign.play();
        } else {
          mainContainer.innerHTML = `<div class="result-block fail"><p> ${gameErrors.length} errors</p><img src="img/content/failure.jpg"></div>`;
          failureSign.play();
        }
        document.body.classList.add('results');

        setTimeout(() => {
          document.querySelector('header .toggle-button-block').click();
          document.body.classList.remove('results');
          navigateToSet(undefined, {
            page: pages.home,
            setId: null,
            setName: null,
          });
        }, 3000);
      }
    },
    check(el, index) {
      const star = starCreate();
      const isWrongChoice = index !== this.currentId;
      if (isWrongChoice) {
        star.classList.add('error');
        gameErrors.push('error');
        errorSign.play();
      } else {
        el.classList.add('inactive');
        star.classList.add('success');
        correctSign.play();
      }

      document.querySelector('.raiting-stars').append(star);

      if (!isWrongChoice) this.next();
    },
  };
}

export function starsCreate() {
  const starsContainer = document.createElement('div');
  starsContainer.classList.add('raiting-stars');
  return starsContainer;
}

function starCreate() {
  const star = document.createElement('div');
  star.classList.add('star');
  return star;
}

export function startGameButtonCreate() {
  const button = document.createElement('button');
  button.classList.add('button', 'game-button');
  button.innerText = 'Start game';
  return button;
}

export function toggleThemes(el) {
  const { body } = document;
  //TODO: refactor it
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

export function randomNumbersArray() {
  const randomArray = new Set();
  const currentSet = setsData.get(history.state.setId).cards;
  while (randomArray.size < currentSet.length) randomArray.add(parseInt(Math.random() * currentSet.length)); // currenSet[...].word
  return randomArray;
}
