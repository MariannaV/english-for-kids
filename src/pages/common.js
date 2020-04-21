import { pages, pageSettings } from '../components/data.js';
import { navigateToSet, createRoute } from '../components/navigation.js';
import { pageHome } from './home.js';
import { pageSets } from './sets.js';
import { toggleGameModes } from '../components/game/index.js';

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
      const { setId } = history.state;
      fragment.appendChild(pageSets.onCreate());
      pageTitleArgs = { setId };
      activeURL = createRoute({ page, setId });
      callbackAfterCreating = pageSets.afterCreating;
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
[navigateToSet, toggleGameModes].forEach((func) => {
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
