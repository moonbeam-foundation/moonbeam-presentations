const routes = require('next-routes')();

// Custom routes inside our application
// It will export a set of navigation helpers

// Order is sometime important to prevent the wildcard to show the NEW page as a wildcard page
// The first component of add is the directory in the browser and the second is the local file to show
routes
   .add('/campaigns/new', '/campaigns/new')
   .add('/campaigns/:address', '/campaigns/show')
   .add('/campaigns/:address/requests', '/campaigns/requests/index')
   .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;
