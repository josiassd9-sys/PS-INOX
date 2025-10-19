
require('dotenv').config();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const admin = require('firebase-admin');

// --- Início da Configuração ---
const CONFIG_COLLECTION = 'configuracoes';
const CONFIG_DOCUMENT = 'balanca';
// -----------------------------

let db;
let port;

async function initializeFirebaseAndConnect() {
    try {
        const serviceAccount = require('./serviceAccountKey.json');
        
        // Pega a URL do banco de dados do .env como um fallback
        const fallbackDatabaseURL = process.env.FIREBASE_DATABASE_URL;

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: fallbackDatabaseURL 
        });

        db = admin.firestore();
        console.log("Firebase Admin inicializado.");

        const configDoc = await db.collection(CONFIG_COLLECTION).doc(CONFIG_DOCUMENT).get();

        if (!configDoc.exists) {
            console.error(`Erro: Documento de configuração não encontrado em '${CONFIG_COLLECTION}/${CONFIG_DOCUMENT}'.`);
            console.error("Por favor, salve uma configuração na página 'Balança Live' do aplicativo.");
            process.exit(1);
        }

        const config = configDoc.data();
        const portPath = config.serialPort;

        if (!portPath) {
            console.error("Erro: A 'porta serial' não está definida no documento de configuração do Firestore.");
            process.exit(1);
        }
        
        // Se houver uma URL no Firestore, ela tem prioridade.
        if (config.databaseURL && admin.app().options.databaseURL !== config.databaseURL) {
             console.log("Reconfigurando com a URL do banco de dados do Firestore...");
             // Não é possível re-inicializar, mas avisamos o usuário.
             // A inicialização já deve conter a URL correta ou ser genérica.
        }


        console.log(`Tentando conectar na porta serial: ${portPath}`);
        setupSerialPort(portPath);

    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error("Erro: O arquivo 'serviceAccountKey.json' não foi encontrado. Certifique-se que ele existe no diretório raiz.");
        } else {
            console.error("Erro ao inicializar ou ler configuração do Firebase:", error);
        }
        process.exit(1);
    }
}

function setupSerialPort(portPath) {
    try {
        port = new SerialPort(portPath, {
            baudRate: 9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 1
        });

        const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

        parser.on('data', async (line) => {
            // Remove todos os caracteres que não são dígitos, vírgula ou ponto.
            const numeroBruto = line.replace(/[^\d,.-]+/g, '').trim();
            // Substitui vírgula por ponto para garantir o formato numérico correto.
            const numeroLimpo = numeroBruto.replace(',', '.');
            
            console.log(`Dado bruto: "${line.trim()}" -> Dado limpo: "${numeroLimpo}"`);

            if (numeroLimpo && db) {
                try {
                    await db.collection('pesagens').add({
                        peso: numeroLimpo, // Envia o valor numérico limpo
                        timestamp: admin.firestore.FieldValue.serverTimestamp()
                    });
                    console.log('Peso enviado para o Firebase!');
                } catch (err) {
                    console.error('Erro ao enviar para o Firebase:', err);
                }
            }
        });

        port.on('open', () => {
            console.log(`Conectado à balança na porta ${portPath}`);
        });

        port.on('error', (err) => {
            console.error(`Erro na porta serial: ${err.message}. Verifique se a porta '${portPath}' está correta e se o dispositivo está conectado.`);
        });

    } catch (error) {
        console.error(`Falha ao tentar abrir a porta serial '${portPath}'. Verifique as permissões e se a porta está correta.`);
        process.exit(1);
    }
}

// Inicia a aplicação
initializeFirebaseAndConnect();
