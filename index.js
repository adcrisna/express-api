const express = require('express')
const app = express()
const port = 3000
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})