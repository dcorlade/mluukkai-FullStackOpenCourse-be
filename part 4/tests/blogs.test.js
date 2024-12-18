const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

let token

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)

  const user = await User.findOne({ username: 'root' })
  token = jwt.sign({ id: user._id }, process.env.SECRET)
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

test('adding one blog matches length', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(helper.oneBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  assert(contents.includes('Weird name'))
})

test('likes are defaulted to zero', async () => {
  const blogToAdd = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogToAdd)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const receivedBlog = blogsAtEnd[blogsAtEnd.length - 1]
  assert.strictEqual(0, receivedBlog.likes)
})

test('title or url missing results in bad request', async () => {
  const blogToAddWithoutTitle = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  }
  const blogToAddWithoutUrl = {
    title: 'Random title',
    author: 'Robert C. Martin',
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogToAddWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogToAddWithoutUrl)
    .expect(400)
})

test('blog can\'t be added if token is invalid or missing', async () => {
  const blogToAdd = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  }

  await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})