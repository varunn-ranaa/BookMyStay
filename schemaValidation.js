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

const revSchema = Joi.object({
    review  : Joi.object({
        comment : Joi.string().required(),
        rating : Joi.number().required().min(1).max(5)
     }).required()
})

const userSchemaValidation = Joi.object({
    username : Joi.string().pattern(/^[A-Za-z0-9_]+$/).required().messages({
            "string.pattern.base": "Username must contain only aplhabets,numbers and _"
        }),
    email : Joi.string().pattern(/^[A-Za-z0-9]+@[A-Za-z]+\.com$/).required(),
    password : Joi.string().min(5).required()
})

module.exports = {listingSchema, revSchema,userSchemaValidation};