import { Task, Prisma, Status } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

/**
 * Create a task
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 */
const createTask = async (
  title: string,
  description: string,
  status: Status = Status.TODO,
  userId: number
): Promise<Task> => {
  return prisma.task.create({
    data: {
      title,
      description,
      status,
      userId
    }
  });
};

/**
 * Query for tasks
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<Task[]>}
 */
const queryTasks = async <Key extends keyof Task>(
  filter: object,
  options: { limit?: number; page?: number; sortBy?: string; sortType?: 'asc' | 'desc' },
  keys: Key[] = ['id', 'title', 'description', 'status', 'userId', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Task, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';

  const tasks = await prisma.task.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  }) 
  return tasks as Pick<Task, Key>[];
};

/**
 * Get task by id
 * @param {number} id
 * @param {Array<Key>} keys
 * @returns {Promise<Task | null>}
 */
const getTaskById = async <Key extends keyof Task>(
  id: number,
  keys: Key[] = ['id', 'title', 'description', 'status', 'userId', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<Task, Key> | null> => {
  return prisma.task.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Task, Key> | null>;
};

/**
 * Update task by id
 * @param {number} taskId
 * @param {Object} updateBody
 * @returns {Promise<Task>}
 */
const updateTaskById = async <Key extends keyof Task>(
  taskId: number,
  updateBody: Prisma.TaskUpdateInput,
  keys: Key[] = ['id', 'title', 'description', 'status', 'updatedAt'] as Key[]
): Promise<Pick<Task, Key> | null> => {
  const task = await getTaskById(taskId, ['id']);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  const updateTask = await prisma.task.update({
    where: { id: task.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) 
  return updateTask as Pick<Task, Key> | null;
};

/**
 * Delete task by id
 * @param {number} taskId
 * @returns {Promise<Task>}
 */
const deleteTaskById = async (taskId: number): Promise<Task> => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  return prisma.task.delete({ where: { id: task.id } });
};

export default {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById
};
