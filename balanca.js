require('dotenv').config();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); // JSON baixado do Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://SEU_PROJETO.firebaseio.com" // substitua pelo URL do seu DB
});

const db = admin.firestore(); // ou admin.database() se for Realtime DB

const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1
});

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', async (line) => {
  console.log('Peso lido da balança:', line);

  try {
    await db.collection('pesagens').add({
      peso: line,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Peso enviado para Firebase!');
  } catch (err) {
    console.error('Erro ao enviar para Firebase:', err);
  }
});
