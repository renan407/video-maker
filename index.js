/////////////////////Orquestador/////////////////////
const readline = require('readline-sync'); //add dependencia no terminal 
const robots ={
  text: require('./robots/text.js')
}

async function start () {
  const content = {}

  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

  await robots.text(content)

  function askAndReturnSearchTerm(){ //pegando input do usuario
    return readline.question('Type a Wikipedia search term: ');
  }

  function askAndReturnPrefix(){// criando um prefixo e retornando um indice
      const prefixes = ['Who is', 'What is', 'The history of'];
      const selectPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ');
      const selectPrefixText = prefixes[selectPrefixIndex];

     return selectPrefixText;
  }
  console.log(content);
}

start();