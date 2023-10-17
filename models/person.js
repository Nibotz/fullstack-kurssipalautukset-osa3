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
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: v => {
        return /^\d{2,3}-\d{5,}$/.test(v)
      },
      message: ({ value }) => `invalid phone number: ${value}`
    },
  },
})
personSchema.set('toJSON', {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)