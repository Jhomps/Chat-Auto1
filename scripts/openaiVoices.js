const fs = require("fs-extra");
const path = require("path");
require("dotenv").config();
const OpenAI = require("openai");

const outputDirectory = path.resolve(__dirname, "..", "outputs");
fs.ensureDirSync(outputDirectory);

const initializeOpenAI = () => {
  try {
    if (!fs.existsSync(".env")) {
      throw new Error("Archivo .env no encontrado.");
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY no se encontró en el archivo .env");
    }

    console.log("OpenAI API inicializada correctamente.");
    return new OpenAI(apiKey);
  } catch (error) {
    console.error("Error al inicializar OpenAI:", error.message);
    process.exit(1);
  }
};

const openai = initializeOpenAI();

const openaiVoices = {
  voices: ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
};

const formatFilename = (text, voice) => {
  const formattedText = text.replace(/\s+/g, "_").substring(0, 60);
  return `${formattedText}-${voice}.mp3`;
};

const generateSpeech = async (text, voice) => {
  try {
    console.log("Iniciando generación de discurso...");
    const filename = formatFilename(text, voice);
    const speechFile = path.join(outputDirectory, filename);

    console.log(`Generando discurso con voz: ${voice}, guardando en: ${speechFile}`);
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    console.log("Discurso generado y guardado exitosamente.");

    return speechFile;
  } catch (error) {
    console.error(`Error en generateSpeech: [${error.name}] ${error.message}`);
    process.exit(1);
  }
};

module.exports = { generateSpeech };

