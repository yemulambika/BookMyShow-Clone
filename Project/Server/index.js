// Import the Express framework, which is used to create a web server and handle HTTP requests
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

// Import the database configuration file that contains connection logic
const dbConfig = require('./dbConfig.js')
// Import the dotenv package to load environment variables from a .env file
const dotEnv = require('dotenv')
const logger = require('./utils/logger.js')

// Load the environment variables from the .env file into process.env
dotEnv.config()

// Create an instance of an Express application
const app = express()

// Establish the database connection (fails fast if it cannot connect)
dbConfig.connectDb()

// Import route modules
const userRoutes = require('./routes/user.route.js')
const movieRoutes = require('./routes/movie.route.js')
const theatreRoutes = require('./routes/theatre.route.js')
const showRoutes = require('./routes/show.routes.js')
const bookingRoutes = require('./routes/booking.route.js')

// Security headers
app.use(helmet())

// CORS: restrict to an allowlist of client origins (comma separated CLIENT_URL).
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (no origin) and any allowlisted origin.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true,
  })
)

app.use(cookieParser())

// Parse incoming JSON request bodies
app.use(express.json())

// Lightweight request logging
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`)
  })
  next()
})

// Global rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})

// Stricter limiter for auth endpoints to slow down brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
})

app.use('/api', apiLimiter)

// Health check
app.get('/health', (req, res) => res.json({ success: true, status: 'ok' }))

// Mount routes
app.use('/api/auth', authLimiter, userRoutes)
app.use('/api/movie', movieRoutes)
app.use('/api/theatre', theatreRoutes)
app.use('/api/shows', showRoutes)
app.use('/api/booking', bookingRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// Start the server
const PORT = process.env.PORT || 8001
app.listen(PORT, () => {
  logger.info(`Server Started on port ${PORT}`)
})
