import { OptionsWithUri } from 'request';
import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
} from 'n8n-core';
import { IDataObject } from 'n8n-workflow';

export async function jotformApiRequest(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: string, resource: string, body: any = {}, qs: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('jotFormApi');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}
	let options: OptionsWithUri = {
		headers: {
			'APIKEY': credentials.apiKey,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method,
		qs,
		form: body,
		uri: uri || `https://${credentials.apiDomain || 'api.jotform.com'}${resource}`,
		json: true
	};
	if (!Object.keys(body).length) {
		delete options.form;
	}
	options = Object.assign({}, options, option);

	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw new Error('JotForm Error: ' + error);
	}
}
