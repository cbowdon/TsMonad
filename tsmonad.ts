/// <reference path="either.ts" />
/// <reference path="maybe.ts" />
/// <reference path="writer.ts" />

// Node module declaration taken from node.d.ts
declare var module: {
    exports: any;
    require(id: string): any;
    id: string;
    filename: string;
    loaded: boolean;
    parent: any;
    children: any[];
};

declare module 'tsmonad' {
    export = TsMonad;
}

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
