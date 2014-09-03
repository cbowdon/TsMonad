var TsMonad;
(function (TsMonad) {
    'use strict';

    (function (EitherType) {
        EitherType[EitherType["Left"] = 0] = "Left";
        EitherType[EitherType["Right"] = 1] = "Right";
    })(TsMonad.EitherType || (TsMonad.EitherType = {}));
    var EitherType = TsMonad.EitherType;

    var Either = (function () {
        // Constructor for internal use only - use the data constructors below
        function Either(type, l, r) {
            this.type = type;
            this.l = l;
            this.r = r;
            this.lift = this.fmap;
        }
        // <Data constructors>
        Either.left = function (l) {
            return new Either(0 /* Left */, l);
        };

        Either.right = function (r) {
            return new Either(1 /* Right */, null, r);
        };

        // </Data constructors>
        // <Monad>
        Either.prototype.unit = function (t) {
            return Either.right(t);
        };

        Either.prototype.bind = function (f) {
            return this.type === 1 /* Right */ ? f(this.r) : Either.left(this.l);
        };

        // </Monad>
        // <Functor>
        Either.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        // </Functor>
        Either.prototype.caseOf = function (pattern) {
            return this.type === 1 /* Right */ ? pattern.right(this.r) : pattern.left(this.l);
        };

        Either.prototype.equals = function (other) {
            return other.type === this.type && ((this.type === 0 /* Left */ && other.l === this.l) || (this.type === 1 /* Right */ && other.r === this.r));
        };
        return Either;
    })();
    TsMonad.Either = Either;
})(TsMonad || (TsMonad = {}));
var TsMonad;
(function (TsMonad) {
    'use strict';

    

    

    
})(TsMonad || (TsMonad = {}));
/// <reference path="monad.ts" />
var TsMonad;
(function (TsMonad) {
    'use strict';

    (function (MaybeType) {
        MaybeType[MaybeType["Nothing"] = 0] = "Nothing";
        MaybeType[MaybeType["Just"] = 1] = "Just";
    })(TsMonad.MaybeType || (TsMonad.MaybeType = {}));
    var MaybeType = TsMonad.MaybeType;

    var Maybe = (function () {
        function Maybe(type, value) {
            this.type = type;
            this.value = value;
            this.lift = this.fmap;
        }
        // </Data constructors>
        Maybe.maybe = function (t) {
            return t === null || t === undefined ? new Maybe(0 /* Nothing */) : new Maybe(1 /* Just */, t);
        };

        Maybe.just = function (t) {
            if (t === null || t === undefined) {
                throw new TypeError('Cannot Maybe.just(null)');
            }
            return new Maybe(1 /* Just */, t);
        };

        Maybe.nothing = function () {
            return new Maybe(0 /* Nothing */);
        };

        // </Data constructors>
        // <Monad>
        Maybe.prototype.unit = function (u) {
            return Maybe.maybe(u);
        };

        Maybe.prototype.bind = function (f) {
            return this.type === 1 /* Just */ ? f(this.value) : Maybe.nothing();
        };

        // </Monad>
        // <Functor>
        Maybe.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        // </Functor>
        Maybe.prototype.caseOf = function (patterns) {
            return this.type === 1 /* Just */ ? patterns.just(this.value) : patterns.nothing();
        };

        Maybe.prototype.equals = function (other) {
            return other.type === this.type && (this.type === 0 /* Nothing */ || other.value === this.value);
        };
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
