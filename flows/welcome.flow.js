const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { chat } = require("../scripts/chatgpt");
const fs = require('fs');
const path = require('path');
const history = require('../historial');

// Leer el prompt base desde un archivo de texto
const promptFilePath = path.join(__dirname, 'prompt.txt');
const basePrompt = fs.readFileSync(promptFilePath, 'utf-8');

const welcomeFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, ctxFn) => {
        const text = ctx.body;
        
        // Obtener el historial del usuario
        const { historial } = history(ctx.from); 

        // Construir el prompt completo incluyendo el historial
        const fullPrompt = `${basePrompt}\n\n${historial}\n\nSolicitud actual del usuario: ${text}`;

        // Crear el contexto de la conversación
        const conversations = historial.split('\n').map(line => {
            const [role, content] = line.includes('User:') ? ['user', line.replace('User: ', '')] : ['assistant', line.replace('Assistant: ', '')];
            return { role, content };
        });

        // Añadir la pregunta actual al contexto 
        conversations.push({ role: "user", content: text });

        // Obtener la respuesta de ChatGPT con el prompt ajustado
        const response = await chat(fullPrompt, conversations);

        // Enviar la respuesta al usuario 
        await ctxFn.flowDynamic(response);
    });

module.exports = { welcomeFlow };
