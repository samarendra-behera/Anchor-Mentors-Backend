const signup = (req, res, next) => {
    res.json({
        status: 'success',
        'message': 'Signup route is working'
    });
};


module.exports = {signup};