
const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd') //observar.. caso nao funcione

const fs = require('fs');
const watsonApiKey = require('../credentials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
 
const nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: watsonApiKey}),
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

const state = require('./state.js')//importando o estado

async function robot (){// async esperar a execusao do codigo
  const content = state.load() //carregando o estado


  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);//observar.. caso nao funcione
  limitMaximumSentences(content);
  await fetchKeywordsOfAllSentences(content)

    state.save(content)// salvando o estado

  async function fetchContentFromWikipedia(content){
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm); //retorna uma promise 'pipe'
    const wikipediaContent = wikipediaResponse.get()

     content.sourceContentOriginal = wikipediaContent.content
  }

  function sanitizeContent(content) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
    const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

    content.sourceContentSanitized = withoutDatesInParentheses

    function removeBlankLinesAndMarkdown(text) {
      const allLines = text.split('\n')

      const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
        if (line.trim().length === 0 || line.trim().startsWith('=')) {
          return false
        }

        return true
      })

      return withoutBlankLinesAndMarkdown.join(' ')
    }
  }

  function removeDatesInParentheses(text) {
    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ') //espaços
  }

  function breakContentIntoSentences(content) {
    content.sentences = []

    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: []
      })
    })
  }

   function limitMaximumSentences(content){
      content.sentences = content.sentences.slice(0, content.maximumSentences)
  }


  async function fetchKeywordsOfAllSentences(content) {
      for (const sentence of content.sentences) {
        sentence.keywords =  await fetchWatsonAndReturnKeywords(sentence.text);
    }
  }


  async function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords:{}
        }
      })
      .then(response => {
        
           const obj = response
            const objeto = obj[Object.keys(obj)[3]]

            let keywordss = objeto['keywords']

            let keywords = keywordss.map(function(item){
              let valorReal = item['text']
              return valorReal
            })

           
         
       //console.log(keywords)
  
         resolve(keywords)
        })
      .catch(err => {
        console.log('error: ', err);
      })
    })
  }
  
}
module.exports = robot