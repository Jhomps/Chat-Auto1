require("dotenv").config();
const { google } = require('googleapis');

// Inicializa la librería cliente de Google APIs y configura la autenticación usando las credenciales de la cuenta de servicio.
const auth = new google.auth.GoogleAuth({
    keyFile: './google.json',  // Ruta al archivo de claves de tu cuenta de servicio.
    scopes: ['https://www.googleapis.com/auth/spreadsheets']  // Alcance para la API de Google Sheets.
});

const spreadsheetId = process.env.SHEET_ID; // ID de la hoja de cálculo.

async function appendToSheet(values) {
    const sheets = google.sheets({ version: 'v4', auth }); // Crea una instancia cliente de la API de Sheets
    const range = 'Sheet1!A1:D1'; // El rango específico en la hoja para añadir los datos.
    const valueInputOption = 'USER_ENTERED'; // Cómo deben interpretarse los datos ingresados

    const resource = { values: [values] }; // Datos que se van a añadir a la hoja

    try {
        const res = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            insertDataOption: 'INSERT_ROWS', // Inserta nuevas filas si es necesario.
            resource,
        });
        console.log(`Datos añadidos exitosamente: ${res.data.updates.updatedRange}`);
        return res; // Retorna la respuesta de la API de Sheets
    } catch (error) {
        console.error('Error al añadir datos a la hoja:', error); // Registro de errores
    }
}

async function readSheet(range) {
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId, 
            range
        });
        const rows = response.data.values; // Extrae las filas de la respuesta.
        return rows; // Retorna las filas.
    } catch (error) {
        console.error('Error al leer la hoja:', error); // Registro de errores.
    }
}

module.exports = { appendToSheet, readSheet };
