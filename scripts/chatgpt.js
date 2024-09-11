require("dotenv").config();
const OpenAI = require("openai");
const openaiApiKey = process.env.OPENAI_API_KEY;

// Crear una instancia única de OpenAI
const openai = new OpenAI({
    apiKey: openaiApiKey,
});

/**
 * Genera una respuesta de chat utilizando la API de OpenAI.
 * 
 * @param {string} prompt - Instrucciones del sistema para el modelo.
 * @param {Array} messages - Array de mensajes anteriores en la conversación.
 * @returns {Promise<string>} - Respuesta generada por el modelo o "ERROR" si ocurre un problema.
 */
const chat = async (prompt, messages) => {
    try {
        if (!prompt || !Array.isArray(messages)) {
            throw new Error("Parámetros inválidos: 'prompt' debe ser una cadena y 'messages' un array.");
        }

        const completion = await openai.chat.completions.create({ 
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: prompt },
                ...messages
            ],
        });

        const answer = completion.choices[0].message.content;
        return answer;
    } catch (err) {
        console.error("Error al conectar con OpenAI:", err.message); 
        return "ERROR";
    }
};

module.exports = { chat };
