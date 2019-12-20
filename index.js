/////////////////////Orquestador/////////////////////
const readline = require('readline-sync'); //add dependencia no terminal 

function start () {
  const content = {}

  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

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