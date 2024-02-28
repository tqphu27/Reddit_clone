const Joi = require('joi');

const userValidate = data => {
    const userSchema = Joi.object({
        // email: Joi.string().pattern(new RegExp('gmail.com$')).email().lowercase().required(),
        username:  Joi.string().min().max(32).required(),
        password: Joi.string().min(4).max(32).required()
    })
    console.log(userSchema.validate(data))
    return userSchema.validate(data);
}

module.exports = {
    userValidate
}