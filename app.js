const express = require('express')

const app = express()


app.get('/', (req, res)=> {
    res.status(200).json({
        status: 'success',
        message: 'Woohoo! REST APIs are working',
    });
});


app.listen(5000, ()=> {
    console.log('Server up and running')
})