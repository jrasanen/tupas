import * as R from 'ramda';
import conf from './config';
import * as u from './utils';

// Action type for TUPAS is always 701, according to
// http://www.finanssiala.fi/maksujenvalitys/dokumentit/Tupas-varmennepalvelu_v23c.pdf
const TUPAS_ACTION_TYPE: number = 701;

// 03 means sha256. Tupas supports some other's too, but don't even bother
// to support those.
const TUPAS_ALG_TYPE: string = '03';

// A01 mac fields are used for the first part:
// generate - when we generate the request payload
const A01_MAC_FIELDS: string[] = [
  'A01Y_ACTION_ID',
  'A01Y_VERS',
  'A01Y_RCVID',
  'A01Y_LANGCODE',
  'A01Y_STAMP',
  'A01Y_IDTYPE',
  'A01Y_RETLINK',
  'A01Y_CANLINK',
  'A01Y_REJLINK',
  'A01Y_KEYVERS',
  'A01Y_ALG',
  'secret'];

// B02 is used for the latter part, which is confirmation
// These fields are used for verifying the authenticity of
// request.
const B02_MAC_FIELDS: string[] = [
  'B02K_VERS',
  'B02K_TIMESTMP',
  'B02K_IDNBR',
  'B02K_STAMP',
  'B02K_CUSTNAME',
  'B02K_KEYVERS',
  'B02K_ALG',
  'B02K_CUSTID',
  'B02K_CUSTTYPE',
  'B02K_USERID',
  'B02K_USERNAME',
  'id',
  'secret'
];

// Curried helper to extract only required values
const b2Values: Function = u.valuesFromPayload(B02_MAC_FIELDS);

// Helper function to find the service broker from B02 timestamp.
const findProviderSecret: (timestamp: string) => string =
  (timestamp) =>
    // tslint:disable-next-line:no-any
    R.prop<string, any>('secret', R.find((e: { readonly number: string; }) => {
      return e.number === timestamp.substr(0, 3);
    }, conf.get('providers')));

export interface VerifyPayload {
  readonly B02K_TIMESTMP: string;
  readonly B02K_VERS: string;
  readonly B02K_IDNBR: string;
  readonly B02K_STAMP: string;
  readonly B02K_CUSTNAME: string;
  readonly B02K_KEYVERS: string;
  readonly B02K_ALG: string;
  readonly B02K_CUSTID: string;
  readonly B02K_CUSTTYPE: string;
  readonly B02K_MAC: string;
}

export interface Callbacks {
  readonly success: string;
  readonly cancel: string;
  readonly reject: string;
}

export interface Broker {
  readonly name: string;
  readonly url: string;
  readonly fields: {
    readonly A01Y_ACTION_ID: string;
    readonly A01Y_VERS: string;
    readonly A01Y_RCVID: string;
    readonly A01Y_LANGCODE: 'FI' | 'SV' | 'EN';
    readonly A01Y_STAMP: string;
    readonly A01Y_IDTYPE: string;
    readonly A01Y_RETLINK: string;
    readonly A01Y_CANLINK: string;
    readonly A01Y_REJLINK: string;
    readonly A01Y_KEYVERS: string;
    readonly A01Y_ALG: string;
    readonly secret: string;
  };
}

export interface BrokerData {
  readonly name: string;
  readonly id: string;
  readonly secret: string;
  readonly url: string;
  readonly version: string;
  readonly key: string;
  readonly type: string;
  readonly number: string;
}

/*
 * Verify TUPAS return data is valid
 * @param {VerifyPayload} Tupas verification payload, query values of tupas request
 * @returns {boolean}
 */
export const verify: (payload: VerifyPayload) => boolean =
  (payload) => {
    if (!R.has('B02K_TIMESTMP', payload) || !R.has('B02K_MAC', payload)) {
      return false;
    }

    return R.equals(u.digest(
      b2Values(
        R.merge(
          payload,
          { secret: `${findProviderSecret(payload.B02K_TIMESTMP)}&` })
      )
    ), payload.B02K_MAC);
  };

/*
 * Get TUPAS broker form fields for rendering
 * @param {stamp} Unique stamp for the request
 * @param {Callbacks} Success, reject and cancel callback definitions
 * @returns {Broker[]} Array of available brokers
 */
export const generate: (stamp: string, callbacks: Callbacks) => Broker[] =
  (stamp, callbacks) =>
    conf.get('providers').map((provider: BrokerData) => {

      return {
        name: provider.name,
        url: provider.url,
        fields: R.omit(['secret'], u.mac(A01_MAC_FIELDS, {
          A01Y_ACTION_ID: TUPAS_ACTION_TYPE,
          A01Y_VERS: provider.version,
          A01Y_RCVID: provider.id,
          A01Y_LANGCODE: 'FI',
          A01Y_STAMP: stamp,
          A01Y_IDTYPE: provider.type,
          A01Y_RETLINK: callbacks.success,
          A01Y_CANLINK: callbacks.cancel,
          A01Y_REJLINK: callbacks.reject,
          A01Y_KEYVERS: provider.key,
          A01Y_ALG: TUPAS_ALG_TYPE,
          secret: `${provider.secret}&`
        }))
      };
    });

export default { generate, verify };
