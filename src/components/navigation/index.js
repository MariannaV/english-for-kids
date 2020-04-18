import { setData, cardsCreate } from '/js/components/cards/index.js'
import { gameHandlers, startGameButtonCreate, starsCreate } from '/js/components/game/index.js'

export function render() {
  const { setId } = history?.state,
    { contentContainer } = window
  let fragment = document.createDocumentFragment()
  console.log('render with', setId)
  if (setId) {
    fragment.append(starsCreate())
    fragment.appendChild(cardsCreate())
    fragment.appendChild(startGameButtonCreate())
  } else if (setId === 'main-page') {
    console.log('createMainPage')
    fragment.appendChild(createMainPage())
    // return contentContainer.insertAdjacentElement('beforebegin', createMainPage())
  }

  contentContainer.innerHTML = ''
  contentContainer.append(fragment)

  // rotate cards
  document.querySelectorAll('.set-card').forEach((cardEl) => {
    cardEl.querySelector('.rotate-block').addEventListener('click', () => cardEl.classList.add('rotate'))
    cardEl.addEventListener('mouseleave', () => cardEl.classList.remove('rotate'))
  })
  // start button => repeat button
  const startGameButton = document.querySelector('.game-button')
  // let gameStorage = window.localStorage()
  startGameButton.addEventListener(
    'click',
    (() => {
      const handlers = gameHandlers({ orderList: randomNumbersArray() })
      //смотреть на класс/переменную игра идёт на body
      return () => {
        if (startGameButton.classList.contains('game-button')) {
          // handlers = gameHandlers({orderList: randomNumbersArray()})
          document.querySelectorAll('.set-card').forEach((el, index) =>
            el.addEventListener('click', () => {
              handlers.check(el, index)
            })
          )
          handlers.audioWord.play()
        }
        startGameButton.classList.add('repeat-button')
        startGameButton.classList.remove('game-button')

        if (startGameButton.classList.contains('repeat-button')) {
          console.log('REPEAT', handlers)
          handlers.audioWord.play()
        }
      }
    })()
  )
  // const repeatButton = document.querySelector('.repeat-button');
  // console.log(repeatButton)
  //     repeatButton.addEventListener('click', () =>{
  //         handlers.audioWord.play();
  // })
}

export function navigateToSet(event, { setId, setName }) {
  history.pushState({ setId }, setName)
  render()
}

function randomNumbersArray() {
  let randomArray = new Set(),
    currentSet = setData.get(history.state.setId).cards
  while (randomArray.size < currentSet.length) randomArray.add(parseInt(Math.random() * currentSet.length)) //currenSet[...].word
  return randomArray
}
