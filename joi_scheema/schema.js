const Joi = require('joi');
module.exports.campgroundScehma = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string(),

})

module.exports.reviewScehma = Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1)
})