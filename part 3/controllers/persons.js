const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personsRouter.get('/info', (request, response, next) => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Bucharest' })) // timezone ex: Asia/Jerusalem
  const date = `<p>${d}</p>`
  Person.countDocuments({}).then(count => {
    const personsLen = `<p>Phonebook has info for ${count} people</p>`
    const res = `<div>${personsLen}${date}</div>`
    response.send(res)
  }).catch(error => next(error))
})

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name:body.name,
    number:body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

module.exports = personsRouter