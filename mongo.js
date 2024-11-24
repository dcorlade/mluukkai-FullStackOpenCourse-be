require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI;
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}
else {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3],
      })
      
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}

module.exports = mongoose.model('Person', personSchema)
