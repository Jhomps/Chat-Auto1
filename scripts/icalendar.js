const axios = require('axios');
const ical = require('node-ical');
const fs = require('fs');
const path = require('path');

// Configuración de la autenticación básica
const username = 'tu_usuario';
const password = 'tu_contraseña';
const calendarUrl = 'https://tu-servidor.com/path/to/apple_calendar.ics';

// Constantes configurables
const calendarFilePath = path.join(__dirname, 'apple_calendar.ics');
const timeZone = 'America/Santiago';  // Configura tu zona horaria

const rangeLimit = {
    days: [1, 2, 3, 4, 5], // Lunes a Viernes
    startHour: 9,
    endHour: 18
};

const standardDuration = 1; // Duración por defecto de las citas (1 hora)
const dateLimit = 30; // Máximo de días para traer la lista de Next Events

// Función para descargar el archivo .ics con autenticación básica
async function downloadCalendar() {
    try {
        const response = await axios.get(calendarUrl, {
            auth: {
                username: username,
                password: password
            }
        });
        fs.writeFileSync(calendarFilePath, response.data);
        console.log('Calendario descargado con éxito');
    } catch (err) {
        console.error('Hubo un error al descargar el calendario:', err.message);
        throw err;
    }
}

// Crear un Evento en el Calendario
async function createEvent(eventName, description, date, duration = standardDuration) {
    try {
        const startDateTime = new Date(date);
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + duration);

        const event = {
            start: startDateTime,
            end: endDateTime,
            summary: eventName,
            description: description,
            location: '',
            url: '',
            status: 'CONFIRMED',
            categories: ['Meeting'],
            alarms: [{ action: 'DISPLAY', description: 'Reminder', trigger: 300 }]
        };

        const calendarData = fs.readFileSync(calendarFilePath, 'utf8');
        const calendar = ical.parseICS(calendarData);
        calendar[`event-${Date.now()}`] = event;

        const updatedCalendarData = ical.generateICS(calendar);
        fs.writeFileSync(calendarFilePath, updatedCalendarData);

        console.log('Evento creado con éxito:', event.summary);
        return event;
    } catch (err) {
        console.error('Hubo un error al crear el evento:', err.message);
        throw err;
    }
}

// Listar Días Disponibles en el Calendario
async function listAvailableSlots(startDate = new Date(), endDate) {
    try {
        if (!endDate) {
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + dateLimit);
        }

        const calendarData = fs.readFileSync(calendarFilePath, 'utf8');
        const calendar = ical.parseICS(calendarData);
        const events = Object.values(calendar).filter(event => event.type === 'VEVENT');

        const slots = [];
        let currentDate = new Date(startDate);

        while (currentDate < endDate) {
            const dayOfWeek = currentDate.getDay();
            if (rangeLimit.days.includes(dayOfWeek)) {
                for (let hour = rangeLimit.startHour; hour < rangeLimit.endHour; hour++) {
                    const slotStart = new Date(currentDate);
                    slotStart.setHours(hour, 0, 0, 0);
                    const slotEnd = new Date(slotStart);
                    slotEnd.setHours(hour + standardDuration);

                    const isBusy = events.some(event => {
                        const eventStart = new Date(event.start);
                        const eventEnd = new Date(event.end);
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
        console.error("Hubo un error al listar los slots disponibles:", err.message);
        throw err;
    }
}

// Validar Próximo Día Disponible
async function getNextAvailableSlot(date) {
    try {
        if (typeof date === 'string') {
            date = new Date(date);
        } else if (!(date instanceof Date) || isNaN(date)) {
            throw new Error('La fecha proporcionada no es válida.');
        }

        const availableSlots = await listAvailableSlots(date);
        const filteredSlots = availableSlots.filter(slot => new Date(slot.start) > date);
        const sortedSlots = filteredSlots.sort((a, b) => new Date(a.start) - new Date(b.start));

        return sortedSlots.length > 0 ? sortedSlots[0] : null;
    } catch (err) {
        console.error('Hubo un error al obtener el próximo slot disponible:', err.message);
        throw err;
    }
}

// Verificar si hay slot disponible para la fecha
async function isDateAvailable(date) {
    try {
        const currentDate = new Date();
        const maxDate = new Date(currentDate);
        maxDate.setDate(currentDate.getDate() + dateLimit);

        if (date < currentDate || date > maxDate) {
            return false;
        }

        const dayOfWeek = date.getDay();
        if (!rangeLimit.days.includes(dayOfWeek)) {
            return false;
        }

        const hour = date.getHours();
        if (hour < rangeLimit.startHour || hour >= rangeLimit.endHour) {
            return false;
        }

        const availableSlots = await listAvailableSlots(currentDate);
        const slotsOnGivenDate = availableSlots.filter(slot =>
            new Date(slot.start).toDateString() === date.toDateString()
        );

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

// Descargar el calendario al iniciar
downloadCalendar();

module.exports = { createEvent, isDateAvailable, getNextAvailableSlot };
