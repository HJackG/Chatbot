const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const { delay } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');

const menu1Path = path.join(__dirname, "mensajes", "menu1.txt")
const menu = fs.readFileSync(menu1Path, "utf8")

const precioPath = path.join(__dirname, "mensajes", "preciosEntradas.txt")
const precios = fs.readFileSync(precioPath, "utf8")

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

const flowMensaje1 = addKeyword(EVENTS.ACTION)
    .addAnswer('Si tenés alguna otra consulta, te pedimos que ingreses la palabra *menú*')

const flowCartelera = addKeyword(EVENTS.ACTION)
    .addAnswer('Para consultar la cartelera🧾 de esta semana te podes dirigir a nuestro sitio web www.nuevocineradar.com.ar o bajandote nuestra aplicacion *Las Tipas*📲 y seleccionando nuestro complejo.', {
        delay: 1500,
    },
        async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
            return gotoFlow(flowMensaje1)
        });

const flowPreciosEntradas = addKeyword(EVENTS.ACTION)
    .addAnswer(precios, {
        delay: 1500,
    },
        async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
            return gotoFlow(flowMensaje1)
        });

const flowPreciosCombos = addKeyword(EVENTS.ACTION)
    .addAnswer('')

const flowPromos = addKeyword(EVENTS.ACTION)
    .addAnswer('')

const flowEntradas = addKeyword(EVENTS.ACTION)
    .addAnswer('')

const flowRepresentante = addKeyword(EVENTS.ACTION)
    .addAnswer('')

const flowRecomendacion = addKeyword(EVENTS.ACTION)
    .addAnswer('')


const flowMenu = addKeyword([EVENTS.WELCOME, 'menu'])

    .addAnswer(menu,
        { capture: true },
        async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
            if (!['1', '2', '3', '4', '5', '6', '7'].includes(ctx.body)) {
                return fallBack(
                    'Respuesta no valida, por favor ingrese una de las opciones'
                );
            }
            switch (ctx.body) {

                case '1':
                    return gotoFlow(flowCartelera);
                case '2':
                    return gotoFlow(flowPreciosEntradas);
                case '3':
                    return gotoFlow(flowPreciosCombos);
                case '4':
                    return gotoFlow(flowPromos);
                case '5':
                    return gotoFlow(flowEntradas);
                case '6':
                    return gotoFlow(flowRepresentante);
                case '7':
                    return gotoFlow(flowRecomendacion);
                case '0':
                    return await flowDynamic(
                        'saliendoo'
                    );
            }
        });

const main = async () => { // shift + option + f para ordenar el codigo
    try {
        const adapterDB = new MockAdapter();
        const adapterFlow = createFlow([flowMenu, flowCartelera, flowPreciosEntradas, flowPreciosCombos, flowPromos, flowEntradas, flowRepresentante, flowRecomendacion, flowMensaje1]);
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
