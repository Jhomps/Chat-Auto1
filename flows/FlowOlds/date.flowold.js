const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { text2iso, iso2text } = require("../../scripts/utils")
const { isDateAvailable, getNextAvailableSlot } = require("../../scripts/calendar") 
const { chat } = require("../../scripts/chatgpt")

const { formFlow } = require("../from.flow")

const promptBase = `
    Sos un asistente virtual diseñado para ayudar a los usuarios a agendar citas mediante una conversación.
    Tu objetivo es únicamente ayudar al usuario a elegir un horario y una fecha para sacar turno.
    Te voy a dar la fecha solicitada por el usuario y la disponibilidad de la misma. Esta fecha la tiene que confirmar el usuario.
    Si la disponibilidad es true, entonces responde algo como: La fecha solicitada está disponible. El turno sería el Jueves 30 de mayo de 2024 a las 10:00 hs.
    Si la disponibilidad es false, entonces recomienda la siguiente fecha disponible que te dejo al final del prompt, suponiendo que la siguiente fecha disponible es el Jueves 30, responde con este formato: La fecha y horario solicitados no están disponibles, te puedo ofrecer el Jueves 30 de mayo de 2024 a las 11:00 hs.
    Bajo ninguna circunstancia hagas consultas, ni preguntas.
    En vez de decir que la disponibilidad es false, envía una disculpa de que esa fecha no está disponible, y ofrece la siguiente de manera formal.
    Se original en el mensaje basados en los ejemplos que te ofesco, usa emojis dependiendo la respuesta que vas a dar.
    Te dejo los estados actualizados de dichas fechas: 
`;

const confirmationFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("¿Te parece bien la fecha propuesta? Solo responde con ‘sí’ o ‘no’, por favor. 😊", { capture: true },
        async (ctx, ctxFn) => {
            //console.log("Respuesta del usuario:", ctx.body.toLowerCase());  // Log para verificar la respuesta

            if (ctx.body.toLowerCase().includes("si")) {
                //console.log("Usuario confirmó la fecha. Moviendo a formFlow...");
                return ctxFn.gotoFlow(formFlow);
            } else if (ctx.body.toLowerCase().includes("no")) {
                //console.log("Usuario no confirmó la fecha. Finalizando flujo...");
                return ctxFn.gotoFlow(dateFlow2);
            } else {
                //console.log("Respuesta no reconocida.");
                await ctxFn.flowDynamic("Disculpa, no entendí bien 😅. Por favor, respóndeme solo con ‘sí’ o ‘no’ 😊.");
            }
        });


const dateFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("¡Genial! 🎉 ¿Qué fecha te gustaría agendar? 📅", { capture: true })
    .addAnswer("Voy a verificar la disponibilidad… ⏳", null,
            async (ctx, ctxFn) => {
                const currentDate = new Date();
                const solicitedDate = await text2iso(ctx.body);
                //console.log("Feche: solicitada:" + solicitedDate)
                if (!solicitedDate || solicitedDate.includes("false")) {
                    return ctxFn.endFlow("Lo siento, no entendí bien la fecha que me diste 😅. ¿Podrías indicármela de nuevo, por favor? 📅");
                }
    
                const startDate = new Date(solicitedDate);
                //console.log("startDate" + startDate)
                let dateAvailable = await isDateAvailable(startDate);
                //console.log("Is Date Avalible: " + dateAvailable + "Type: " + typeof dateAvailable)
    
                if (!dateAvailable) {
                    const nextdateAvailable = await getNextAvailableSlot(startDate);
                    //console.log("Fecha Recomendada: " + nextdateAvailable.start)
                    const isoString = nextdateAvailable.start.toISOString();
                    const dateText = await iso2text(isoString);
                    //console.log("Fecha en Texto: " + dateText)
                    const messages = [{ role: "user", content: `${ctx.body}` }];
                    const response = await chat(promptBase + "\nHoy es el día: " + currentDate + "\nLa fecha solicitada es: " + solicitedDate + "\nLa disponibilidad de esa fecha es: false. El próximo espacio disponible posible que tenés que ofrecer es: " + dateText + " Da las fechas siempre en español", messages);
                    await ctxFn.flowDynamic(response);
                    await ctxFn.state.update({ date: nextdateAvailable.start });
                    return ctxFn.gotoFlow(confirmationFlow);
                } else {
                    const messages = [{ role: "user", content: `${ctx.body}` }];
                    const response = await chat(promptBase + "\nHoy es el día: " + currentDate + "\nLa fecha solicitada es: " + solicitedDate + "\nLa disponibilidad de esa fecha es: true" + "\nConfirmación del cliente: No confirmó", messages);
                    await ctxFn.flowDynamic(response);
                    await ctxFn.state.update({ date: startDate });
                    return ctxFn.gotoFlow(confirmationFlow);
                }
            });

const dateFlow2 = addKeyword(EVENTS.ACTION)
    .addAnswer("No hay problema 😊, ¿qué otra fecha tienes disponible para reservar? 📅.", { capture: true })
    .addAnswer("Revisando disponibilidad… 🔍", null,
            async (ctx, ctxFn) => {
                const currentDate = new Date();
                const solicitedDate = await text2iso(ctx.body);
                //console.log("Feche: solicitada:" + solicitedDate)
                if (!solicitedDate || solicitedDate.includes("false")) {
                    return ctxFn.endFlow("Lo siento, no entendí bien la fecha que me diste 😅. ¿Podrías indicármela de nuevo, por favor? 📅");
                }
    
                const startDate = new Date(solicitedDate);
                //console.log("startDate" + startDate)
                let dateAvailable = await isDateAvailable(startDate);
                //console.log("Is Date Avalible: " + dateAvailable + "Type: " + typeof dateAvailable)
    
                if (!dateAvailable) {
                    const nextdateAvailable = await getNextAvailableSlot(startDate);
                    //console.log("Fecha Recomendada: " + nextdateAvailable.start)
                    const isoString = nextdateAvailable.start.toISOString();
                    const dateText = await iso2text(isoString);
                    //console.log("Fecha en Texto: " + dateText)
                    const messages = [{ role: "user", content: `${ctx.body}` }];
                    const response = await chat(promptBase + "\nHoy es el día: " + currentDate + "\nLa fecha solicitada es: " + solicitedDate + "\nLa disponibilidad de esa fecha es: false. El próximo espacio disponible posible que tenés que ofrecer es: " + dateText + " Da las fechas siempre en español", messages);
                    await ctxFn.flowDynamic(response);
                    await ctxFn.state.update({ date: nextdateAvailable.start });
                    return ctxFn.gotoFlow(confirmationFlow);
                } else {
                    const messages = [{ role: "user", content: `${ctx.body}` }];
                    const response = await chat(promptBase + "\nHoy es el día: " + currentDate + "\nLa fecha solicitada es: " + solicitedDate + "\nLa disponibilidad de esa fecha es: true" + "\nConfirmación del cliente: No confirmó", messages);
                    await ctxFn.flowDynamic(response);
                    await ctxFn.state.update({ date: startDate });
                    return ctxFn.gotoFlow(confirmationFlow);
                }
            });

module.exports = { dateFlow, dateFlow2, confirmationFlow };