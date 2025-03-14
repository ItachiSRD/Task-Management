import express from 'express';
import {taskController} from '../../controllers';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import {taskValidation} from '../../validations';

const router = express.Router();

router.post('/', auth('Task'), validate(taskValidation.createTask), taskController.createTask);
router.get('/', auth('Task'), taskController.getTasks);
router.get('/:taskId', auth('Task'), validate(taskValidation.taskIdParam), taskController.getTask);
router.put('/:taskId', auth('Task'), validate(taskValidation.taskIdParam), validate(taskValidation.updateTask), taskController.updateTask);
router.delete('/:taskId', auth('Task'), validate(taskValidation.taskIdParam), taskController.deleteTask);

export default router;

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and retrieval
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     description: Only authenticated users can create tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Finish React project"
 *               description:
 *                 type: string
 *                 example: "Complete the frontend for the task management app"
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *                 example: "TODO"
 *     responses:
 *       "201":
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Task'
 *       "400":
 *         description: Bad request
 *       "401":
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all tasks
 *     description: Retrieves all tasks for the logged-in user. Admins can view all tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a task by ID
 *     description: Retrieves a task by its ID. Only the owner or an admin can view the task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "200":
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Task'
 *       "404":
 *         description: Task not found
 *
 *   patch:
 *     summary: Update a task
 *     description: Updates a task's title, description, or status. Only the owner or an admin can update.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Task Title"
 *               description:
 *                 type: string
 *                 example: "Updated Task Description"
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *                 example: "IN_PROGRESS"
 *     responses:
 *       "200":
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Task'
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Task not found
 *
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task. Only the owner or an admin can delete a task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "204":
 *         description: Task deleted successfully
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Task not found
 */
