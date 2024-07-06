const path = require('path');
const express = require('express');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');

const globalErrorHandler = require('./controller/errorController');
const authRouter = require('./route/authRoute');
const mentorRouter = require('./route/mentorRoute');

const app = express()

app.use(express.json())

// Serve the uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.get('/', (req, res)=> {
    res.status(200).json({
        status: 'success',
        message: 'Wahoo! REST APIs are working',
    });
});


// all routes will be here
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/mentor', mentorRouter)


app.use('*', catchAsync(async(req, res, next )=> {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
}));

app.use(globalErrorHandler);

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running on port', process.env.APP_PORT);
});