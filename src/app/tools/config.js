import { Md5 } from 'md5-typescript';

export let Payu = {

    //Sandbox
    // action: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
    // merchantId: '508029',
    // accountId: '512321', //Solo para Colombia
    // responseUrl: 'http://localhost:4200/dashboard/respuesta-pago',
    // confirmationUrl: 'http://www.test.com/confirmation',
    // apiKey: '4Vj8eK4rloUd272L48hsrarnUA',
    // test: 1

    //live
    action: 'https://checkout.payulatam.com/ppp-web-gateway-payu/',
    merchantId: '703550',
    accountId: '706622',
    // responseUrl: 'http://localhost:4200/dashboard/respuesta-pago',
    responseUrl: 'https://chym-elearning.com/dashboard/respuesta-pago',
    confirmationUrl: 'http://consulta.chym-ndt.com/pendiente',
    apiKey: 'mmONpkg713IC1LjC1H2Jg2U4F0',
    test: 0,
    urlFree: '/dashboard/respuesta-pago'


}

export let payuSignature = {
    fnc: function (reference, value, divisa) {
        return Md5.init(`${Payu.apiKey}~${Payu.merchantId}~${reference}~${value}~${divisa}`);
    }
}