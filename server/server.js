require('newrelic');
const express = require('express');
const path = require('path');
// const morgan = require('morgan');
const restaurantsInfoRouter = require('./routes/routes.js');
// const bundleRouter = require('./routes/bundleRouter.js');
const request = require('request');

const app = express();

// app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.redirect('/restaurants/1/');
})

app.use(express.static('public'));
// app.get('/restaurants/:id/:widget/bundle.js', bundleRouter);

app.get('/api/restaurants/:id/:widget', restaurantsInfoRouter);

// app.use('/api/restaurants/:id/overview', function(req,res) {
//   var newurl = `http://13.56.160.130:3002/api/restaurants/${req.params.id}/overview`;
//   request(newurl)
//     .on('error', console.error.bind(console, 'error =>'))
//     .pipe(res);
// });

const clientBundles = './public/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service-config.json');
const services = require('../loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('../templates/layout');
const App = require('../templates/app');
const Scripts = require('../templates/scripts');

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  });
}

app.get('/restaurants/:id', function(req, res){
  let components = renderComponents(services, {itemid: req.params.id});
  res.end(Layout(
    'SDC Demo',
    App(...components),
    Scripts(Object.keys(services))
  ));
});

app.listen(4001, () => {
  console.log('Proxy listening on port 4001');
});
