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
        // <Monad laws>
        Either.prototype.unit = function (t) {
            return Either.right(t);
        };

        Either.prototype.bind = function (f) {
            return this.type === 1 /* Right */ ? f(this.r) : Either.left(this.l);
        };

        Either.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        // </Monad laws>
        Either.prototype.caseOf = function (pattern) {
            return this.type === 1 /* Right */ ? pattern.right(this.r) : pattern.left(this.l);
        };
        return Either;
    })();
    TsMonad.Either = Either;
})(TsMonad || (TsMonad = {}));
/// <reference path="monad.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TsMonad;
(function (TsMonad) {
    'use strict';

    (function (MaybeType) {
        MaybeType[MaybeType["Nothing"] = 0] = "Nothing";
        MaybeType[MaybeType["Just"] = 1] = "Just";
    })(TsMonad.MaybeType || (TsMonad.MaybeType = {}));
    var MaybeType = TsMonad.MaybeType;

    var MaybeX = (function () {
        function MaybeX(type, value) {
            this.type = type;
            this.value = value;
            this.lift = this.fmap;
        }
        // </Data constructors>
        MaybeX.maybe = function (t) {
            return t === null || t === undefined ? new MaybeX(0 /* Nothing */) : new MaybeX(1 /* Just */, t);
        };

        MaybeX.just = function (t) {
            if (t === null || t === undefined) {
                throw new TypeError('Cannot Maybe.just(null)');
            }
            return new MaybeX(1 /* Just */, t);
        };

        MaybeX.nothing = function () {
            return new MaybeX(0 /* Nothing */);
        };

        // </Data constructors>
        // <Monad laws>
        MaybeX.prototype.unit = function (u) {
            return MaybeX.maybe(u);
        };

        MaybeX.prototype.bind = function (f) {
            return this.type === 1 /* Just */ ? f(this.value) : MaybeX.nothing();
        };

        MaybeX.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        // </Monad laws>
        MaybeX.prototype.caseOf = function (patterns) {
            return this.type === 1 /* Just */ ? patterns.just(this.value) : patterns.nothing();
        };
        return MaybeX;
    })();
    TsMonad.MaybeX = MaybeX;

    var Maybe = (function (_super) {
        __extends(Maybe, _super);
        function Maybe() {
            _super.apply(this, arguments);
        }
        Maybe.maybe = function (t) {
            return MaybeX.maybe(t);
        };
        return Maybe;
    })(MaybeX);
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
