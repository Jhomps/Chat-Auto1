const fs = require('fs');
const path = require('path');

function history(numeroTelf, num_mensajes = 10) {
    const dbPath = path.join(__dirname, 'db.json');
    let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    let mensajes = db.filter(msg => msg.from === numeroTelf);
    
    mensajes.sort((a, b) => a.refSerialize.localeCompare(b.refSerialize));
    
    let ultimos_mensajes = mensajes.slice(-num_mensajes);
    
    let historial = ultimos_mensajes.map(msg => {
        if (msg.answer !== '__call_action__') {
            return msg.keyword ? `User: ${msg.answer}` : `Assistant: ${msg.answer}`;
        }
        return null;
    }).filter(Boolean);
    
    if (mensajes.length > 30) {
        console.log(`La base de datos del número ${numeroTelf} se está limpiando porque ha alcanzado 30 mensajes.`);
        db = db.filter(msg => msg.from !== numeroTelf).concat(mensajes.slice(-30));
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    }
    
    return {
        historial: "Historial del Chat:\n" + historial.join('\n'),
        db_actualizada: db
    };
}

module.exports = history;
