require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('postData', (req, res) => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      const time = new Date()
      response.send(`<p>Phonebool has info for ${persons.length} people<p><p>${time}<p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  let error = ""
  if (!body) {
    error = "content missing"
  }
  else if (!body.name) {
    error = "name missing"
  }
  else if (!body.number) {
    error = "number missing"
  }
  /*else if (notes.persons.some(n => n.name === body.name)) {
    error = "name must be unique"
  }*/
  if (error) {
    return response.status(400).json({ error: error })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
