const express = require('express')
const RateLimit = require('express-rate-limit')
const cors = require('cors')
const DarkSky = require('dark-sky')

const keys = require('./keys')

const app = express()

const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per windowMs
  delayMs: 0 // disable delaying
})

app.use(limiter)
app.use(cors())

const forecast = new DarkSky(keys.darksky)

app.get('/weather/json', (req, res) => {
  const lat = req.param('lat')
  const lon = req.param('lon')
  const units = req.param('units')

  forecast
    .latitude(lat)
    .longitude(lon)
    .units(units)
    .language('en')
    .exclude('minutely,hourly,flags')
    .get()
    .then(response => {
      res.send(response)
    })
    .catch(error => {
      res.send(error)
    })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
