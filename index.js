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
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
  })

  app.get('/info', (req, res) => {
    const requestTime = new Date();
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${requestTime}</p>
    `);
  });

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(203).end()
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }

  app.post('/api/persons', (req, res) => {
    const person = req.body

    if (!person.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }

    if (!person.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }

    const existingPerson = persons.find(p => p.name === person.name)
    if (existingPerson) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    person.id = generateId

    persons = persons.concat(person)  

    res.json(person)

  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })