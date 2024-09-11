const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { chat } = require("../../scripts/chatgpt");
const fs = require('fs');
const path = require('path');

// Leer el prompt desde un archivo de texto
const promptFilePath = path.join(__dirname, 'prompt.txt');
const prompt = fs.readFileSync(promptFilePath, 'utf-8');

const welcomeFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, ctxFn) => {
        const text = ctx.body;

        const conversations = [];
        // Crear el contexto con las conversaciones
        const contextMessages = conversations.flatMap(conv => [
            { role: "user", content: conv.question },
            { role: "assistant", content: conv.answer }
        ]);

        // Añadir la pregunta actual al contexto 
        contextMessages.push({ role: "user", content: text });

        // Obtener la respuesta de ChatGPT
        const response = await chat(prompt, contextMessages);

        // Enviar la respuesta al usuario 
        await ctxFn.flowDynamic(response);
    });

module.exports = { welcomeFlow };
