import React from 'react';
import { mount } from 'enzyme';

import throttleHandler from '../src/';

const Target = () => null;

describe('throttleHandler', () => {
  it('should pass handler arguments through', (done) => {
    const EnhancedTarget = throttleHandler('testHandler')(Target);
    const mockTestHandler = jest.fn();
    const wrapper = mount(
      <EnhancedTarget testHandler={mockTestHandler}/>
    );
    const testHandler = wrapper.find(Target).prop('testHandler');

    testHandler('a', 'b', 'c');
    setTimeout(() => {
      expect(mockTestHandler.mock.calls).toMatchSnapshot();
      done();
    });
  });

  it('should call `e.persist()` if it has been passed', (done) => {
    const EnhancedTarget = throttleHandler('testHandler')(Target);
    const mockTestHandler = jest.fn();
    const mockPersist = jest.fn();
    const wrapper = mount(
      <EnhancedTarget testHandler={mockTestHandler}/>
    );
    const testHandler = wrapper.find(Target).prop('testHandler');

    testHandler({ persist: mockPersist });
    setTimeout(() => {
      expect(mockTestHandler.mock.calls).toMatchSnapshot();
      expect(mockPersist.mock.calls).toMatchSnapshot();
      done();
    }, 0);
  });

  it('should throttle handler with `interval` option', (done) => {
    const EnhancedTarget = throttleHandler('testHandler', 50)(Target);
    const mockTestHandler = jest.fn();
    const wrapper = mount(
      <EnhancedTarget testHandler={mockTestHandler}/>
    );
    const testHandler = wrapper.find(Target).prop('testHandler');

    testHandler('a');

    setTimeout(() => {
      testHandler('b');

      setTimeout(() => {
        testHandler('c');

        setTimeout(() => {
          testHandler('d');

          setTimeout(() => {
            testHandler('e');

            setTimeout(() => {
              testHandler('f');

              setTimeout(() => {
                expect(mockTestHandler.mock.calls).toMatchSnapshot();
                done();
              }, 50);
            }, 50);
          }, 20);
        }, 20);
      }, 20);
    }, 20);
  });

  it('should throttle handler with `leadingCall` option', (done) => {
    const EnhancedTarget = throttleHandler('testHandler', 50, true)(Target);
    const mockTestHandler = jest.fn();
    const wrapper = mount(
      <EnhancedTarget testHandler={mockTestHandler}/>
    );
    const testHandler = wrapper.find(Target).prop('testHandler');

    testHandler('a');

    setTimeout(() => {
      testHandler('b');

      setTimeout(() => {
        testHandler('c');

        setTimeout(() => {
          testHandler('d');

          setTimeout(() => {
            testHandler('e');

            setTimeout(() => {
              testHandler('f');

              setTimeout(() => {
                expect(mockTestHandler.mock.calls).toMatchSnapshot();
                done();
              }, 50);
            }, 50);
          }, 20);
        }, 20);
      }, 20);
    }, 20);
  });

  describe('display name', () => {
    const origNodeEnv = process.env.NODE_ENV;

    afterAll(() => {
      process.env.NODE_ENV = origNodeEnv;
    });

    it('should wrap display name in non-production env', () => {
      process.env.NODE_ENV = 'test';

      const EnhancedTarget = throttleHandler()(Target);
      const wrapper = mount(
        <EnhancedTarget/>
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('should not wrap display name in production env', () => {
      process.env.NODE_ENV = 'production';

      const EnhancedTarget = throttleHandler()(Target);
      const wrapper = mount(
        <EnhancedTarget/>
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
