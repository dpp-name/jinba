# Jinba

Jinba is JavaScript Real User Measurements (RUM) client and infrastructure scripts.

## Build Client

Jinba client is written using CommonJS module format. You can use it directily in nodejs or use webpack to build for browser.

    webpack -p --output-library="Jinba" --output-library-target="var" client/Jinba.js dist/Jinba.Client.min.js
    
    