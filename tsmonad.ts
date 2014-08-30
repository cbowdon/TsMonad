/// <reference path="typings/tsd.d.ts" />
/// <reference path="either.ts" />
/// <reference path="maybe.ts" />

(function () {
    'use strict';

    if (typeof module !== undefined && module.exports) {
        // it's node
        module.exports = TsMonad;
    } else {
        // stick it on the global object
        this.TsMonad = TsMonad;
    }
}).call(this);
