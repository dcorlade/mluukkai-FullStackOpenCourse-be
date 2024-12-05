const dummy = () => {
  return 1
}

const totalLikes  = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  const likes = blogs.map(blog => blog.likes)
  return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((max, blog) => {
    return (blog.likes > max.likes) ? blog : max
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}