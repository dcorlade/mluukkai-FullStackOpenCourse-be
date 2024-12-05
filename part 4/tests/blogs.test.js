const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned', async () => {
  const response = await helper.blogsInDb()

  assert.strictEqual(response.length, helper.initialBlogs.length)
})

test('unique id is defined', async () => {
  const response = await api.get('/api/blogs')
  const receivedBlog = response.body[0]
  assert(receivedBlog.id !== undefined)
})

test('adding one note matches length', async () => {
  await api
    .post('/api/blogs')
    .send(helper.oneBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => {
    console.log(n.title)
    return n.title
  })
  assert(contents.includes('Weird name'))
})

after(async () => {
  await mongoose.connection.close()
})