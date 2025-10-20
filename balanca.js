
require('dotenv').config();
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDoc, doc, serverTimestamp } = require('firebase/firestore');

// --- Início da Configuração ---
const CONFIG_COLLECTION = 'configuracoes';
const CONFIG_DOCUMENT = 'balanca';
// -----------------------------

let db;
let port;

// Configuração do Firebase a partir das variáveis de ambiente
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function initializeFirebaseAndConnect() {
    try {
        // Inicializa o Firebase com a configuração do ambiente
        if (Object.values(firebaseConfig).some(v => !v)) {
            console.error("Erro: As variáveis de ambiente do Firebase não estão completamente definidas no arquivo .env.");
            console.error("Certifique-se de que todas as chaves NEXT_PUBLIC_FIREBASE_* estão corretas.");
            process.exit(1);
        }

        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log("Firebase inicializado com o SDK web.");

        const configDocRef = doc(db, CONFIG_COLLECTION, CONFIG_DOCUMENT);
        const configDoc = await getDoc(configDocRef);

        if (!configDoc.exists()) {
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

        console.log(`Tentando conectar na porta serial: ${portPath}`);
        setupSerialPort(portPath);

    } catch (error) {
        console.error("Erro ao inicializar o Firebase ou ler a configuração:", error);
        process.exit(1);
    }
}

function setupSerialPort(portPath) {
    try {
        port = new SerialPort({ path: portPath, baudRate: 9600 });

        const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

        parser.on('data', async (line) => {
            // Remove todos os caracteres que não são dígitos, vírgula ou ponto.
            const numeroBruto = line.replace(/[^\d,.-]+/g, '').trim();
            // Substitui vírgula por ponto para garantir o formato numérico correto.
            const numeroLimpo = numeroBruto.replace(',', '.');
            
            console.log(`Dado bruto: "${line.trim()}" -> Dado limpo: "${numeroLimpo}"`);

            if (numeroLimpo && db) {
                try {
                    await addDoc(collection(db, "pesagens"), {
                        peso: numeroLimpo, // Envia o valor numérico limpo
                        timestamp: serverTimestamp()
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
