const routes = {
  home: '/home',
  sets: '/sets/:setId',
};

function createRoute({ page, ...params }) {
  return routes[page].replace(
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
