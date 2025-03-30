import multer from "multer";
import { uploadTasks } from "../middleware/upload-middleware.js";
import taskService from "../service/task-service.js";
import { ResponseError } from "../error/response-error.js";

const createTask = async (req, res, next) => {
  try {
    const meetingId = req.params.meetingId; // Changed from taskId to meetingId
    const result = await taskService.createTask(req.user, meetingId, req.body);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const submitTask = async (req, res, next) => {
  uploadTasks(req, res, async function (err) {
    try {
      if (err instanceof multer.MulterError) {
        throw new ResponseError(400, err.message);
      } else if (err) {
        throw new ResponseError(400, err.message);
      }

      const taskId = req.params.taskId;
      const result = await taskService.submitTask(req.user, taskId, req.file);

      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  });
};

const getTaskDetail = async (req, res, next) => {
  try {
    const meetingId = req.params.meetingId;
    const taskId = req.params.taskId;

    const result = await taskService.getDetailTask(req.user, {
      meetingId,
      taskId,
    });

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const submitTaskScore = async (req, res, next) => {
  try {
    const taskId = req.params.taskId; // Ambil taskId dari URL
    const result = await taskService.submitTaskScore(
      req.user,
      taskId,
      req.body
    );

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const result = await taskService.updateTask(req.user, {
      trainingId: req.params.trainingId,
      meetingId: req.params.meetingId,
      taskId: req.params.taskId,
      title: req.body.title,
      taskQuestion: req.body.taskQuestion,
    });
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.user, {
      trainingId: req.params.trainingId,
      meetingId: req.params.meetingId,
      taskId: req.params.taskId,
    });
    res.status(200).json({
      data: "Success delete task",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  createTask,
  submitTask,
  getTaskDetail,
  submitTaskScore,
  updateTask,
  deleteTask,
};
