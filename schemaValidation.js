const Joi = require('joi');

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required().min(6).max(30),
        description : Joi.string().required().min(15).max(100),
        price : Joi.number().min(0).required(),
        country : Joi.string().required(),
        location : Joi.string().required(),
        image : {
            url : Joi.string().allow('',null)
        }
    }).required()
})

module.exports = {listingSchema};