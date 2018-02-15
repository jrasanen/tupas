import * as crypto from 'crypto';
import * as R from 'ramda';
const ALGO: string = 'sha256';

/*
 * Return list of values of given fields of an object
 * @param {fields} fields to get from the object
 * @param {payload} object to get values from
 * @returns {array} string array of selected values
 */
export const valuesFromPayload: (fields: string[]) => Function =
  (fields) => R.compose(R.values, R.pick(fields));

/*
 * SHA256 digest string from an array of values
 * @param {array} array of values to calculate the sha256 hash from.
 * @returns {string} Uppercase SHA256 hash
 */
export const digest: (a: string[]) => string =
  (values) => crypto
    .createHash(ALGO)
    .update(values.join('&'))
    .digest('hex')
    .toUpperCase();

/*
 * Get payload's MAC string
 * @param {object} values Payload to get mac from
 * @param {array} fields Fields required for mac
 * @returns {string} SHA256 mac
 */
export const mac: (fields: string[], v: {}) => {} =
  (fields, values) =>
    R.merge(values, {
      A01Y_MAC: digest(valuesFromPayload(fields)(values))
    });

