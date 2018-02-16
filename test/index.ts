import * as Chai from 'chai';

import Tupas from '../src/index';

const expect: Chai.ExpectStatic = Chai.expect;

// tslint:disable-next-line:no-any
const verifyPayload: any = {
  B02K_VERS: '0002',
  B02K_TIMESTMP: '2002018021619373622',
  B02K_IDNBR: '23762928',
  B02K_STAMP: 'qhszgqf',
  B02K_CUSTNAME: 'TESTAA PORTAALIA',
  B02K_KEYVERS: '0001',
  B02K_ALG: '03',
  B02K_CUSTID: 'A78C2017431BD14E93221F191EC92CF0CFB1FAD24A1BE75586B88A8293EAF5DF',
  B02K_CUSTTYPE: '05',
  B02K_MAC: '027F9AFBF51E292EF947C474ADBA445ACA0D47C649C7B97917875D68837BE86E'
};

describe('Tupas', () => {
  it('can verify a payload', () => {
    expect(Tupas.verify(verifyPayload)).to.eq(true);
  });

  it('does not verify wrong data', () => {
    // tslint:disable-next-line:no-any
    expect(Tupas.verify('' as any)).to.eq(false);
  });

  it('gets list of brokers', () =>
    expect(
      Tupas.generate('123', { success: '123', cancel: '123', reject: '123' })
    ).to.be.an('array').with.lengthOf(10));
});
