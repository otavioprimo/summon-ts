#!/usr/bin/env node
import * as library from '../lib';

const args = process.argv.splice(process.execArgv.length + 2);

start();

async function start() {

  if (args.length === 0) {
    library.showOptionsOnConsole();
  } else {
    for (let el of args) {
      if (el === 'init')
        await library.createConfigFile();

      if (el === 'template') {
        let template = await library.askAndReturnTemplate();
        console.log(template);
        //TODO Download the template
      }
    }
  }

}