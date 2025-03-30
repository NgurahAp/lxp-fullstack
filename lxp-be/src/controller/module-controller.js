import { ResponseError } from "../error/response-error.js";
import { uploadModule } from "../middleware/upload-middleware.js";
import multer from "multer";
import moduleService from "../service/module-service.js";

const createModule = async (req, res, next) => {
  uploadModule(req, res, async function (err) {
    try {
      if (err instanceof multer.MulterError) {
        throw new ResponseError(400, err.message);
      } else if (err) {
        throw new ResponseError(400, err.message); // Ensure the error message is passed
      }

      const meetingId = req.params.meetingId; // Ambil meetingId dari URL
      const result = await moduleService.createModule(
        req.user,
        meetingId,
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

const submitModuleAnswer = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId; // Get moduleId from URL
    const result = await moduleService.submitModuleAnswer(
      req.user,
      moduleId,
      req.body
    );

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getModuleDetail = async (req, res, next) => {
  try {
    const meetingId = req.params.meetingId;
    const moduleId = req.params.moduleId;

    const result = await moduleService.getModuleDetail(req.user, {
      meetingId,
      moduleId,
    });

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const submitModuleScore = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId; // Ambil moduleId dari URL
    const result = await moduleService.submitModuleScore(
      req.user,
      moduleId,
      req.body
    );

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateModule = async (req, res, next) => {
  uploadModule(req, res, async function (err) {
    try {
      if (err instanceof multer.MulterError) {
        throw new ResponseError(400, err.message);
      } else if (err) {
        throw new ResponseError(400, err.message); // Ensure the error message is passed
      }

      const result = await moduleService.updateModule(
        req.user,
        {
          trainingId: req.params.trainingId,
          meetingId: req.params.meetingId,
          moduleId: req.params.moduleId,
          title: req.body.title,
        },
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

const deleteModule = async (req, res, next) => {
  try {
    await moduleService.deleteModule(req.user, {
      trainingId: req.params.trainingId,
      meetingId: req.params.meetingId,
      moduleId: req.params.moduleId,
    });
    res.status(200).json({
      data: "Success delete module",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  createModule,
  submitModuleAnswer,
  getModuleDetail,
  submitModuleScore,
  updateModule,
  deleteModule,
};
