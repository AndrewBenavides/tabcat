# tabcat

## devlog
Mostly because this is a learning process.

1) `npm install --save-dev parcel typescript web-ext webextension-polyfill @types/node @types/webextension-polyfill`
    * [`parcel`](https://en.parceljs.org/): bundler, required to correctly generate module javascript files with imported libraries
    * [`typescript`](https://www.typescriptlang.org/docs/): primary programming language in this extension
    * [`web-ext`](https://github.com/mozilla/web-ext):
    * [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill): required when using the *@types/webextension-polyfill* type definitions package, as typescript will compile the code in such a manner that it will fail without this library. The code within this package executes as a '[no-op](https://github.com/mozilla/webextension-polyfill#supported-browsers)' statement for Firefox as the web extensions support is native and there is no need for the actual polyfills.
    * [`@types/node`](https://www.npmjs.com/package/@types/node): used for static typing typescript files in ./scripts/
    * [`@types/webextension-polyfill`](https://github.com/mozilla/webextension-polyfill#usage-with-typescript): used for static typing the web extension typescript files
1) Added `build`, `clean`, and `debug` npm scripts to **package.json**
    * `build`: uses *parcel* to build the sidebar entry point, outputs to **./dist/**
    * `clean`: uses **./scripts/clean.mjs** to remove the specified targets
        * `cache`: **./parcel-cache**
        * `dist`: **./dist**
        * `modules`: **./node_modules**
        * `all`: all targets
    * `debug`: uses *web-ext* to launch Firefox with the extension
    * `tsc`: uses *tsc* to compile scripting `mts` files
