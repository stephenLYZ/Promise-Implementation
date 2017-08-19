const PENDING = Symbol()
const FULFILLED = Symbol()
const REJECTED = Symbol()

export default class Aromise {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('resolver should be a function')
    }
    this.state = PENDING
    this.value = null
    this.handlers = []
  }
}