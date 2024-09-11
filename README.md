# 🚀 Mi Proyecto Increíble

¡Bienvenido a mi proyecto! Aquí te explicaré paso a paso cómo configurarlo y usarlo. 🛠️

## 📋 Requisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:

- Node.js 🟢
- Git 🐙

## 📦 Instalación

Sigue estos pasos para instalar el proyecto en tu máquina:

Instala las dependencias 📥

npm install

⚙️ Configuración
Configura el proyecto con los siguientes archivos:

db.json: Base de datos en formato JSON 📂 (Se crea automaticamente, no la borres)
google.json: Archivo de configuración de Google 🌐 (descárgalo de la URL de Google APIs)
.env: Variables de entorno (no olvides crear este archivo) 🔒

📄 Contenido del archivo .env
Asegúrate de que tu archivo .env contenga lo siguiente:

OPENAI_API_KEY = "apikey"
CALENDAR_ID = "id de calendario"
SHEET_ID = "id de la hoja sheet"

🚀 Uso
Para iniciar el proyecto, usa el siguiente comando:

npm start

Recuerda: Debes estar en el directorio de la carpeta del proyecto.

📁 Estructura del Proyecto
Aquí tienes una descripción de las carpetas y archivos principales:

flows/: Contiene los flujos del proyecto 🌊
scripts/: Contiene las funciones del proyecto 📜
app.js: Punto de entrada de la aplicación 🚪
historial.js: script que te maneja el historial


📝 Información Importante

Función CTX:
ctx.body: Mensaje
ctx.from: Número de Remitente
ctx.pushName: Nombre en WhatsApp
Manejo del Historial
El historial se maneja por medio de un documento local JSON. Valida con historial.js si la cantidad de mensajes es suficiente. Por defecto, se almacenan 30 mensajes por número, pero solo se consideran los primeros 10 mensajes. Puedes editar esto sin problemas.

📄 Licencia
Este proyecto está bajo la Licencia MIT. 📜

¡Gracias por usar mi proyecto! Si tienes alguna pregunta, no dudes en abrir un issue. 😊