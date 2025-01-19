const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type:String,
    required: true
  },
  author: {
    type:String,
    required: true
  },
  url: {
    type:String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

blogSchema.pre('findOneAndDelete', async function(next) {
  const blog = await this.model.findOne(this.getQuery())
  if (blog) {
    await mongoose.model('User').updateOne(
      { _id: blog.user },
      { $pull: { blogs: blog._id } }
    )
  }
  next()
})

module.exports = mongoose.model('Blog', blogSchema)
