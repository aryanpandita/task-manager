const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTaskById,
  deleteTaskById,
} = require('../controllers/taskController');

// POST /api/tasks
router.post('/', createTask);

// GET /api/tasks
router.get('/', getAllTasks);

// PUT /api/tasks/:id
router.put('/:id', updateTaskById);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTaskById);

module.exports = router;
