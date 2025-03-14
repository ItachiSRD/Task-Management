import Joi from 'joi';

const createTask = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().allow('').optional(),
    status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE').optional(),
  }),
};

const updateTask = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(255).optional(),
    description: Joi.string().allow('').optional(),
    status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE').optional(),
  }),
};

const taskIdParam = {
  params: Joi.object().keys({
    taskId: Joi.number().integer().positive().required(),
  }),
};

export default {
  createTask,
  updateTask,
  taskIdParam,
};
