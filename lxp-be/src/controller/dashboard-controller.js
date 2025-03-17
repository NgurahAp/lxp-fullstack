import dashboardService from "../service/dashboard-service.js";

const getStudentDashboard = async (req, res, next) => {
  try {
    const result = await dashboardService.getStudentDashboard(req.user);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getInstructorDashboard = async (req, res, next) => {
  try {
    const result = await dashboardService.getInstructorDashboard(
      req.user
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export default { getStudentDashboard, getInstructorDashboard };
