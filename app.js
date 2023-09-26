const express = require ('express')
const dotEnv = require ('dotenv')
dotEnv.config()
const dbConnect = require('./dbConnect')
const user = require ('./user')
const bcrypt = require ('bcrypt')
const expressSession = require ('express-session')

const port = process.env.PORT || 3000
const session_secret = process.env.SESSION_SECRET

const app = express()

// express session configuration
app.use(expressSession({
    secret : session_secret,
    resave : false,
    saveUninitialized : true,
    cookie : {}
}))

// fetching the data from form submission
app.use(express.urlencoded({extended:false}))

app.get('/', (req , res)=>{
    res.send('hello')
})

app.post ('/register', async (req, res)=>{
    // accepting user input
    try{
    const {user_name, password} = req.body
    // hashing password
    const hashPassword = await bcrypt.hash(password, 10)
   const result = await user.create({user_name, 'password':hashPassword})
   if(result)
    return res.send('user created successfully')

   res.send('unable to create user')
    }catch(error){
        res.send ('unable to handle request currently, please try again')
    }
})

app.post('/login',async(req, res)=>{
    try {
    const {user_name, password} = req.body
// determine if data is available based on username
    const results = await user.findOne({where:{'user_name':user_name}})
    if(!results)
    return res.send('invalid credentials, try again')

    const userCorrectPassword = results.password
    // compare the hash password to the current password
    const isPasswordCorrect = await bcrypt.compare(password, userCorrectPassword)
    if(!isPasswordCorrect)
    return res.send('invalid credentials, try again')

    req.session.user = results.id
    res.send('Login successfully !!')
    }catch(error){
        res.send ('unable to handle request currently, please try again')
    }
})

const isUserAuthenticated = (req, res, next)=>{
    if(req.session.user)
    return next()

    res.send('please Login First')
}

app.get('/home-page',isUserAuthenticated,async (req, res)=>{
    try{
        const userID = req.session.user
        const userInfo = await user.findOne({where :{id: userID}})
        res.send(`welcome ${userInfo.user_name}`)
    }catch(error){
        res.send('unable to handle request')
    }
})


app.listen(port, ()=>{
    dbConnect.authenticate()
    console.log(`server connected on http://localhost:${port}`)
})

