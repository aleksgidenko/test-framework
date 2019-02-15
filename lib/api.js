function API () {
  var suites = [],
      suite = [],
      lvl = 0,
      init = (lvl) => {
        suite[lvl] = {}
        suite[lvl].tests = []
      },
      describe = (desc, fn) => {
        lvl++
        init(lvl)
        fn()
        var s = {
          desc: desc,
          beforeAll: suite[lvl].beforeAll,
          afterAll: suite[lvl].afterAll,
          tests: suite[lvl].tests
        }

        lvl--
        if (lvl > 0) {
          suite[lvl].tests.push(s)
        } else {
          suites.push(s)
        }
      },
      test = (desc, fn) => {
        suite[lvl].tests.push({
          desc: desc,
          func: fn
        })
      },
      beforeAll = (fn) => {
        suite[lvl].beforeAll = fn
      },
      afterAll = (fn) => {
        suite[lvl].afterAll = fn
      }

  return Object.freeze({
    suites,
    describe,
    beforeAll,
    afterAll,
    test
  })
}

module.exports = API()