# Backbone on Express

Backbone on Express is a MV* framework that leverages Backbone.js for the client-side and server-side with some help from the Express framework. The idea is to share as many components between the server-side and client-side as possible. It is currently in an early alpha stage, but documentation will be coming soon.

# Installation

### To install backbone on express

```bash
npm install anvil.js -g
npm install backbone-on-express -g
sudo npm link backbone-on-express
```

### To scaffold your app

```bash
mkdir myApp
cd myApp
anvil gen boe
anvil gen boe:crud
backbone server
```

# API Documentation
Backbone on Express uses Backbone, so everything that Backbone can do can also be done here.

Additionally, the [API Documentation](https://github.com/tysoncadenhead/backbone-on-express/wiki) outlines methods and functionality that is provided by Backbone on Express.

# Roadmap

* Error Logging
* ~~Front-End Helpers~~
* ~~Documentation~~
* ~~Scaffolding (Anvil)~~
* ~~Build Process (Anvil)~~
* ~~Unit Testing (Mocha)~~
* Socket-IO Integration
* Option for Mustache templates (Currently, only EJS is available)
* Storage Options for couchdb, Riak, MySQL, Redis and LocalStorage. (Currently, only Mongoose is available)
