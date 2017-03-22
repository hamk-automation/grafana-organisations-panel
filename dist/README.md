# Dashboard List Panel Plugin for Grafana
This is a panel plugin for [Grafana](http://grafana.org/). It shows a list of dashboards in user's current organization and a list of organizations
the user belongs to.

To understand what is a plugin, read the [Grafana's documentation about plugins](http://docs.grafana.org/plugins/development/).

### Features
* [Angular.js (1.0)](https://angularjs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Pug](https://pugjs.org/api/getting-started.html)
* [Sass](http://sass-lang.com/)

### Compiling
```
npm install
grunt
```
The compiled product is in ``dist`` folder.

### Deployment
Copy the contents of ``dist`` folder to ``plugins/dashboard-list`` folder so Grafana will find the plugin and it can be used in Grafana dashboards.
