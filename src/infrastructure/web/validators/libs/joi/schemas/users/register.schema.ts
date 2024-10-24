import Joi from "joi";

export default Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  meta: Joi.object().pattern(Joi.string(), Joi.string().max(100)).optional(),
});
