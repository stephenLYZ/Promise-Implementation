const Aromise = require('../lib/Aromise.js')

function sleep(sec) {
  return new Aromise((resolve, reject) => {
    setTimeout(() => resolve(sec), sec * 1000);
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

