const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL
console.log('connecting to database');
mongoose.connect(url)
  .then(response => {
    console.log('succeeded to connect database');
  })
  .catch(error => {
    console.log('failed to connect database', error.message);
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set('toJSON', {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)