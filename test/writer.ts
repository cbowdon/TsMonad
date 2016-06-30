import * as _ from 'underscore'
import * as assert from 'assert'

import {Writer, writer} from '../src/writer'

describe('Writer', () => {

    it('Bind', () => {

        assert.ok(Writer.tell(0)
            .bind(x => Writer.writer([1,0,1], 'jazzy'))
            .equals(Writer.writer([0,1,0,1], 'jazzy')));

        assert.ok(Writer.tell('This ')
            .bind(x => Writer.writer(['is a '], [1,2,3]))
            .bind(x => Writer.writer(['story'], 99))
            .equals(Writer.writer(['This ', 'is a ', 'story'], 99)));
    });

    it('Case of', () => {

        assert.ok(Writer.tell('all about')
            .caseOf({
                writer: (s, v) => _.isEqual(s, ['all about']) && v === 0
            }));
    });

    it('Lift', () => {

        assert.ok(Writer.tell('how')
            .lift(x => [0,0,0,0])
            .lift(x => 99)
            .caseOf({
                writer: (s, v) => _.isEqual(s, ['how']) && v === 99
            }));
    });

    it('Constructors', () => {

        assert.ok(writer(['my'], 1234)
            .caseOf({
                writer: (s, v) => _.isEqual(s, ['my']) && v === 1234
            }));
    });

})

