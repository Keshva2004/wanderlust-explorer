const joi = require("joi");
module.exports =  joi.object({
    listing : joi.object({
             title : joi.string().required(),
             description : joi.string().required(),
             location : joi.string().required(),
             country : joi.string().required(),
             price : joi.number().required().min(0),
            categories: joi.string().valid(
            "Trending", 
            "Rooms", 
            "Iconic Cities", 
            "Mountains", 
            "Castles", 
            "Amazing pools", 
            "Camping", 
            "Farms", 
            "Arctic", 
            "Play", 
            "Boats"
        ).required(),
             image: joi.object({
             url: joi.string().uri().optional() // allow empty or valid URL
        }).optional().unknown(true)
             
    }).required()
});

