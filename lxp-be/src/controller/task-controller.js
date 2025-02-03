import taskService from "../service/task-service";

const createTask = async (req, res, next) => {
  try {
    const meetingId = parseInt(req.params.meetingId); // Changed from taskId to meetingId
    const result = await taskService.createTask(req.user, meetingId, req.body);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { createTask };
