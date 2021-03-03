const { createServer } = require('http');
const next = require('next');

// Manually start up our Next.js app and point it to routes.js
// Code obtained from the Next.js documentation

const app = next({
   dev: process.env.NODE_EVN !== 'production',
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
   createServer(handler).listen(3000, (err) => {
      if (err) throw err;
      console.log('Ready on localhost:3000');
   });
});
