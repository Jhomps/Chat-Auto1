const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { createEvent } = require("../scripts/calendar");
const { appendToSheet } = require("../scripts/Sheet");
const { convertirFecha } = require("../scripts/utils");
const { MotivoRandon, ConfirmaRandon, PreguntaRandon, NombreRandon, MailRandon, TnxRandon } = require("../scripts/RandonAnswer");

const formFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(ConfirmaRandon(), { delay: 4000 })
    .addAnswer(PreguntaRandon(), { delay: 2000 })
    .addAnswer(NombreRandon(), { capture: true, delay: 2000 },
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ name: ctx.body });
            await ctxFn.state.update({ phone: ctx.from }); // Guarda el número de teléfono
        }
    )
    .addAnswer(MotivoRandon(), { capture: true },
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ motive: ctx.body });
        }
    )
    //Solicitar Mail
    .addAnswer(MailRandon(), { capture: true },
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ email: ctx.body });
        }
    )
    //Gracias.
    .addAnswer(TnxRandon(), null,
        async (ctx, ctxFn) => {
            const userInfo = await ctxFn.state.getMyState(); // Recupera la información guardada en el estado

            // Datos del evento
            const eventName = userInfo.name;
            const description = userInfo.motive;
            const date = userInfo.date;
            const phone = userInfo.phone;
            const email = userInfo.email;
            const date2 = convertirFecha(date);

            try {
                const eventId = await createEvent(eventName, description, date); // Crea el evento en el calendario
                console.log("Evento creado con ID: ", eventId);

                // Añade los datos a la hoja de cálculo
                await appendToSheet([phone, email, date2, eventName, description]);
            } catch (error) {
                console.error("Error al crear el evento o agregar a la hoja:", error);
            }

            await ctxFn.state.clear(); // Limpia el estado al finalizar
        }
    );

module.exports = { formFlow };
