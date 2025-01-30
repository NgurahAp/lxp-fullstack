import { ResponseError } from "../error/response-error.js";
import { uploadModule } from "../middleware/upload-middleware.js";
import moduleSevice from "../service/module-sevice.js";
import multer from "multer";

const createModule = async (req, res, next) => {
  uploadModule(req, res, async function (err) {
    try {
      if (err instanceof multer.MulterError) {
        throw new ResponseError(400, err.message);
      } else if (err) {
        throw new ResponseError(400, err.message); // Ensure the error message is passed
      }

      const result = await moduleSevice.createModule(
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

export default { createModule };
