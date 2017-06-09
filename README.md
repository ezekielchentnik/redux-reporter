# redux-reporter

[![npm version](https://img.shields.io/npm/v/redux-reporter.svg?style=flat-square)](https://www.npmjs.com/package/redux-reporter)

Redux middleware for reporting actions to third party APIs.  This package is extremely useful for analytics and error handling.  Can be used with various APIs such as New Relic, Sentry, Adobe DTM, Keen

## Installation

```js
npm install --save redux-reporter
```
## Usage

### General Reporting
Create your reporting middleware
```js
// /middleware/myReporter.js
import reporter from 'redux-reporter';

export default reporter(({ type, payload }, getState) => {

    try {
        // report to external API
    } catch (err) {}

});
```
Attach meta data to your actions
```js
// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ACTION';
    return {
        type,
        meta: {
            report: {  // default attribute that is selected by redux-reporter
                type,
                payload: 'example payload'
            }
        }
    };
}

```
Configure store with your middleware
```js
// /store/configureStore.js
import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import myReporter from './middleware/myReporter';  // import your reporter

const isBrowser = (typeof window !== 'undefined');
const enhancer = compose(
    applyMiddleware(...[thunk, myReporter]),
    isBrowser && window.devToolsExtension) ? window.devToolsExtension() : (f) => f
);

export default (initialState = {}) => {
  return createStore(rootReducer, initialState, enhancer);
}

```
Reporting to Multiple APIs:
You can report to multiple APIs by configuring multiple middlewares and attaching additional attributes to your actions
```js

// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ACTION';
    return {
        type,
        meta: {
          analytics: {
              type,
              payload: 'example payload'
          },
          experiments: {
              type,
              payload: 'example payload'
          }
        }
    };
}

```


## Example w/ [New Relic](https://newrelic.com/)

### error reporting

```js
// /middleware/newrelic.js
import { errorReporter as newrelicErrorReporter, crashReporter as newrelicCrashReporter } from 'redux-reporter';

const report = (error) => {
  try {
    window.newrelic.noticeError(error);
  } catch (err) {}
};

export const crashReporter = newrelicCrashReporter(report);
export const errorReporter = newrelicErrorReporter(report);

// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ERROR_ACTION';
    return {
        type,
        error: true
        payload: new Error('My Handled Error')
    };
}
```

### User behavior (New Relic browser/insights)

```js
// /middleware/newrelic.js
import reporter from 'redux-reporter';

export const analyticsReporter = reporter(({ type, payload }) => {
  try {
    window.newrelic.addPageAction(type, payload);
  } catch (err) {}
}, ({ meta = {} }) => meta.analytics);

// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ACTION';
    return {
        type,
        meta: {
          analytics: {
              type,
              payload: 'example payload'
          }
        }
    };
}
```
