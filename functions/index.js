// carregar variáveis de ambiente (necessário se estiver usando .env local)
// em produção via Firebase Functions, process.env já lê as variáveis definidas
require("dotenv").config();

// acessar a chave de produção via variável de ambiente
const geminiApiKey = process.env.GEMINI_API_KEY;

// log temporário para verificar se a chave está chegando
console.log("Chave da API está ativa?", geminiApiKey ? "OK" : "NÃO ENCONTRADA");

// importar Firebase Functions
const functions = require("firebase-functions");

// função HTTP de teste para confirmar leitura da chave
exports.helloGemini = functions.https.onRequest((req, res) => {
  // não exponha a chave real na resposta
  res.send("Teste concluído. Verifique os logs para confirmar a chave.");
});

// Aqui você pode adicionar outras funções que utilizam a geminiApiKey
// Exemplo:
// exports.minhaFuncao = functions.https.onRequest(async (req, res) => {
//     const response = await algumServicoAPI(geminiApiKey, req.body);
//     res.send(response.data);
// });
