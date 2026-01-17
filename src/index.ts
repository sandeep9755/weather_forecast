import Express from 'express'
import bodyParser from 'body-parser'
import router from './controllers/Router'
import knexInstance from './infra/init'
import dotenv from 'dotenv'

dotenv.config()
const app = Express()
const port = 4500

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('db', knexInstance)
app.use('/api', router)

app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING')
})



app.listen(port, () => console.log("App listening on port:" + port))