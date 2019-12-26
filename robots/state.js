const fs = require('fs')
const contenteFilePath = './content.json'

//////////METODO SALVAR\\\\\\\\\\\\\\
function save(content){
  const contentString = JSON.stringify(content)
  return fs.writeFileSync(contenteFilePath, contentString)
}

///////////////CARREGAR\\\\\\\\\\\\\\\\\
function load(){
  const fileBuffer = fs.readFileSync(contenteFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)
  return contentJson
}

module.exports = {
  save,
  load
}