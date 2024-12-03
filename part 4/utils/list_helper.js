const dummy = (blogs) => {
  return 1
}

const totalLikes  = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  const likes = blogs.map(blog => blog.likes)
  return likes.reduce(reducer, 0)
}
  
module.exports = {
    dummy, totalLikes
}