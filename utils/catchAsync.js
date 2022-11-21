module.exports = func => {
    return (req, res, next) => {
        //catch error and pass error to next action which is express middleware app.use((err, req, res, next))
        func(req, res, next).catch(e => next(e));
    }
}