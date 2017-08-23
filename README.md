## Promise/A+ 简单实现

参考[promise/a+规范](http://www.ituring.com.cn/article/66566)  
[Basic Javascript promise implementation attempt](https://stackoverflow.com/questions/23772801/basic-javascript-promise-implementation-attempt/23785244#23785244)

```javascript
const PENDING = Symbol()
const FULFILLED = Symbol()
const REJECTED = Symbol()

export default class Aromise {
  constructor(resolver) {
    if (typeof this !== 'object') {
      throw new Error('Promises must be constructed via new')
    }
    if (typeof resolver !== 'function') {
      throw new Error('resolver must be a function')
    }
    this.status = PENDING
    this.value = null
    this.handlers = []
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    this.handle = this.handle.bind(this)
    resolver(this.resolve, this.reject)
  }

  reject(error) {
    this.status = REJECTED
    this.value = error
    this.handlers.forEach(this.handle)
    this.handlers = []
  }

  resolve(result) {
    try {
      let then  = typeof result.then == 'function' ? result.then : null
      if (then) {
        this.then.call(result, this.resolve, this.reject)
        return
      }
      this.status = FULFILLED
      this.value = result
      this.handlers.forEach(this.handle)
      this.handlers = []
    } catch (error) {
      this.reject(error) 
    }
  }

  handle({onFulfill, onReject}) {
    switch(this.status) {
      case FULFILLED:
        onFulfill && onFulfill(this.value)
        break
      case REJECTED:
        onReject && onReject(this.value)
        break
      case PENDING:
        this.handlers.push({onFulfill, onReject})
    }
  }

  then(onFulfilled, onRejected) {
    return new Aromise((resolve, reject) => {
      this.handle({
        onFulfill: (value) => {
          if (typeof onFulfilled === 'function') {
            try {
              resolve(onFulfilled(value))
            } catch (error) {
              reject(error)
            }
          } else {
            resolve(value)
          }
        }, 
        onReject: (error) => {
          if (typeof onRejected === 'function') {
            reject(onRejected(error))
          } else {
            reject(error)
          }
        }
     })
    })
  }
}
```

test

```javascript
const Aromise = require('../lib/Aromise.js')

function sleep(second) {
  return new Aromise((resolve, reject) => {
    setTimeout(() => resolve(second), second * 1000);
  })
}

new Aromise((resolve, reject) => {
  resolve('hello')
}).then((val) => {
  console.log(val)
  return sleep(3)
}).then(() => {
  return 'world'
}).then((val) => {
  console.log(val)
  return sleep(2)
}).then(() => {
  console.log('end')
})
```