require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => response.json(persons))
})

app.get('/info', (request, response) => {
  const d = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Bucharest"})); // timezone ex: Asia/Jerusalem
  const date = `<p>${d}</p>`
  const personsLen = `<p>Phonebook has info for ${persons.length} people</p>`
  const res = `<div>${personsLen}${date}</div>`
  response.send(res)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => response.json(person))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name:body.name,
    number:body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// Completed exercise 3.9
const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
