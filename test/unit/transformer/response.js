import { Request, Response } from '@scola/http';
import { Worker } from '@scola/worker';
import chai from 'chai';

import ResponseTransformer from '../../../src/transformer/response';

describe('@scola/http/ResponseTransformer', () => {
  it('should merge with proper arguments', (done) => {
    const extraBox = { name: 'extrabox' };
    const extraData = { name: 'extradata' };
    const extraCallback = chai.spy(() => {});

    const testData = { name: 'testdata' };
    const testCallback = () => {};

    const testResponse = new Response({
      request: new Request({
        extra: {
          box: extraBox,
          callback: extraCallback,
          data: extraData
        }
      }),
      status: 200
    });

    const worker = new Worker();

    const transformer = new ResponseTransformer({
      merge(box, data, responseData, response) {
        try {
          chai.expect(box).to.equal(extraBox);
          chai.expect(data).to.equal(extraData);
          chai.expect(responseData).to.equal(testData);
          chai.expect(response).to.equal(testResponse);
          done();
        } catch (catchError) {
          done(catchError);
        }
      }
    });

    transformer.connect(worker);
    transformer.act(testResponse, testData, testCallback);
  });

  it('should pass with proper arguments', (done) => {
    const extraBox = { name: 'extrabox' };
    const extraData = { name: 'extradata' };
    const extraCallback = chai.spy(() => {});

    const testData = { name: 'testdata' };
    const testCallback = () => {};

    const testResponse = new Response({
      request: new Request({
        extra: {
          box: extraBox,
          callback: extraCallback,
          data: extraData
        }
      }),
      status: 200
    });

    const worker = new Worker({
      act(box, data, callback) {
        try {
          chai.expect(box).to.equal(extraBox);
          chai.expect(data).to.equal(testData);
          chai.expect(callback).to.equal(testCallback);
          chai.expect(extraCallback).to.have.been.called();
          done();
        } catch (error) {
          done(error);
        }
      }
    });

    const transformer = new ResponseTransformer();

    transformer.connect(worker);
    transformer.act(testResponse, testData, testCallback);
  });

  it('should fail when response status >= 400', (done) => {
    const extraBox = { name: 'extrabox' };
    const extraData = { name: 'extradata' };
    const extraCallback = chai.spy(() => {});

    const testData = {
      error: {
        message: 'Error message',
        field: 'Error field',
        reason: 'Error reason'
      }
    };

    const testCallback = () => {};

    const testResponse = new Response({
      request: new Request({
        extra: {
          box: extraBox,
          callback: extraCallback,
          data: extraData
        }
      }),
      status: 400
    });

    const worker = new Worker({
      err(box, error, callback) {
        try {
          chai.expect(box).to.equal(extraBox);
          chai.expect(box.error).to.equal(true);
          chai.expect(error.data).to.equal(extraData);
          chai.expect(error.responseData).to.equal(testData);
          chai.expect(error.message).to.equal('400 Error message');
          chai.expect(error.field).to.equal('Error field');
          chai.expect(error.reason).to.equal('Error reason');
          chai.expect(callback).to.equal(testCallback);
          chai.expect(extraCallback).to.have.been.called();
          done();
        } catch (catchError) {
          done(catchError);
        }
      }
    });

    const transformer = new ResponseTransformer();

    transformer.connect(worker);
    transformer.act(testResponse, testData, testCallback);
  });

  it('should fail when merge throws error', (done) => {
    const extraBox = { name: 'extrabox' };
    const extraData = { name: 'extradata' };
    const extraCallback = chai.spy(() => {});

    const testData = { name: 'testdata' };
    const testCallback = () => {};

    const testResponse = new Response({
      request: new Request({
        extra: {
          box: extraBox,
          callback: extraCallback,
          data: extraData
        }
      }),
      status: 200
    });

    const worker = new Worker({
      err(box, error, callback) {
        try {
          chai.expect(box).to.equal(extraBox);
          chai.expect(box.error).to.equal(true);
          chai.expect(error.data).to.equal(extraData);
          chai.expect(error.responseData).to.equal(testData);
          chai.expect(error.message).to.equal('Merge conflict');
          chai.expect(callback).to.equal(testCallback);
          chai.expect(extraCallback).to.have.been.called();
          done();
        } catch (catchError) {
          done(catchError);
        }
      }
    });

    const transformer = new ResponseTransformer({
      merge() {
        throw new Error('Merge conflict');
      }
    });

    transformer.connect(worker);
    transformer.act(testResponse, testData, testCallback);
  });

  it('should fail when callback throws error', (done) => {
    const extraBox = { name: 'extrabox' };
    const extraData = { name: 'extradata' };
    const extraCallback = chai.spy(() => {
      throw new Error('Callback error');
    });

    const testData = { name: 'testdata' };
    const testCallback = () => {};

    const testResponse = new Response({
      request: new Request({
        extra: {
          box: extraBox,
          callback: extraCallback,
          data: extraData
        }
      }),
      status: 200
    });

    const worker = new Worker({
      err(box, error, callback) {
        try {
          chai.expect(box).to.equal(extraBox);
          chai.expect(box.error).to.equal(true);
          chai.expect(error.data).to.equal(extraData);
          chai.expect(error.responseData).to.equal(testData);
          chai.expect(error.message).to.equal('Callback error');
          chai.expect(callback).to.equal(testCallback);
          chai.expect(extraCallback).to.have.been.called();
          done();
        } catch (catchError) {
          done(catchError);
        }
      }
    });

    const transformer = new ResponseTransformer();

    transformer.connect(worker);
    transformer.act(testResponse, testData, testCallback);
  });

  it('should fail when in error flow', (done) => {
    const extraBox = { name: 'extrabox' };
    const extraData = { name: 'extradata' };
    const extraCallback = chai.spy(() => {});

    const testError = new Error('Test message');
    const testCallback = () => {};

    const testResponse = new Response({
      request: new Request({
        extra: {
          box: extraBox,
          callback: extraCallback,
          data: extraData
        }
      }),
      status: 200
    });

    const worker = new Worker({
      err(box, error, callback) {
        try {
          chai.expect(box).to.equal(extraBox);
          chai.expect(box.error).to.equal(true);
          chai.expect(error.data).to.equal(extraData);
          chai.expect(error.responseData).to.equal(null);
          chai.expect(error.message).to.equal('Test message');
          chai.expect(callback).to.equal(testCallback);
          chai.expect(extraCallback).to.have.been.called();
          done();
        } catch (catchError) {
          done(catchError);
        }
      }
    });

    const transformer = new ResponseTransformer();

    transformer.connect(worker);
    transformer.err(testResponse, testError, testCallback);
  });

  it('should fail when callback throws error in error flow', (done) => {
    const extraBox = { name: 'extrabox' };
    const extraData = { name: 'extradata' };
    const extraCallback = chai.spy(() => {
      throw new Error('Callback error');
    });

    const testError = new Error('Test message');
    const testCallback = () => {};

    const testResponse = new Response({
      request: new Request({
        extra: {
          box: extraBox,
          callback: extraCallback,
          data: extraData
        }
      }),
      status: 200
    });

    const worker = new Worker({
      err(box, error, callback) {
        try {
          chai.expect(box).to.equal(extraBox);
          chai.expect(box.error).to.equal(true);
          chai.expect(error.data).to.equal(extraData);
          chai.expect(error.responseData).to.equal(null);
          chai.expect(error.message).to.equal('Callback error');
          chai.expect(callback).to.equal(testCallback);
          chai.expect(extraCallback).to.have.been.called();
          done();
        } catch (catchError) {
          done(catchError);
        }
      }
    });

    const transformer = new ResponseTransformer();

    transformer.connect(worker);
    transformer.err(testResponse, testError, testCallback);
  });
});
