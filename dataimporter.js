#!/usr/bin/env node

/**
 * Module dependencies.
 */
//   node cmd -p

global.__basepath = process.cwd();

global.app = new require("express")();

require("./app");

require("./app/kernel");
require("./lib/helpers");
/* Configurations */
app.loadConfig();
app.loadModels();

