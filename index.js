function TestFramework() {
  var api = require('./lib/api'),
      runner = require('./lib/runner')

  return Object.freeze({
    api,
    runner
  })
}

module.exports = TestFramework()