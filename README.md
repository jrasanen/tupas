[![Build Status](https://travis-ci.org/jrasanen/tupas.svg?branch=master)](https://travis-ci.org/jrasanen/tupas)

# TUPAS

## DESCRIPTION

TypeScript TUPAS implementation.

## REQUIREMENTS

* Node.js
* TypeScript

## USAGE

### Tupas.generate(stamp: string, callbacks: Callbacks) => Broker[]
Generate an array of supported service providers.

* *stamp* - Unique alpha numeric 20 character string, identifying the current request
* *callbacks* - Callbacks/urls, users browser is redirected to these after authentication, rejection or cancellation
  * *success* - successful authentication event
  * *reject* - when user's authentication request was rejected
  * *cancel* - when user cancels the authentication


### Tupas.verify(payload: VerifyPayload) => boolean
Verify payload request's mac
* B02K_TIMESTMP: string
* B02K_VERS: string
* B02K_IDNBR: string
* B02K_STAMP: string
* B02K_CUSTNAME: string
* B02K_KEYVERS: string
* B02K_ALG: string
* B02K_CUSTID: string
* B02K_CUSTTYPE: string
* B02K_MAC: string

## EXAMPLE
Simple koa server to demonstrate how it works

    npm install
    npm run

## TESTS
Unit tests

    npm install
    npm test




