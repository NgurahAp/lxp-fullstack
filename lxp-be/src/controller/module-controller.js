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

      const meetingId = parseInt(req.params.meetingId); // Ambil meetingId dari URL
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
    const moduleId = parseInt(req.params.moduleId); // Ambil moduleId dari URL
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

const getModules = async (req, res, next) => {
  try {
    const meetingId = parseInt(req.params.meetingId); // Ambil meetingId dari URL
    const page = parseInt(req.query.page) || 1; // Ambil page dari query, default 1
    const size = parseInt(req.query.size) || 10; // Ambil size dari query, default 10

    const result = await moduleService.getModules(req.user, {
      meetingId,
      page,
      size,
    });

    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

const getModuleDetail = async (req, res, next) => {
  try {
    const meetingId = parseInt(req.params.meetingId);
    const moduleId = parseInt(req.params.moduleId);

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

export default {
  createModule,
  submitModuleAnswer,
  getModules,
  getModuleDetail,
};
