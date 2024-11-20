const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

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
  response.json(persons)
})

app.get('/info', (request, response) => {
  const d = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Bucharest"})); // timezone ex: Asia/Jerusalem
  const date = `<p>${d}</p>`
  const personsLen = `<p>Phonebook has info for ${persons.length} people</p>`
  const res = `<div>${personsLen}${date}</div>`
  response.send(res)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

function generateId(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return String(Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)); // The maximum is exclusive and the minimum is inclusive
}
app.post('/api/persons/', (request, response) => {
  const body = request.body

  const doesPersonExist = persons.find(person => person.name === body.name)

  if (!body.name || !body.number || doesPersonExist) {
    return response.status(400).json({
      error: 'Either person already exists or name or number missing'
    })
  }

  const person = { 
    "id": generateId(0, 1000000),
    "name": body.name, 
    "number": body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
