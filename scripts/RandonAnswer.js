// RandonAnswer.js

function getRandomAnswer(answers) {
    const randomIndex = Math.floor(Math.random() * answers.length);
    return answers[randomIndex];
}

// 1. AgendaRandon
function AgendaRandon() {
    const answers = [
        "¿Qué día te viene bien para agendar? 📅",
        "¿Cuál sería el mejor día para ti para agendar? 🗓️",
        "¿Qué fecha te gustaría elegir para agendar? 📆",
        "¿Tienes alguna fecha en mente para agendar? 📅",
        "¿Cuál es la fecha que prefieres para agendar? 📋",
        "¿Qué día te acomoda para agendar la cita? 📅",
        "¿Para cuándo te gustaría agendar? 📅",
        "¿Cuál es tu día ideal para agendar? 🗓️",
        "¿Qué fecha te viene mejor para agendar? 📅",
        "¿Qué día te gustaría que agendáramos? 📅"
    ];
    return getRandomAnswer(answers);
}

// 2. DispoRandon
function DispoRandon() {
    const answers = [
        "Voy a verificar la disponibilidad… ⏳",
        "Dame un momento para comprobar la disponibilidad… 🔍",
        "Estoy revisando la disponibilidad para ti… ⏱️",
        "Un segundo, estoy verificando la disponibilidad… ⏳",
        "Permíteme checar la disponibilidad… 🕵️‍♂️",
        "Voy a ver si tenemos disponibilidad… ⏳",
        "Revisando la disponibilidad, por favor espera… ⏱️",
        "Dame un instante para confirmar la disponibilidad… ⏳",
        "Verificando disponibilidad ahora… 🔍",
        "Estoy consultando la disponibilidad, un momento… ⏳"
    ];
    return getRandomAnswer(answers);
}

// 3. ValidaRandon
function ValidaRandon() {
    const answers = [
        "¿Te parece bien la fecha propuesta? Solo responde con ‘sí’, ‘no’, o indica otra fecha, por favor. 😊",
        "¿Te agrada la fecha que sugerí? Responde con ‘sí’, ‘no’, o indícame otra fecha. 😃",
        "¿Qué te parece la fecha propuesta? Dime ‘sí’, ‘no’, o sugiere otra fecha. 🤔",
        "¿Estás de acuerdo con la fecha sugerida? Responde con ‘sí’, ‘no’, o indícame otra fecha. 😊",
        "¿Es la fecha sugerida adecuada para ti? Responde con ‘sí’, ‘no’, o dime otra fecha. 📅",
        "¿La fecha propuesta te parece bien? Dime ‘sí’, ‘no’, o sugiere otra. 😊",
        "¿Te parece bien esta fecha? Responde con ‘sí’, ‘no’, o sugiere otra fecha. 🤓",
        "¿Estás de acuerdo con la fecha? Solo responde con ‘sí’, ‘no’, o indica otra fecha. 😊",
        "¿Qué tal te parece la fecha? Dime ‘sí’, ‘no’, o sugiere otra opción. 📅",
        "¿Te gusta la fecha que propuse? Responde con ‘sí’, ‘no’, o dime otra fecha. 😊"
    ];
    return getRandomAnswer(answers);
}

// 4. ConfirmaRandon
function ConfirmaRandon() {
    const answers = [
        "¡Genial! 😊 Agradezco que hayas confirmado la fecha 📅",
        "¡Perfecto! 😃 Gracias por confirmar la fecha 📅",
        "¡Excelente! 👍 Gracias por confirmar la fecha 📅",
        "¡Maravilloso! 🎉 Gracias por confirmar la fecha 📅",
        "¡Qué bien! 😊 Agradezco que hayas confirmado la fecha 📅",
        "¡Fantástico! 🎊 Gracias por confirmar la fecha 📅",
        "¡Gracias! 😃 Agradezco la confirmación de la fecha 📅",
        "¡Todo listo! 😊 Gracias por confirmar la fecha 📅",
        "¡Confirmado! 🎉 Agradezco que hayas confirmado la fecha 📅",
        "¡Muchas gracias! 😊 Tu confirmación de la fecha está registrada 📅"
    ];
    return getRandomAnswer(answers);
}

// 5. PreguntaRandon
function PreguntaRandon() {
    const answers = [
        "Voy a realizarte unas preguntas para agendar tu hora 📋",
        "Permíteme hacerte unas preguntas para completar la cita 📋",
        "Voy a hacerte unas preguntas para finalizar la agenda 📋",
        "Necesito hacerte unas preguntas para agendar tu hora 📋",
        "Voy a realizar algunas preguntas para completar el agendamiento 📋",
        "Te haré unas preguntas para completar la cita 📋",
        "Voy a hacerte unas preguntas para completar el proceso 📋",
        "Necesito hacerte unas preguntas rápidas para agendar tu cita 📋",
        "Voy a hacerte unas preguntas necesarias para agendar 📋",
        "Te haré algunas preguntas para finalizar la cita 📋"
    ];
    return getRandomAnswer(answers);
}

// 6. NombreRandon
function NombreRandon() {
    const answers = [
        "Para comenzar, ¿me dices tu nombre, por favor? 🌟",
        "¿Podrías decirme tu nombre para comenzar? 😊",
        "¿Cuál es tu nombre? Empecemos por ahí 🌟",
        "Para empezar, ¿me podrías indicar tu nombre? 😊",
        "¿Me dices tu nombre, por favor? 🌟",
        "Comencemos, ¿me dices cómo te llamas? 😊",
        "Para iniciar, ¿me podrías decir tu nombre? 🌟",
        "¿Cuál es tu nombre? Vamos a empezar 😊",
        "Para comenzar, ¿puedes decirme tu nombre? 🌟",
        "¿Me indicas tu nombre, por favor? 😊"
    ];
    return getRandomAnswer(answers);
}

// 7. MailRandon
function MailRandon() {
    const answers = [
        "Perfecto, ¿cuál es tu correo electrónico? 📧",
        "¿Me das tu correo electrónico, por favor? 📧",
        "Para seguir, ¿cuál es tu correo electrónico? 📧",
        "¿Podrías proporcionarme tu correo electrónico? 📧",
        "Necesito tu correo electrónico, ¿me lo das? 📧",
        "Para continuar, ¿cuál es tu correo electrónico? 📧",
        "¿Cuál es tu correo electrónico? 📧",
        "¿Me podrías indicar tu correo electrónico? 📧",
        "Para seguir con el proceso, ¿me das tu correo electrónico? 📧",
        "¿Podrías decirme tu correo electrónico? 📧"
    ];
    return getRandomAnswer(answers);
}

// 8. TnxRandon
function TnxRandon() {
    const answers = [
        "¡Excelente! Ya he creado la hora. ¡Te esperamos con ansias! 😊",
        "¡Todo listo! Tu cita está confirmada. ¡Nos vemos pronto! 😊",
        "¡Perfecto! Tu cita ha sido creada. ¡Te esperamos! 😊",
        "¡Cita agendada! ¡Te esperamos con mucho gusto! 😊",
        "¡Hora confirmada! ¡Nos vemos pronto! 😊",
        "¡Gracias! Tu cita está agendada. ¡Te esperamos! 😊",
        "¡Listo! Tu hora ha sido creada. ¡Te esperamos con gusto! 😊",
        "¡Fantástico! Tu cita está confirmada. ¡Nos vemos pronto! 😊",
        "¡Hora creada! ¡Te esperamos con ansias! 😊",
        "¡Cita confirmada! ¡Nos vemos en la fecha acordada! 😊"
    ];
    return getRandomAnswer(answers);
}

// 9. MotivoRendon
function MotivoRandon() {
    const respuestas = [
        "Genial, ¿me podrías contar el motivo de tu cita? 🤔",
        "Perfecto, ¿cuál es el motivo de tu hora? 📝",
        "¡Entendido! Ahora, ¿me dices el motivo de tu cita? 😊",
        "Por favor, cuéntame el motivo de tu hora. 📋",
        "¡Muy bien! ¿Cuál es el motivo de tu cita? 🧐",
        "Dime, ¿cuál es el motivo de tu hora? 🤓",
        "Para continuar, ¿me podrías decir el motivo de tu cita? 🌟",
        "¡Gracias! Ahora, ¿cuál es el motivo de tu hora? 💬",
        "¿Me puedes indicar el motivo de tu cita, por favor? 🗓️",
        "Por último, ¿me podrías decir el motivo de tu hora? 😊"
    ];
    
    return respuestas[Math.floor(Math.random() * respuestas.length)];
}

module.exports = { AgendaRandon, DispoRandon, ValidaRandon, ConfirmaRandon, PreguntaRandon, NombreRandon, MailRandon, TnxRandon, MotivoRandon };