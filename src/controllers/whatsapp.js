//En el archivo donde defines el cliente de WhatsApp
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const whatsapp = new Client({
    
});

whatsapp.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

whatsapp.on('ready', () => {
    console.log('Cliente iniciado');
});

module.exports = { whatsapp };
