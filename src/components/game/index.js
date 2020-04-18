import { setData } from '../cards/index.js';

export function gameHandlers({ orderList }) {
  let currentIndex = 0;
  const gameErrors = [];
  // let  = new Map()

  const mainContainer = document.getElementById('contentContainer');
  const errorSign = new Audio('assets/audio/error.mp3');
  const failureSign = new Audio('assets/audio/failure.mp3');
  const successSign = new Audio('assets/audio/success.mp3');
  const correctSign = new Audio('assets/audio/correct.mp3');
  const gameStatistics = new Map();
  console.log(orderList);

  return {
    get currentId() {
      return [...orderList][currentIndex];
    },
    get audioWord() {
      return new Audio(`/assets/${setData.get(history.state.setId).cards[this.currentId].audioSrc}`);
    },
    next() {
      console.log('OK', currentIndex, this.currentId);
      currentIndex++;
      if (currentIndex !== orderList.size) setTimeout(() => this.audioWord.play(), 1000);
      else {
        console.log('RESULTS');
        if (gameErrors.length === 0) {
          mainContainer.innerHTML =
            '<div class="result-block success"><p>Win!</p><img src="img/content/success.jpg"></div>';
          successSign.play();
        } else {
          mainContainer.innerHTML = `<div class="result-block fail"><p> ${gameErrors.length} errors</p><img src="img/content/failure.jpg"></div>`;
          failureSign.play();
        }
        document.body.classList.add('results');
      }
    },
    check(el, index) {
      console.log(currentIndex, this.currentId);
      const star = starCreate();
      const isWrongChoice = index !== this.currentId;
      if (isWrongChoice) {
        star.classList.add('error');
        console.log('STAR');
        console.log('ERROR', currentIndex, this.currentId, orderList);
        gameErrors.push('error');
        errorSign.play();
        console.log('errors:', `${setData.get(history.state.setId).cards[this.currentId].word}`);
      } else {
        el.classList.add('inactive');
        star.classList.add('success');
        correctSign.play();
      }

      document.querySelector('.raiting-stars').append(star);

      if (!isWrongChoice) this.next();

      gameStatistics.set([`${setData.get(history.state.setId).cards[this.currentId].word}`], '0');
      console.log(gameStatistics);
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
