/* istanbul ignore file */
import * as convict from 'convict';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

const confFolder: string = path.join(__dirname, '..', '..', 'config');
const providersFile: string = path.join(confFolder, `./providers.json`);

// tslint:disable-next-line
let providers: any;

if (existsSync(providersFile)) {
  providers = JSON.parse(readFileSync(providersFile, 'utf-8'));
}

const conf: convict.Config = convict({
  providers: {
    doc: 'Provider json',
    format: Object,
    default: providers,
    env: 'PROVIDERS_JSON'
  }
});


export default conf;
