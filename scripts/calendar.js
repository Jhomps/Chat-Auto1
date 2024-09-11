require("dotenv").config();
const { google } = require('googleapis');

// Inicializa la librería cliente de Google y configura la autenticación con credenciales de tu cuenta de servicio.
const auth = new google.auth.GoogleAuth({
    keyFile: './google.json',  // Ruta al archivo de clave de tu cuenta de servicio.
    scopes: ['https://www.googleapis.com/auth/calendar']  // Alcance para la API de Google Calendar.
});

const calendar = google.calendar({ version: 'v3' });

// Constantes configurables
const calendarID = process.env.CALENDAR_ID;

const timeZone = 'America/Santiago';  // Configura tu zona horaria

const rangeLimit = {
    days: [1, 2, 3, 4, 5], // Lunes a Viernes
    startHour: 9,
    endHour: 18
};

const standardDuration = 1; // Duración por defecto de las citas (1 hora)
const dateLimit = 30; // Máximo de días para traer la lista de Next Events

//------------------------------------------------------------------------------------------

// Crear un Evento en el Calendario

async function createEvent(eventName, description, date, duration = standardDuration) { 
    try {
        // Autenticación
        const authClient = await auth.getClient();
        google.options({ auth: authClient });

        // Fecha y hora de inicio del evento 
        const startDateTime = new Date(date); 
        
        // Fecha y hora de fin del evento
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + duration);

        // Definición del evento
        const event = {
            summary: eventName,
            description: description,
            start: {
                dateTime: startDateTime.toISOString(), 
                timeZone: timeZone,
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: timeZone,
            },
            colorId: '2' // El ID del color verde en Google Calendar
        };
                            /*
                            1 - Azul
                            2 - Verde
                            3 - Morado
                            4 - Rojo
                            5 - Amarillo
                            6 - Naranja
                            7 - Turquesa
                            8 - Gris
                            9 - Azul claro
                            10 - Verde claro
                            11 - Rosa
                            */


        // Inserta el evento en el calendario
        const response = await calendar.events.insert({
            calendarId: calendarID,
            resource: event,
        });

        // Generar la URL de la invitación 
        const eventId = response.data.id; 
        console.log('Evento creado con éxito:', eventId);
        return eventId;
    } catch (err) {
        console.error('Hubo un error al crear el evento:', err.message);
        throw err;
    }
}

//------------------------------------------------------------------------------------------

// Listar Días Disponibles en el Calendario

async function listAvailableSlots(startDate = new Date(), endDate) { 
    try {
        // Autenticación
        const authClient = await auth.getClient();
        google.options({ auth: authClient });

        // Definir fecha de fin si no se proporciona 
        if (!endDate) {
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + dateLimit);
        }

        const response = await calendar.events.list({
            calendarId: calendarID,
            timeMin: startDate.toISOString(), 
            timeMax: endDate.toISOString(),
            timeZone: timeZone,
            singleEvents: true, 
            orderBy: 'startTime'
        });

        const events = response.data.items;
        const slots = [];
        let currentDate = new Date(startDate);

        // Generar slots disponibles basados en rangeLimit 
        while (currentDate < endDate) {
            const dayOfWeek = currentDate.getDay();
            if (rangeLimit.days.includes(dayOfWeek)) {
                for (let hour = rangeLimit.startHour; hour < rangeLimit.endHour; hour++) {
                    const slotStart = new Date(currentDate);
                    slotStart.setHours(hour, 0, 0, 0); 
                    const slotEnd = new Date(slotStart); 
                    slotEnd.setHours(hour + standardDuration);

                    const isBusy = events.some(event => {
                        const eventStart = new Date(event.start.dateTime || event.start.date); 
                        const eventEnd = new Date(event.end.dateTime || event.end.date);
                        return (slotStart < eventEnd && slotEnd > eventStart);
                    });

                    if (!isBusy) {
                        slots.push({ start: slotStart, end: slotEnd });
                    }
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return slots;
    } catch (err) {
        console.error("Hubo un error al contactar el servicio de Calendar:", err.message);
        throw err;
    }
}

//------------------------------------------------------------------------------------------

// Validar Próximo Día Disponible

async function getNextAvailableSlot(date) {
    try {
        // Verificar si 'date' es un string en formato ISO
        if (typeof date === 'string') {
            // Convertir el string ISO en un objeto Date
            date = new Date(date);
        } else if (!(date instanceof Date) || isNaN(date)) {
            throw new Error('La fecha proporcionada no es válida.');
        }

        // Obtener el próximo slot disponible
        const availableSlots = await listAvailableSlots(date);
        
        // Filtrar slots disponibles que comienzan después de la fecha proporcionada 
        const filteredSlots = availableSlots.filter(slot => new Date(slot.start) > date);
        
        // Ordenar los slots por su hora de inicio en orden ascendente
        const sortedSlots = filteredSlots.sort((a, b) => new Date(a.start) - new Date(b.start));

        // Tomar el primer slot de la lista resultante, que será el próximo slot disponible
        return sortedSlots.length > 0 ? sortedSlots[0] : null;

    } catch (err) {
        console.error('Hubo un error al obtener el próximo slot disponible:', err.message);
        throw err;
    }
}

//------------------------------------------------------------------------------------------

// Verificar si hay slot disponible para la fecha
async function isDateAvailable(date) {
    try {
        // Validar que la fecha esté dentro del rango permitido 
        const currentDate = new Date();
        const maxDate = new Date(currentDate);
        maxDate.setDate(currentDate.getDate() + dateLimit);
        
        if (date < currentDate || date > maxDate) {
            return false; // La fecha está fuera del rango permitido
        }

        // Verificar que la fecha caiga en un día permitido
        const dayOfWeek = date.getDay();
        if (!rangeLimit.days.includes(dayOfWeek)) {
            return false; // La fecha no está dentro de los días permitidos
        }

        // Verificar que la hora esté dentro del rango permitido
        const hour = date.getHours();
        if (hour < rangeLimit.startHour || hour >= rangeLimit.endHour) {
            return false; // La hora no está dentro del rango permitido
        }

        // Obtener todos los slots disponibles desde la fecha actual hasta el límite definido
        const availableSlots = await listAvailableSlots(currentDate);

        // Filtrar slots disponibles basados en la fecha dada
        const slotsOnGivenDate = availableSlots.filter(slot => 
            new Date(slot.start).toDateString() === date.toDateString()
        );

        // Verificar si hay slots disponibles en la fecha dada 
        const isSlotAvailable = slotsOnGivenDate.some(slot =>
            new Date(slot.start).getTime() === date.getTime() &&
            new Date(slot.end).getTime() === date.getTime() + standardDuration * 60 * 60 * 1000
        );

        return isSlotAvailable;
    } catch (err) {
        console.error('Hubo un error al verificar disponibilidad:', err.message);
        throw err;
    }
}

module.exports = {createEvent, isDateAvailable, getNextAvailableSlot };