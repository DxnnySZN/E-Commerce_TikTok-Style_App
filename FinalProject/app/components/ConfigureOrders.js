import { Configuration, AuthenticationApi, OrdersApi } from '@whitebox-co/walmart-marketplace-api';
import { Buffer } from 'buffer/'; // trailing slash is important and not a mistake

// configure authorization api
const configuration = new Configuration();
const authApi = new AuthenticationApi(configuration);
const authorization = 'Basic ' + Buffer.from(env.CLIENT_ID + ':' + env.CLIENT_SECRET).toString('base64');

// get response token
const tokenResponse = await authApi.tokenAPI({
	authorization,
	wMQOSCORRELATIONID: uuidv4(),
	wMSVCNAME: '@whitebox-co/walmart-marketplace-api',
	grantType: 'client_credentials',
	wMCONSUMERCHANNELTYPE: env.CONSUMER_CHANNEL_TYPE,
});

// configure orders api
const ordersApi = new OrdersApi(configuration);

// make subsequent order calls
const orderResponse = await ordersApi.getAnOrder({
	authorization,
	wMSECACCESSTOKEN: tokenResponse.data?.access_token,
	wMQOSCORRELATIONID: uuidv4(),
	wMSVCNAME: '@whitebox-co/walmart-marketplace-api',
	wMCONSUMERCHANNELTYPE: env.CONSUMER_CHANNEL_TYPE,
	id: 1,
});