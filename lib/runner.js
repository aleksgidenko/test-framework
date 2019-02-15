function Runner (opts) {
  var { suites } = opts,
      steps = [],
      idx = -1,
      lvl = 0,
      curLvl = 1,
      curSuite = '',
      init = () => {
        suites.forEach((s) => {
          flatten(s)
        })
        // console.dir(steps, { depth: undefined })
      },
      flatten = (s) => {
        lvl++
        if (s.beforeAll) {
          steps.push({
            level: lvl,
            suite: s.desc,
            desc: 'beforeAll',
            func: s.beforeAll
          })
        }
        s.tests.forEach(async (t) => {
          if (t.tests) {
            flatten(t)
          } else {
            steps.push({
              level: lvl,
              suite: s.desc,
              desc: t.desc,
              func: t.func
            })
          }
        })
        if (s.afterAll) {
          steps.push({
            level: lvl,
            suite: s.desc,
            desc: 'afterAll',
            func: s.afterAll
          })
        }
        lvl--
      },
      pad = (lvl)  => {
        return ' '.repeat(4 * lvl)
      },
      executeStep = async (s) => {
        if (curSuite !== s.suite) {
          if (s.level >= curLvl) {
            console.log(pad(s.level-1) + 'Suite: ' + s.suite)
          } 
        }
        curLvl = s.level
        curSuite = s.suite
        console.log(pad(curLvl) + s.desc)
        await s.func()
      },
      back = async () => {
        if (idx > 0) {
          idx--
          try {
            await executeStep(steps[idx])
            return true
          } catch (err) {
            console.log(err)
          }
        }
      },
      step = async () => {
        if (idx < (steps.length-1)) {
          idx++
          try {
            await executeStep(steps[idx])
            return true
          } catch (err) {
            console.log(err)
          }
        }
      },
      repeat = async () => {
        try {
          await executeStep(steps[idx])
          return true
        } catch (err) {
          console.log(err)
        }
      },
      run = async () => {
        if (idx < steps.length) {
          var success = await step()
          if (success) setTimeout(run, 50)
        }
      }
  
  // initialize
  init()

  return Object.freeze({
    run,
    step,
    back,
    repeat
  })
}

module.exports = Runner