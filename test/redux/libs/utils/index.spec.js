var utils = require('../../../../libs/redux/libs/utils');
var should = require('chai').should();

describe('redux :: libs :: utils :: index.js', function () {

    it('failure :: should check if passed arg is an object', function () {
        var result = utils.isObject('STRING');
        result.should.equal(false);
    });


    it('success :: should check if passed arg is an object', function () {
        var result = utils.isObject({});
        result.should.equal(true);
    });

    it('failure || object :: should check if the provided variable is a mongoose ObjectId', function (done) {
        utils.validateId('daa')
            .catch(function (err) {
                err.code.should.equal(411);
                done();
            })
    });

    it('success || object :: should check if the provided variable is a mongoose ObjectId', function (done) {
        utils.validateId('53cb6b9b4f4ddef1ad47f943')
            .then(function (res) {
                res.should.equal('53cb6b9b4f4ddef1ad47f943');
                done();
            })
    });

    it('failure || array :: should check if the provided variable is a mongoose ObjectId', function (done) {
        utils.validateId(['daa'])
            .catch(function (err) {
                err.code.should.equal(411);
                done();
            })
    });

    it('success || array :: should check if the provided variable is a mongoose ObjectId', function (done) {
        utils.validateId(['53cb6b9b4f4ddef1ad47f943'])
            .then(function (res) {
                res[0].should.equal('53cb6b9b4f4ddef1ad47f943');
                done();
            })
    });

    it('should test if the argument passed is an array', function () {
        var isArray = utils.isArray([]);
        isArray.should.equal(true);
    });


    it('should merge the options from both the objects', function () {
        var mergedObject = utils.merge_options({a: 'a', b: 'b'}, {b: 'c', c: 'c'});
        mergedObject.b.should.equal('c');
        mergedObject.a.should.equal('a');
        mergedObject.c.should.equal('c');
    });
});
