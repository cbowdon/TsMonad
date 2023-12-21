import { Maybe, Either, Writer } from "../index.js";

import * as assert from "assert";

// TODO Automatically populate the README sections from the examples tests
describe("Examples", () => {
    it("Pattern matching", () => {
        var turns_out_to_be_100: number, turns_out_to_be_a_piano: number;

        turns_out_to_be_100 = Maybe.just(10).caseOf({
            just: (n) => n * n,
            nothing: () => -1,
        });

        assert.strictEqual(turns_out_to_be_100, 100);

        turns_out_to_be_a_piano = Maybe.nothing<number>().caseOf({
            just: (n) => n * n,
            nothing: () => -1, // joke, it's negative one not a piano
        });

        assert.strictEqual(turns_out_to_be_a_piano, -1);

        // The example that doesn't compile is not tested here, for obvious reasons. Exercise for the reader?
    });

    // <Test data definitions>
    class BusPass {
        isValidForRoute(route: string) {
            return route === "Weston";
        }
    }

    interface User<T> {
        getAge(): T;
    }
    // </Test data definitions>

    it("General Maybe usage", () => {
        var user: User<Maybe<number>>, canRideForFree: boolean;

        function getBusPass(age: number): Maybe<BusPass> {
            return age > 100 ? Maybe.nothing<BusPass>() : Maybe.just(new BusPass());
        }

        user = { getAge: () => Maybe.just(42) };

        canRideForFree = user
            .getAge() // user might not have provided age, this is a Maybe<number>
            .bind((age) => getBusPass(age)) // not all ages have a bus pass, this is a Maybe<BusPass>
            .caseOf({
                just: (busPass) => busPass.isValidForRoute("Weston"),
                nothing: () => false,
            });

        assert.ok(canRideForFree);
    });

    it("Maybe helpers", () => {
        assert.deepEqual(
            { three: 3, hi: "hi" },
            Maybe.sequence<number | string>({ three: Maybe.just(3), hi: Maybe.just("hi") }).caseOf({
                just: (map: any) => map,
                nothing: () => {},
            })
        );

        assert.ok(
            Maybe.sequence<number>({ three: Maybe.just(3), hi: Maybe.nothing<number>() }).caseOf({
                just: (map: any) => false,
                nothing: () => true,
            })
        );
    });

    it("General Either usage", () => {
        var user: User<Either<string, number>>, canRideForFree: boolean;

        function getBusPass(age: number): Either<string, BusPass> {
            return age > 100
                ? Either.left<string, BusPass>("Too young for a bus pass")
                : Either.right<string, BusPass>(new BusPass());
        }

        user = { getAge: () => Either.right<string, number>(42) };

        canRideForFree = user
            .getAge() // either 42 or 'Information withheld' - type of Either<string,number>
            .bind((age) => getBusPass(age)) // either busPass or 'Too young for a bus pass' - type of Either<string,BusPass>
            .caseOf({
                right: (busPass) => busPass.isValidForRoute("Weston"),
                left: (errorMessage) => {
                    console.log(errorMessage);
                    return false;
                },
            });

        assert.ok(canRideForFree);
    });

    it("General Writer usage", () => {
        assert.ok(
            Writer.writer(["Started with 0"], 0)
                .bind((x) => Writer.writer(["+ 8"], x + 8))
                .bind((x) => Writer.writer(["- 6", "* 8"], 8 * (x - 6)))
                .caseOf({
                    writer: (s, v) => v === 16 && s.join(", ") === "Started with 0, + 8, - 6, * 8",
                })
        );
    });

    it("Lift/fmap", () => {
        var turns_out_to_be_true = Maybe.just(123)
            .lift((n) => n * 2)
            .caseOf({
                just: (n) => n === 246,
                nothing: () => false,
            });

        assert.ok(turns_out_to_be_true);
    });
});
