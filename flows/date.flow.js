const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { text2iso, iso2text } = require("../scripts/utils");
const { isDateAvailable, getNextAvailableSlot } = require("../scripts/calendar");
const { chat } = require("../scripts/chatgpt");
const { AgendaRandon, DispoRandon, ValidaRandon } = require("../scripts/RandonAnswer");


const { formFlow } = require("./from.flow");

const promptBase = `
Eres un asistente virtual especializado en agendar citas. 
Tu objetivo es ayudar al usuario a seleccionar una fecha y hora disponibles para una cita.
El usuario puede solicitar la fecha y hora en lenguaje natural, como "el próximo martes a las 3 de la tarde", "mañana", "para el lunes", "la mas cercana" o "la próxima semana". También puede usar diferentes formatos de hora, como 18:00 o 3 PM.
Tu tarea es analizar la solicitud del usuario y convertirla en una fecha y hora estructurada. 
Responde siempre en formato de 12 horas(AM/PM).
Usa las respuestas como referencia, usa la respuesta indicada depende de la solicitud del usuario y los datos de la solicitud que te menciono al final.

Respuesta ejemplo:
    Si la fecha y hora solicitadas están disponibles, responde con algo como: 
    "✅ El turno sería el {día} {fecha} a las {hora}."

    Si la fecha y hora no están disponibles, responde con algo como: 
    "🔜 La próxima fecha disponible es el {día} {fecha} a las {hora}." 

Usa emojis para hacer la respuesta más amigable y asegúrate de que la respuesta sea clara y precisa.
   
Bajo ninguna circunstancia debes pedir al usuario que proporcione otra fecha. Siempre sugiere una fecha y hora basadas en la solicitud inicial del usuario o en la próxima disponibilidad.

La solicitud es:

`;

const dateFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(AgendaRandon(), { capture: true })
    .addAnswer(DispoRandon(), null,
        async (ctx, ctxFn) => {
            const currentDate = new Date();
            const solicitedDate = await text2iso(ctx.body);

            if (!solicitedDate || solicitedDate.includes("false")) {
                return ctxFn.endFlow("Lo siento, no entendí bien la fecha que me diste 😅. ¿Podrías indicármela de nuevo, por favor? 📅");
            }

            const startDate = new Date(solicitedDate);
            let dateAvailable = await isDateAvailable(startDate);

            let response;
            if (!dateAvailable) {
                const nextdateAvailable = await getNextAvailableSlot(startDate);
                const isoString = nextdateAvailable.start.toISOString();
                const dateText = await iso2text(isoString);
                response = await chat(
                    `${promptBase}
                    Hoy es: ${currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    Solicitud del usuario: "${ctx.body}"
                    Disponibilidad de la fecha solicitada: false
                    Siguiente fecha disponible: ${dateText}`,
                    [] 
                );
                await ctxFn.flowDynamic(response);
                await ctxFn.state.update({ date: nextdateAvailable.start });
            } else {
                response = await chat(
                    `${promptBase}
                    Hoy es: ${currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    Solicitud del usuario: "${ctx.body}"
                    Disponibilidad de la fecha solicitada: true`,
                    [] 
                );
                await ctxFn.flowDynamic(response);
                await ctxFn.state.update({ date: startDate });
            }
            return ctxFn.gotoFlow(confirmationFlow);
        });

const confirmationFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(ValidaRandon(), { capture: true },
        async (ctx, ctxFn) => {
            const userResponse = ctx.body.toLowerCase();
            
            if (userResponse.includes("si") || userResponse.includes("sí") || userResponse.includes("ok") || userResponse.includes("dale")) {
                return ctxFn.gotoFlow(formFlow);
            } else if (userResponse.includes("no")) {
                return ctxFn.gotoFlow(dateFlow);  // Vuelve a ofrecer otra fecha
            } else {
                const newDate = await chat(
                    `${promptBase}
                    Solicitud del usuario: "${ctx.body}"
                    La respuesta del usuario no fue clara (ni sí ni no), intentando deducir una nueva fecha de la solicitud.`,
                    [{ role: "user", content: userResponse }] // messages array is passed correctly
                );
                await ctxFn.flowDynamic(newDate);
                await ctxFn.state.update({ date: await text2iso(newDate) });
                return ctxFn.gotoFlow(confirmationFlow);
            }
        });

module.exports = { dateFlow, confirmationFlow };
