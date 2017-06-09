const defaultSelect = ({ meta = {} }) => meta.report

const reporter = (handler, select = defaultSelect) => ({ getState }) => (next) => (action) => {
  const returnValue = next(action)

  if (typeof action === 'function') {
    return returnValue
  }

  const report = select(action)

  if (!report) {
    return returnValue
  }

  handler(report, getState)

  return returnValue
}

const errorSelect = ({ error = false, payload, type }) => {
  if (!error) {
    return null
  }

  if (!payload) {
    console.warn('Actions that represent errors should have an error object as payload, generic error used')
    return new Error(type)
  }

  return payload
}

export const errorReporter = (handler) => reporter(handler, errorSelect)

export const crashReporter = (handler) => ({ getState }) => (next) => (action) => {
  let returnValue

  try {
    returnValue = next(action)
  } catch (err) {
    handler(err, getState)
    console.error(err)
  }

  return returnValue
}

export default reporter
