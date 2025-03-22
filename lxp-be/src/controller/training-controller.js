import { uploadTrainingImage } from "../middleware/upload-middleware.js";
import trainingService from "../service/training-service.js";
import { ResponseError } from "../error/response-error.js";
import multer from "multer";

const createTraining = async (req, res, next) => {
  uploadTrainingImage(req, res, async function (err) {
    try {
      if (err instanceof multer.MulterError) {
        throw new ResponseError(400, err.message);
      } else if (err) {
        throw new ResponseError(400, err.message);
      }

      const result = await trainingService.createTraining(
        req.user,
        req.body,
        req.file
      );

      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  });
};

const createTrainingUser = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await trainingService.createTrainingUser(request);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getStudentsTraining = async (req, res, next) => {
  try {
    const result = await trainingService.getStudentTrainings(
      req.user,
      req.query
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getInstructorTraining = async (req, res, next) => {
  try {
    const result = await trainingService.getInstructorTrainings(
      req.user,
      req.query
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getTrainingDetail = async (req, res, next) => {
  try {
    const trainingId = req.params.trainingId;
    const result = await trainingService.getTrainingDetail(
      req.user,
      trainingId
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getInstructorTrainingDetail = async (req, res, next) => {
  try {
    const trainingId = req.params.trainingId;
    const result = await trainingService.getInstructorTrainingDetail(
      req.user,
      trainingId
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const updateTraining = async (req, res, next) => {
  uploadTrainingImage(req, res, async function (err) {
    try {
      if (err instanceof multer.MulterError) {
        throw new ResponseError(400, err.message);
      } else if (err) {
        throw new ResponseError(400, err.message);
      }

      // Ambil trainingId dari parameter URL
      const trainingId = req.params.trainingId;

      const result = await trainingService.updateTraining(
        req.user,
        trainingId, // Kirim parameter trainingId terlebih dahulu
        req.body, // Hanya kirim body tanpa file
        req.file // Kirim file sebagai parameter terpisah
      );

      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  });
};

export default {
  createTraining,
  createTrainingUser,
  getStudentsTraining,
  getInstructorTraining,
  getTrainingDetail,
  getInstructorTrainingDetail,
  updateTraining,
};
