
require('dotenv').config();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const admin = require('firebase-admin');

// Validações de ambiente
if (!process.env.FIREBASE_DATABASE_URL) {
    console.error("Erro: A variável de ambiente FIREBASE_DATABASE_URL não está definida.");
    process.exit(1);
}

try {
    const serviceAccount = require('./serviceAccountKey.json'); // JSON baixado do Firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
} catch (error) {
    console.error("Erro ao inicializar o Firebase Admin. Certifique-se que o arquivo 'serviceAccountKey.json' existe no diretório raiz e está configurado corretamente.", error);
    process.exit(1);
}


const db = admin.firestore();

// Configurações da porta serial
const portPath = process.env.SERIAL_PORT_PATH || '/dev/ttyUSB0'; // Permite configurar via .env

try {
    const port = new SerialPort(portPath, {
      baudRate: 9600,
      dataBits: 8,
      parity: 'none',
      stopBits: 1
    });

    const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

    parser.on('data', async (line) => {
      const pesoLimpo = line.trim();
      console.log('Peso lido da balança:', pesoLimpo);

      if (pesoLimpo) {
          try {
            await db.collection('pesagens').add({
              peso: pesoLimpo,
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
