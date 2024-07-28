const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const { delay } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');
//const link = require('file:///Users/joaquinadami/Downloads/view%20(3).html')

const mediaPath = path.join('/Users', 'joaquinadami', 'Desktop', 'chatbot', 'mario.png');

fs.access(mediaPath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`File does not exist at path: ${mediaPath}`);
    } else {
        console.log(`File exists at path: ${mediaPath}`);
    }
});


const flowString = addKeyword('hola').addAnswer('Este mensaje envia un link a un drive', {
    media: 'https://drive.google.com/file/d/1ljrgIRWs-kop4rdgGvwLLronKxHaFlqt/view?usp=sharing.pdf'
}).addAnswer('mandame a google: https://www.nuevocineradar.com.ar/es-AR')

const flowPrincipal = addKeyword(['hola', 'ole', 'alo']) // busca en el mensaje alguna de estas palabras claves
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*, te comunicaste con joaquin, lamentablemet esta opcupado trabajando',
        async (ctx, { flowDynamic, provider }) => { console.log('nn') }
    )
    .addAnswer('Te envio una foto de joaco para que no lo extrañes', async (ctx, { flowDynamic, provider }) => {
        console.log(' sending media:');
        try {
            console.log(' sending media:');
            const mediaPath = path.join('/Users/joaquinadami/Desktop/chatbot', 'mario.png');
            const media = await provider.prepareMedia(mediaPath);
            await flowDynamic.sendMedia(media);


        } catch (error) {
            console.log('Error sending media:');
        }
    });

const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer('Este es el flujo welcome', {
        delay: 5000,
        // media: "" es para enviar imagenes desde un link o con archivos locales
    },
        async (ctx, ctxFn) => { // funcion
            try {
                console.log(ctx.body); // mensaje que envia la persona lo muestra por la terminal
                // podemos agregar logica 
            } catch (error) {
                console.error('Error in flowWelcome function:', error);
            }
        });

const main = async () => { // shift + option + f para ordenar el codigo
    try {
        const adapterDB = new MockAdapter();
        const adapterFlow = createFlow([flowString]);
        const adapterProvider = createProvider(BaileysProvider);

        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        });

        QRPortalWeb();
    } catch (error) {
        console.error('Error in main function:', error);
    }
};

main().catch(error => {
    console.error('Error initializing bot:', error);
});
