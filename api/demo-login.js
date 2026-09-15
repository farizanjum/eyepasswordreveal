module.exports = (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Allow', 'POST');
    response.end();
    return;
  }
  response.statusCode = 303;
  response.setHeader('Location', '/complete');
  response.end();
};
