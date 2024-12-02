const app = require('./app') // The Express app
const config = require('./utils/config')
const logger = require('./utils/logger')

// Completed exercise 3.9
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
