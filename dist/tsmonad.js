var TsMonad;
(function (TsMonad) {
    'use strict';

    (function (EitherType) {
        EitherType[EitherType["Left"] = 0] = "Left";
        EitherType[EitherType["Right"] = 1] = "Right";
    })(TsMonad.EitherType || (TsMonad.EitherType = {}));
    var EitherType = TsMonad.EitherType;

    var Either = (function () {
        function Either(type, l, r) {
            this.type = type;
            this.l = l;
            this.r = r;
        }
        Either.left = function (l) {
            return new Either(0 /* Left */, l);
        };

        Either.right = function (r) {
            return new Either(1 /* Right */, null, r);
        };

        Either.prototype.bind = function (f) {
            return this.type === 1 /* Right */ ? f(this.r) : Either.left(this.l);
        };

        Either.prototype.lift = function (f) {
            return this.type === 1 /* Right */ ? Either.unit(f(this.r)) : Either.left(this.l);
        };

        Either.prototype.caseOf = function (pattern) {
            return this.type === 1 /* Right */ ? pattern.right(this.r) : pattern.left(this.l);
        };
        Either.unit = Either.right;
        return Either;
    })();
    TsMonad.Either = Either;
})(TsMonad || (TsMonad = {}));
var TsMonad;
(function (TsMonad) {
    'use strict';

    (function (MaybeType) {
        MaybeType[MaybeType["Just"] = 0] = "Just";
        MaybeType[MaybeType["Nothing"] = 1] = "Nothing";
    })(TsMonad.MaybeType || (TsMonad.MaybeType = {}));
    var MaybeType = TsMonad.MaybeType;

    var Maybe = (function () {
        function Maybe(type, value) {
            this.type = type;
            this.value = value;
        }
        Maybe.just = function (t) {
            return new Maybe(0 /* Just */, t);
        };

        Maybe.nothing = function () {
            return new Maybe(1 /* Nothing */);
        };

        Maybe.prototype.bind = function (f) {
            return this.type === 0 /* Just */ ? f(this.value) : Maybe.nothing();
        };

        Maybe.prototype.lift = function (f) {
            var res;
            if (this.type === 0 /* Just */) {
                res = f(this.value);

                // the lifted function returns null, become Nothing
                if (res !== null && res !== undefined) {
                    return Maybe.unit(res);
                }
            }
            return Maybe.nothing();
        };

        Maybe.prototype.caseOf = function (patterns) {
            return this.type === 0 /* Just */ ? patterns.just(this.value) : patterns.nothing();
        };
        Maybe.unit = Maybe.just;
        return Maybe;
    })();
    TsMonad.Maybe = Maybe;
})(TsMonad || (TsMonad = {}));
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
//# sourceMappingURL=tsmonad.js.map
