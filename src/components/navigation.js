import { routes } from './data.js';
import { render } from '../pages/common.js';

export function navigateToSet(event, { setId, setName, page }) {
  event?.preventDefault?.();
  history.pushState({ setId, page }, setName);
  render();
}

export function createRoute({ page, ...params }) {
  const urlPattern = routes[page].source;
  if (!Object.keys(params).length) return urlPattern;
  return urlPattern.replace(
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
