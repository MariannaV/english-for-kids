//I need to double it because I want to use it in header.pug and get it from gulpfile

const routes = {
  home: '/home',
  sets: '/sets/:setId',
};

function createRoute({ page, ...params }) {
  const urlPattern = routes[page];
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

module.exports = {
  createRoute,
};
