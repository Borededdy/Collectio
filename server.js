const express = require("express")
const app = express()
const bcrypt = require('bcrypt')

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    try {
        const hashedPsw = await bcrypt.hash(req.body.psw, 10)
        users.push({
            id: Date.now().toString(),
            usr: req.body.usr,
            psw: hashedPsw
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.post('/login', (req, res) => {
    req.body.usr
    req.body.psw
})

app.listen(5050)