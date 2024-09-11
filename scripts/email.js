const { google } = require('googleapis');
const nodemailer = require('nodemailer');

async function authenticate() {
    const auth = new google.auth.GoogleAuth({
        keyFile: './google.json',
        scopes: ['https://www.googleapis.com/auth/gmail.send'],
    });

    const authClient = await auth.getClient();
    google.options({ auth: authClient });
    return authClient;
}

async function sendEmail(auth, to, subject, body) {
    const gmail = google.gmail({ version: 'v1', auth });

    // Crear el contenido del correo
    const emailContent = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        body,
    ].join('\n');

    // Codificar el contenido en base64
    const encodedMessage = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    // Enviar el correo
    const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });

    console.log('Correo enviado:', res.data);
}

module.exports = { sendEmail };

/*
const { sendEmail } = require('./path/to/your/module');

async function main() {
    const authClient = await authenticate();
    await sendEmail(authClient, 'destinatario@example.com', 'Asunto del correo', 'Cuerpo del correo');
}

main().catch(console.error);
*/
