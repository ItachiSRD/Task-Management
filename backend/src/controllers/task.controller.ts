import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { taskService } from '../services';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

/**
 * Create a new task
 */
const createTask = catchAsync(async (req: any, res: Response) => {
  if (!req.user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');

  const { title, description, status } = req.body;
  const task = await taskService.createTask(title, description, status, req.user.id);
  res.status(httpStatus.CREATED).send(task);
});

/**
 * Get all tasks (filtered and paginated)
 */
const getTasks = catchAsync(async (req: any, res: Response) => {
  if (!req.user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');

  const filter = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await taskService.queryTasks(filter, options);
  res.send(result);
});

/**
 * Get a single task by ID
 */
const getTask = catchAsync(async (req: any, res: Response) => {
  const task = await taskService.getTaskById(Number(req.params.taskId));
  if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');

  res.send(task);
});

/**
 * Update a task (only the owner or admin can update)
 */
const updateTask = catchAsync(async (req: any, res: Response) => {
  if (!req.user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');

  const task = await taskService.getTaskById(Number(req.params.taskId));
  if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');

  if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own tasks');
  }

  const updatedTask = await taskService.updateTaskById(Number(req.params.taskId), req.body);
  res.send(updatedTask);
});

/**
 * Delete a task (only the owner or admin can delete)
 */
const deleteTask = catchAsync(async (req: any, res: Response) => {
  if (!req.user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');

  const task = await taskService.getTaskById(Number(req.params.taskId));
  if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');

  if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own tasks');
  }

  await taskService.deleteTaskById(Number(req.params.taskId));
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
