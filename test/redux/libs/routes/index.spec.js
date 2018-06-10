var should = require('chai').should();
var routes = require('../../../../libs/redux/libs/routes');
var redux = require('../../../../libs/redux/redux');
var model = require('../../../../libs/redux/model');
var sinon = require('sinon');
var Traces = require('../../../../libs/redux/libs/routes/trace');

describe('routes :: index', function () {
    var req, sandbox, getAllTracesStub;

    var res = {
        response: {},
        json: function (data) {
            this.response = data;
        }
    };

    before(function () {
        sandbox = sinon.createSandbox();
        getAllTracesStub = sandbox.stub(Traces, 'getAllTraces');
    });

    beforeEach(function () {
        req = {
            headers: {
                'x-access-token': ''
            },
            query : {},
            querymen: {
                query: {},
                cursor: {},
                select: {}
            },
            redux: new redux(new model, {})
        };
    });

    after(function () {
       sandbox.restore();
    });

    it('should respond with the correct data', function () {
        getAllTracesStub.returns(new Promise(function (resolve, reject) {
            resolve([])
        }));
        routes.getAllTraces(req, res);
        console.log(res);
        // res.response.code.should.equal(200);
    });
});
