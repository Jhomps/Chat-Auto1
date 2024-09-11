const { downloadMediaMessage } = require("@adiwajshing/baileys");
const OpenAI = require("openai");
const openaiApiKey = process.env.OPENAI_API_KEY;
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
ffmpeg.setFfmpegPath(ffmpegPath);

const openai = new OpenAI({
    apiKey: openaiApiKey,
});

const voiceToText = async (path) => {
    //console.log("Iniciando voiceToText con el archivo:", path);
    if (!fs.existsSync(path)) {
        console.error("Error: No se encuentra el archivo en la ruta especificada:", path);
        throw new Error("No se encuentra el archivo");
    }
    try {
        //console.log("Iniciando transcripción con OpenAI API.");
        const resp = await openai.audio.transcriptions.create({
            file: fs.createReadStream(path),
            model: "whisper-1",
        });
        
        // Imprimir la respuesta completa de la API
        //console.log("Respuesta de OpenAI:", resp);

        // Manejar diferentes formatos de respuesta
        const transcriptionText = resp.data?.text || resp.text;

        if (transcriptionText) {
            //console.log("Transcripción completada:", transcriptionText);
            return transcriptionText;
        } else {
            console.error("Respuesta inesperada de OpenAI:", resp);
            return "ERROR";
        }
    } catch (err) {
        console.error("Error al transcribir el archivo:", err.message);
        if (err.response) {
            console.error("Respuesta de error de OpenAI:", err.response.data);
        }
        return "ERROR";
    }
};

const convertOggMp3 = async (inputStream, outStream) => {
    //console.log("Iniciando conversión de OGG a MP3.");
    return new Promise((resolve, reject) => {
        ffmpeg(inputStream)
            .audioQuality(96)
            .toFormat("mp3")
            .save(outStream)
            .on("progress", (p) => null)
            .on("end", () => {
                //console.log("Conversión a MP3 completada.");
                resolve(true);
            })
            .on("error", (err) => {
                console.error("Error al convertir el archivo:", err.message);
                reject(err);
            });
    });
};

const handlerAI = async (ctx) => {
    //console.log("Descargando mensaje de audio...");
    const buffer = await downloadMediaMessage(ctx, "buffer");
    const pathTmpOgg = `${process.cwd()}/tmp/voice-note-${Date.now()}.ogg`;
    const pathTmpMp3 = `${process.cwd()}/tmp/voice-note-${Date.now()}.mp3`;

    //console.log("Guardando archivo de audio temporal:", pathTmpOgg);
    await fs.writeFileSync(pathTmpOgg, buffer);

    await convertOggMp3(pathTmpOgg, pathTmpMp3);

    //console.log("Iniciando transcripción de voz a texto...");
    const text = await voiceToText(pathTmpMp3);

    //console.log("Transcripción completada. Resultado:", text);

    fs.unlink(pathTmpMp3, (error) => {
        if (error) console.error("Error al eliminar archivo MP3:", error);
    });
    fs.unlink(pathTmpOgg, (error) => {
        if (error) console.error("Error al eliminar archivo OGG:", error);
    });
    
    return text;
};

module.exports = { handlerAI };
