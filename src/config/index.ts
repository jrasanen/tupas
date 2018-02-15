import * as convict from 'convict';
import { existsSync } from 'fs';
import * as path from 'path';

// tslint:disable-next-line
const providers: any = require('./providers.json');

const conf: convict.Config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  providers: providers
});

const confFolder: string = __dirname.match(/build.src$/) ?
  path.join(__dirname, '..', '..', 'config')
  :
  path.join(__dirname, '..', 'config');

const confFile: string = path.join(confFolder, `${conf.get('env')}.json`);

if (existsSync(confFile)) {
  conf
    .loadFile(confFile)
    .validate({ allowed: 'strict' });
}

export default conf;
