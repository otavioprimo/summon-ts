import * as clc from 'cli-color';
import * as fs from 'fs';
import * as  prompts from 'prompts';
import * as configFile from '../templates/config';
import * as http from 'https';
import ora from 'ora';
import axios from 'axios';
import messages from '../util/messages';
import apiUrls from '../util/apiUrls';

//NOTE Just for test
async function download(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let file = fs.createWriteStream('sasad.jpg');
    let request = http.get('https://abrilsuperinteressante.files.wordpress.com/2018/05/filhotes-de-cachorro-alcanc3a7am-o-c3a1pice-de-fofura-com-8-semanas1.png', (response) => {
      if (response.statusCode !== 200) {
        reject(`Response status was ${response.statusCode}`);
      }

      response.pipe(file);
    });

    file.on('finish', () => {
      file.close();
      resolve();
    });

    file.on('error', (err) => {
      fs.unlinkSync('sasad.jpg');
      reject(err);
    });

    request.on('error', (err) => {
      fs.unlinkSync('sasad.jpg');
      reject(err);
    });
  });
}

/**
 * @description Show the cli options
 */
async function showOptionsOnConsole() {

  let optionsText: string = '';

  let response = await axios.get(apiUrls.getOptions);
  let options = response.data;

  for (let option of options) {
    optionsText += `\n\t- ${option}`;
  }

  console.log(`
    Usage:
    ${clc.green('summon <command>')}

    Global Commands:
    ${clc.greenBright(optionsText)}
  `)
}

/**
 * @description Create configuration file summon.json
 */
function createConfigFile() {
  let config = configFile.init();

  if (!fs.existsSync(config.path))
    fs.writeFileSync(config.path, config.body);
  else {
    console.log(clc.redBright('Error: '), messages.existConfigFile);
    process.exit();
  }
}

/**
 * @description Ask to the user which template to choose
 * @returns Promise<string> Template Reference
 */
async function askAndReturnTemplate(): Promise<string> {
  //Show loading
  let spinner = ora({
    text: 'Fetching templates',
    color: 'blue'
  }).start();

  // NEW
  return new Promise(async (resolve, reject) => {
    let response = await axios.get(apiUrls.getTemplates);
    let templates: TemplatesResponse[] = response.data;

    spinner.succeed(); //Finish loading

    //Fill with templates
    let choices: any[] = []
    for (let template of templates) {
      choices.push({
        title: `${template.name} - ${template.demo}`,
        value: `${template.reference}`
      });
    }

    //Prompt the question
    let question: any = {
      type: 'select',
      name: 'template',
      message: clc.green('Choose a template:'),
      choices: choices,
      validate: value => typeof value === 'string' ? value.trim() !== '' : false
    };

    const promptOptions = {
      onCancel: () => reject(process.exit())
    }

    const answer = await prompts(question, promptOptions);
    resolve(answer['template']);
  })
}

export {
  createConfigFile,
  askAndReturnTemplate,
  showOptionsOnConsole,
  download
}

interface TemplatesResponse {
  name?: string;
  reference?: string;
  demo?: string;
}