function init() {
  let path = 'summon.json';
  let body = `{
    "paths": {
      "html": "",
      "php": "server",
      "js": "dist/js",
      "css": "dist/css"
    }
  }`;

  let response = {
    body,
    path
  }

  return response;
}

export {
  init
}