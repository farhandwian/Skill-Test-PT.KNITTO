import Joi from "joi";

export default Joi.object({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(30).required(),
  price: Joi.number().precision(2).required(),
  quantity: Joi.number().required(),
  color: Joi.string().alphanum().min(3).max(30).required(),
  meta: Joi.object().pattern(Joi.string(), Joi.string().max(100)),
});
