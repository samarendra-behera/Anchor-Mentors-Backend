const express = require('express')

const authRouter = require('./route/authRoute')

const app = express()


app.get('/', (req, res)=> {
    res.status(200).json({
        status: 'success',
        message: 'Wahoo! REST APIs are working',
    });
});


// all routes will be here
app.use('/api/v1/auth', authRouter)

app.listen(5000, ()=> {
    console.log('Server up and running')
})