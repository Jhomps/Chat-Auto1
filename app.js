const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/json')
//Llamadas
const {chat} = require("./scripts/chatgpt")
const {createEvent, isDateAvailable, getNextAvailableSlot } = require("./scripts/calendar")
const { text2iso, iso2text } = require("./scripts/utils")
const { dateFlow, confirmationFlow } = require("./flows/date.flow")
const { formFlow } = require("./flows/from.flow")
const { welcomeFlow } = require("./flows/welcome.flow")
const { handlerAI } = require("./scripts/whisper")



//Preguntas y respuestas por nota de Voz a Texto.
const flowVoice = addKeyword(EVENTS.VOICE_NOTE)
    .addAnswer("Escuchando 🎧", null, async (ctx, ctxFn) => {
        const text = await handlerAI(ctx);
        //console.log(text);
        ctx.body = text;
        await ctxFn.gotoFlow(welcomeFlow);
    });

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        const bodyText = ctx.body.toLowerCase();
        //console.log(ctx.pushName, ctx.from, ctx.body)

        // El usuario quiere agendar una cita?
        const keywordsDate = ["agendar", "cita", "hora", "turno"];
        const containsKeywordDate = keywordsDate.some(keyword => bodyText.includes(keyword));
        
        if (containsKeywordDate) {
            return await ctxFn.gotoFlow(flowAgendar); // Si quiere agendar una cita
        }

        // Cualquier otro mensaje lo lleva al welcomeFlow
        return await ctxFn.gotoFlow(welcomeFlow);
    });

const flowAgendar = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, ctxFn) => {
        return ctxFn.gotoFlow(dateFlow); // Si ya estamos en flowAgendar, simplemente vamos a dateFlow
    });



//----------------------------------------------endflows-----------------------------------------------

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowAgendar, dateFlow, formFlow, welcomeFlow, confirmationFlow, flowVoice])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
