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