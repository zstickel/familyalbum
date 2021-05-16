const assert = require('assert');
const squared = require('../utilities/squared')
const groupByPoster = require('../utilities/organizememorybyposter');



describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe('squared', function () {
    it('squares a number', function () {
        assert.equal(squared(4), 16);
        assert.equal(squared(50), 2500);
        assert.equal(squared(3), 9);
        assert.equal(squared(18), 324);
    })
})

/*describe('groupByPoster', function () {
    it('organizes memory array', function () {
        assert.equal(groupByPoster(memoryArray),)
    })
})*/



