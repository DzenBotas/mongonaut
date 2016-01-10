/*eslint max-nested-callbacks: 0, no-unused-expressions: 0 */
'use strict';
// assertion library
// /////////////////////////////////////////////////////////
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

// mock data
let configMock = {
  'user': 'tomservo',
  'pwd': 'lemur',
  'db': 'deep13',
  'collection': 'mads'
};

// modules to test
// /////////////////////////////////////////////////////////
let Mongonaut = require('../../index');
let mongonaut;

describe('Mongonaut', function () {
  beforeEach(function () {
    mongonaut = new Mongonaut(configMock);
    sinon.spy(mongonaut, 'exec');
    sinon.stub(mongonaut, 'query');
    mongonaut.query.returns('query-string');
  });

  afterEach(function () {
    mongonaut = null;
  });

  describe('instnace', function () {
    it('should apply passed object to internal config property', function () {
      mongonaut.config.user.should.eql(configMock.user);
      mongonaut.config.pwd.should.eql(configMock.pwd);
      mongonaut.config.db.should.eql(configMock.db);
      mongonaut.config.collection.should.eql(configMock.collection);
    });

    describe('#set()', function () {
      describe('when passed a property that does not exist in mongonaut.config', function () {
        it('should not apply the new property name', function () {
          mongonaut.set('foo', 'bar');
          let typeValue = typeof mongonaut.config.foo;
          typeValue.should.eql('undefined');
        });

        it('should return false if passed property does not exist in internal config', function () {
          let returnValue = mongonaut.set('foo', 'bar');
          returnValue.should.be.false;
        });
      });

      describe('when passed a valid property', function () {
        it('should update internal config key with new value', function () {
          mongonaut.set('user', 'crow');
          mongonaut.config.user.should.eql('crow');
        });

        it('should return the instance', function () {
          let returnValue = mongonaut.set('user', 'crow');
          returnValue.should.equal(mongonaut);
        });
      });
    });

    describe('#import()', function () {
      it('should return a promise', function () {
        let returnValue = mongonaut.import();
        returnValue.should.be.an.instanceOf(Promise);
      });
      it('should execute valid string', function () {
        mongonaut.import();
        mongonaut.exec.should.have.been.calledWithMatch('query-string');
      });
    });
  });
});