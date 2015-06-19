var TsMonad;
(function (TsMonad) {
    'use strict';

    /**
    * @name EitherType
    * @description Enumerate the different types contained by an Either object.
    */
    (function (EitherType) {
        EitherType[EitherType["Left"] = 0] = "Left";
        EitherType[EitherType["Right"] = 1] = "Right";
    })(TsMonad.EitherType || (TsMonad.EitherType = {}));
    var EitherType = TsMonad.EitherType;

    

    function exists(t) {
        return t !== null && t !== undefined;
    }

    /**
    * @name either
    * @description Build an Either object.
    * @function
    * @param l The object as a Left (optional).
    * @param r The object as a Right (optional).
    * @returns {Either<L, R>} Either object containing the input.
    * @throws {TypeError} If there are both or none of left and right
    *     parameter.
    * @see Either#
    */
    function either(l, r) {
        if (exists(l) && exists(r)) {
            throw new TypeError('Cannot construct an Either with both a left and a right');
        }
        if (!exists(l) && !exists(r)) {
            throw new TypeError('Cannot construct an Either with neither a left nor a right');
        }
        if (exists(l) && !exists(r)) {
            return Either.left(l);
        }
        if (!exists(l) && exists(r)) {
            return Either.right(r);
        }
    }
    TsMonad.either = either;

    /**
    * @name Either
    * @class Either has exactly two sub types, Left (L) and Right (R). If an
    *     Either<L, R> object contains an instance of L, then the Either is a
    *     Left. Otherwise it contains an instance of R and is a Right. By
    *     convention, the Left constructor is used to hold an error value and
    *     the Right constructor is used to hold a correct value.
    */
    var Either = (function () {
        /**
        * @description Build an Either object. For internal use only.
        * @constructor
        * @methodOf Either#
        * @param {EitherType} type Indicates if the Either content is a Left or a Right.
        * @param {L} l The Left value (optional).
        * @param {R} l The Right value (optional).
        */
        function Either(type, l, r) {
            this.type = type;
            this.l = l;
            this.r = r;
            /**
            * @name of
            * @description Alias for unit.
            * @methodOf Either#
            * @public
            * @see Either#unit
            * @see Monad#of
            */
            this.of = this.unit;
            /**
            * @name chain
            * @description Alias for bind.
            * @methodOf Either#
            * @public
            * @see Either#bind
            * @see Monad#chain
            */
            this.chain = this.bind;
            /**
            * @name lift
            * @description Alias for fmap.
            * @methodOf Either#
            * @public
            * @see Either#fmap
            * @see Functor#lift
            */
            this.lift = this.fmap;
            /**
            * @name map
            * @description Alias for fmap.
            * @methodOf Either#
            * @public
            * @see Either#fmap
            * @see Functor#map
            */
            this.map = this.fmap;
        }
        /**
        * @name left
        * @description Helper function to build an Either with a Left.
        * @methodOf Either#
        * @static
        * @param {L} l The Left value.
        * @returns {Either<L, R>} Either object containing a Left.
        */
        Either.left = function (l) {
            return new Either(0 /* Left */, l);
        };

        /**
        * @name right
        * @description Helper function to build an Either with a Right.
        * @methodOf Either#
        * @static
        * @param {R} r The Right value.
        * @returns {Either<L, R>} Either object containing a Right.
        */
        Either.right = function (r) {
            return new Either(1 /* Right */, null, r);
        };

        /**
        * @name unit
        * @description Wrap a value inside an Either Right object.
        * @methodOf Either#
        * @public
        * @param {T} t
        * @returns {Either<L, R>} Either object containing a Right.
        * @see Monad#unit
        */
        Either.prototype.unit = function (t) {
            return Either.right(t);
        };

        /**
        * @name bind
        * @description Apply the function passed as parameter on the object.
        * @methodOf Either#
        * @public
        * @param {(r: R) => Either<L, T>} f Function applied on the Right.
        * @returns {Either<L, T>} The result of the function f wrapped inside
        *     an Either object.
        * @see Monad#bind
        */
        Either.prototype.bind = function (f) {
            return this.type === 1 /* Right */ ? f(this.r) : Either.left(this.l);
        };

        /**
        * @name fmap
        * @description Apply the function passed as parameter on the object.
        * @methodOf Either#
        * @public
        * @param {(r: R) => T} f Function applied on the Right.
        * @returns {Either<L, T>} The result of the function f wrapped inside
        *     an Either object.
        * @see Functor#fmap
        */
        Either.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        /**
        * @name caseOf
        * @description Execute a function depending on the Either content.
        *     It allows to unwrap the object for Left or Right types.
        * @methodOf Either#
        * @public
        * @param {EitherPatterns<L, R, T>} pattern Object containing the
        *     functions to applied on each Either types.
        * @return {T} The returned value of the functions specified in the
        *     EitherPatterns interface.
        * @see EitherPatterns#
        */
        Either.prototype.caseOf = function (pattern) {
            return this.type === 1 /* Right */ ? pattern.right(this.r) : pattern.left(this.l);
        };

        /**
        * @name equals
        * @description Compare the type and the content of two Either
        *     objects.
        * @methodOf Either#
        * @public
        * @param {Either<L, R>} other The Either to compare with.
        * @return {boolean} True if the type and content value are equals,
        *     false otherwise.
        * @see Eq#equals
        */
        Either.prototype.equals = function (other) {
            return other.type === this.type && ((this.type === 0 /* Left */ && TsMonad.eq(other.l, this.l)) || (this.type === 1 /* Right */ && TsMonad.eq(other.r, this.r)));
        };
        return Either;
    })();
    TsMonad.Either = Either;
})(TsMonad || (TsMonad = {}));
var TsMonad;
(function (TsMonad) {
    'use strict';

    /**
    * @name eq
    * @description Compare two objects :
    *     1. if objects implement Eq, defer to their .equals
    *     2. if are arrays, iterate and recur
    * @function
    * @param {any} a Any object.
    * @param {any} b Any object.
    * @returns {boolean} In case 1, the `.equals()` function returned value.
    *     In case 2, true if each elements are equals, false otherwise.
    */
    function eq(a, b) {
        var idx = 0;
        if (a === b) {
            return true;
        }
        if (typeof a.equals === 'function') {
            return a.equals(b);
        }
        if (a.length > 0 && a.length === b.length) {
            for (; idx < a.length; idx += 1) {
                if (!eq(a[idx], b[idx])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    TsMonad.eq = eq;

    

    

    

    
})(TsMonad || (TsMonad = {}));
/// <reference path="monad.ts" />
var TsMonad;
(function (TsMonad) {
    'use strict';

    /**
    * @name MaybeType
    * @description Enumerate the different types contained by an Maybe object.
    * @see Maybe#
    */
    (function (MaybeType) {
        MaybeType[MaybeType["Nothing"] = 0] = "Nothing";
        MaybeType[MaybeType["Just"] = 1] = "Just";
    })(TsMonad.MaybeType || (TsMonad.MaybeType = {}));
    var MaybeType = TsMonad.MaybeType;

    

    /**
    * @name maybe
    * @description Build a Maybe object.
    * @function
    * @param {T} t The object to wrap.
    * @returns {Maybe<T>} A Maybe object containing the input. If t is null
    *     or undefined, the Maybe object is filled with Nothing.
    * @see Maybe#
    */
    function maybe(t) {
        return Maybe.maybe(t);
    }
    TsMonad.maybe = maybe;

    /**
    * @name Maybe
    * @class Encapsulates an optional value. A value of type Maybe a either
    *     contains a value of type a (represented as Just a), or it is empty
    *     (represented as Nothing).
    */
    var Maybe = (function () {
        /**
        * @description Build a Maybe object. For internal use only.
        * @constructor
        * @methodOf Maybe#
        * @param {MaybeType} type Indicates if the Maybe content is a Just or a Nothing.
        * @param {T} value The value to wrap (optional).
        */
        function Maybe(type, value) {
            this.type = type;
            this.value = value;
            /**
            * @name of
            * @description Alias for unit.
            * @methodOf Maybe#
            * @public
            * @see Maybe#unit
            * @see Monad#of
            */
            this.of = this.unit;
            /**
            * @name chain
            * @description Alias for bind.
            * @methodOf Maybe#
            * @public
            * @see Maybe#unit
            * @see Monad#of
            */
            this.chain = this.bind;
            /**
            * @name lift
            * @description Alias for fmap.
            * @methodOf Maybe#
            * @public
            * @see Maybe#fmap
            * @see Monad#of
            */
            this.lift = this.fmap;
            /**
            * @name map
            * @description Alias for fmap.
            * @methodOf Maybe#
            * @public
            * @see Maybe#fmap
            * @see Monad#of
            */
            this.map = this.fmap;
        }
        /**
        * @name maybe
        * @description Helper function to build a Maybe object.
        * @methodOf Maybe#
        * @static
        * @param {T} t The value to wrap.
        * @returns {Maybe<T>} A Maybe object containing the value passed in input. If t is null
        *     or undefined, the Maybe object is filled with Nothing.
        */
        Maybe.maybe = function (t) {
            return t === null || t === undefined ? new Maybe(0 /* Nothing */) : new Maybe(1 /* Just */, t);
        };

        /**
        * @name just
        * @description Helper function to build a Maybe object filled with a
        *     Just type.
        * @methodOf Maybe#
        * @static
        * @param {T} t The value to wrap.
        * @returns {Maybe<T>} A Maybe object containing the value passed in input.
        * @throws {TypeError} If t is null or undefined.
        */
        Maybe.just = function (t) {
            if (t === null || t === undefined) {
                throw new TypeError('Cannot Maybe.just(null)');
            }
            return new Maybe(1 /* Just */, t);
        };

        /**
        * @name nothing
        * @description Helper function to build a Maybe object filled with a
        *     Nothing type.
        * @methodOf Maybe#
        * @static
        * @returns {Maybe<T>} A Maybe with a Nothing type.
        */
        Maybe.nothing = function () {
            return new Maybe(0 /* Nothing */);
        };

        /**
        * @name unit
        * @description Wrap an object inside a Maybe.
        * @public
        * @methodOf Maybe#
        * @param {U} u The object to wrap.
        * @returns {Monad<U>} A Monad with the value wrapped inside.
        * @see Monad#unit
        */
        Maybe.prototype.unit = function (u) {
            return Maybe.maybe(u);
        };

        /**
        * @name bind
        * @description Apply the function passed as parameter on the object.
        * @methodOf Maybe#
        * @public
        * @param {(t: T) => Maybe<U>} f Function applied on the Maybe content.
        * @returns {Maybe<U>} The result of the function f wrapped inside
        *     a Maybe object.
        * @see Monad#bind
        */
        Maybe.prototype.bind = function (f) {
            return this.type === 1 /* Just */ ? f(this.value) : Maybe.nothing();
        };

        /**
        * @name fmap
        * @description Apply the function passed as parameter on the object.
        * @methodOf Maybe#
        * @public
        * @param {(t: T) => U} f Function applied on the Maybe content.
        * @returns {Maybe<U>} The result of the function f wrapped inside
        *     an Maybe object.
        * @see Functor#fmap
        */
        Maybe.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        /**
        * @name caseOf
        * @description Execute a function depending on the Maybe content. It
        *     allows to unwrap the object for Just or Nothing types.
        * @methodOf Maybe#
        * @public
        * @param {MaybePatterns<T, U>} pattern Object containing the
        *     functions to applied on each Maybe types.
        * @return {U} The returned value of the functions specified in the
        *     MaybePatterns interface.
        * @see MaybePatterns#
        */
        Maybe.prototype.caseOf = function (patterns) {
            return this.type === 1 /* Just */ ? patterns.just(this.value) : patterns.nothing();
        };

        /**
        * @name equals
        * @description Compare the type and the content of two Maybe
        *     objects.
        * @methodOf Maybe#
        * @public
        * @param {Maybe<T>} other The Maybe to compare with.
        * @return {boolean} True if the type and content value are equals,
        *     false otherwise.
        * @see Eq#equals
        */
        Maybe.prototype.equals = function (other) {
            return other.type === this.type && (this.type === 0 /* Nothing */ || TsMonad.eq(other.value, this.value));
        };
        return Maybe;
    })();
    TsMonad.Maybe = Maybe;
})(TsMonad || (TsMonad = {}));
var TsMonad;
(function (TsMonad) {
    'use strict';

    

    /**
    * @name writer
    * @description Build a Writer object.
    * @function
    * @param {S[]} story The collection to store logs.
    * @param {T} value The object to wrap.
    * @returns {Writer<S, T>} A Writer object containing the log collection
    *     and the wrapped value.
    * @see Writer#
    */
    function writer(story, value) {
        return Writer.writer(story, value);
    }
    TsMonad.writer = writer;

    /**
    * @name Writer
    * @class Allow to do computations while making sure that all the log
    *     values are combined into one log value that then gets attached to
    *     the result.
    */
    var Writer = (function () {
        /**
        * @description Build a Writer object. For internal use only.
        * @constructor
        * @methodOf Writer#
        * @param {S[]} story The collection of logs.
        * @param {T} value The object to wrap.
        */
        function Writer(story, value) {
            this.story = story;
            this.value = value;
            /**
            * @name of
            * @description Alias for unit.
            * @methodOf Writer#
            * @public
            * @see Writer#unit
            * @see Monad#of
            */
            this.of = this.unit;
            /**
            * @name chain
            * @description Alias for bind
            * @methodOf Writer#
            * @public
            * @see Writer#unit
            * @see Monad#of
            */
            this.chain = this.bind;
            /**
            * @name lift
            * @description Alias for fmap
            * @methodOf Writer#
            * @public
            * @see Writer#fmap
            * @see Monad#of
            */
            this.lift = this.fmap;
            /**
            * @name map
            * @description Alias for fmap
            * @methodOf Writer#
            * @public
            * @see Writer#fmap
            * @see Monad#of
            */
            this.map = this.fmap;
        }
        /**
        * @name writer
        * @description Helper function to build a Writer object.
        * @methodOf Writer#
        * @static
        * @param {S[]} story The collection of logs.
        * @param {T} value The object to wrap.
        * @returns {Writer<S, T>} A Writer object containing the collection of logs
        *     and the wrapped value.
        */
        Writer.writer = function (story, value) {
            return new Writer(story, value);
        };

        /**
        * @name writer
        * @description Helper function to build a Writer object with the log
        *     passed in input only.
        * @methodOf Writer#
        * @static
        * @param {S} s A log to store.
        * @returns {Writer<S, number>} A Writer object containing the collection of logs
        *     and a zeroed value.
        */
        Writer.tell = function (s) {
            return new Writer([s], 0);
        };

        /**
        * @name unit
        * @description Wrap an object inside a Writer.
        * @public
        * @methodOf Writer#
        * @param {U} u The object to wrap.
        * @returns {Monad<U>} A Writer with the value wrapped inside and an
        *     empty collection of logs.
        * @see Monad#unit
        */
        Writer.prototype.unit = function (u) {
            return new Writer([], u);
        };

        /**
        * @name bind
        * @description Apply the function passed as parameter on the object.
        * @methodOf Writer#
        * @public
        * @param {(t: T) => Writer<S, U>} f Function applied on the Writer content.
        * @returns {Writer<S, U>} The result of the function f append to the
        *     Writer object.
        * @see Monad#bind
        */
        Writer.prototype.bind = function (f) {
            var wu = f(this.value), newStory = this.story.concat(wu.story);
            return new Writer(newStory, wu.value);
        };

        /**
        * @name fmap
        * @description Apply the function passed as parameter on the object.
        * @methodOf Writer#
        * @public
        * @param {(t: T) => U} f Function applied on the wrapped value.
        * @returns {Writer<S, U>} The result of the function f wrapped inside
        *     an Writer object. It has an empty collection of logs.
        * @see Functor#fmap
        */
        Writer.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        /**
        * @name caseOf
        * @description Execute a function on the Writer content. It allows to
        *     unwrap the object.
        * @methodOf Writer#
        * @public
        * @param {WriterPatterns<S, T, U>} pattern Object containing the
        *     functions to applied on the Writer content.
        * @return {U} The returned value of the function specified in the
        *     WriterPatterns interface.
        * @see WriterPatterns#
        */
        Writer.prototype.caseOf = function (patterns) {
            return patterns.writer(this.story, this.value);
        };

        /**
        * @name equals
        * @description Compare the type and the content of two Writer
        *     objects.
        * @methodOf Writer#
        * @public
        * @param {Writer<S, T>} other The Writer to compare with.
        * @return {boolean} True if the collection of logs and content value
        *     are equals, false otherwise.
        * @see Eq#equals
        */
        Writer.prototype.equals = function (other) {
            var i, sameStory = true;
            for (i = 0; i < this.story.length; i += 1) {
                sameStory = sameStory && this.story[i] === other.story[i];
            }
            return sameStory && this.value === other.value;
        };
        return Writer;
    })();
    TsMonad.Writer = Writer;
})(TsMonad || (TsMonad = {}));
/// <reference path="either.ts" />
/// <reference path="maybe.ts" />
/// <reference path="writer.ts" />


(function () {
    'use strict';

    if (typeof module !== 'undefined' && module.exports) {
        // it's node
        module.exports = TsMonad;
    } else {
        // stick it on the global object
        this.TsMonad = TsMonad;
    }
}).call(this);
//# sourceMappingURL=tsmonad.js.map
