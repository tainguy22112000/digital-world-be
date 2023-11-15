import Joi from 'joi'

const baseSchema = {
  email: Joi.string()
    .pattern(new RegExp('gmail.com$'))
    .email()
    .lowercase()
    .required(),
  password: Joi.string().min(4).max(32).required()
}

const authSchema = {
  register: Joi.object({
    ...baseSchema,
    firstName: Joi.string().max(24).required(),
    lastName: Joi.string().max(24).required(),
    phoneNumber: Joi.string().trim().regex(/[0-9]/).max(15),
    gender: Joi.string()
      .valid('male', 'female')
      .label("Gender must be one of 'male', 'female"),
    bio: Joi.string().min(4).max(256)
  }),
  registerOtp: Joi.object({
    email: baseSchema.email,
    firstName: Joi.string().max(24).required(),
    lastName: Joi.string().max(24).required(),
    phoneNumber: Joi.string().trim().regex(/[0-9]/).max(15),
    gender: Joi.string()
      .valid('male', 'female')
      .label("Gender must be one of 'male', 'female"),
    bio: Joi.string().min(4).max(256)
  }),
  verifyOtp: Joi.object(baseSchema).append({
    otp: Joi.string().length(6).required()
  }),
  login: Joi.object({
    email: Joi.string().pattern(new RegExp('gmail.com$')).email().required(),
    password: Joi.string().min(4).max(32).required()
  })
}

export default authSchema
