require('dotenv').config({ path: `${process.cwd()}/.env` })
const express = require('express')

const catchAsync = require('./utils/catchAsync')
const AppError = require('./utils/appError')

const authRouter = require('./route/authRoute')

const app = express()

app.use(express.json())


app.get('/', (req, res)=> {
    res.status(200).json({
        status: 'success',
        message: 'Wahoo! REST APIs are working',
    });
});


// all routes will be here
app.use('/api/v1/auth', authRouter)


app.use('*', catchAsync(async(req, res, next )=> {
    throw new AppError('This an error ', 400);
    res.status(404).json({
        status: 'fail',
        message: 'Route not found'
    });
}));

app.use((err, req, res, next)=> {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack
    });
});

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running on port', process.env.APP_PORT);
});