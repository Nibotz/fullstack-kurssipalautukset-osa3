const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('postData', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


let notes = {
  "persons": [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]
}


app.get('/api/persons', (request, response) => {
  response.json(notes.persons)
})

app.get('/info', (request, response) => {
  const peopleCount = notes.persons.length
  const time = new Date()
  response.send(`<p>Phonebool has info for ${peopleCount} people<p><p>${time}<p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.persons.find(n => n.id === id)

  if (!note) {
    response.status(404).end()
  } else {
    response.json(note)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  notes.persons = notes.persons.filter(n => n.id !== id)
  
  response.status(204).end()
})

const generateId = () => Math.floor(Math.random() * 1_000_000)

app.post('/api/persons', (request, response) => {
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
  else if (notes.persons.some(n => n.name === body.name)) {
    error = "name must be unique"
  }
  if (error) {
    return response.status(400).json({ error: error })
  }

  const person = {
    ...body,
    id: generateId(),
  }
  notes.persons.push(person)

  response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
