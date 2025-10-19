
// carregar variáveis do .env
require('dotenv').config();

// acessar a chave
const geminiApiKey = process.env.GEMINI_API_KEY;
console.log("Gemini API Key carregada:", geminiApiKey);

// exemplo de função HTTP
const functions = require("firebase-functions");

exports.helloGemini = functions.https.onRequest((req, res) => {
  res.send(`Chave Gemini: ${geminiApiKey}`);
});

