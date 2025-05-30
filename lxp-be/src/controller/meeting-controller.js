import meetingService from "../service/meeting-service.js";

const createMeeting = async (req, res, next) => {
  try {
    const result = await meetingService.createMeeting(req.user, req.body);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const getMeetings = async (req, res, next) => {
  try {
    const result = await meetingService.getMeetings(req.user, {
      trainingId: req.params.trainingId,
      page: req.query.page,
      size: req.query.size,
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getMeetingDetail = async (req, res, next) => {
  try {
    const result = await meetingService.updateMeeting(
      req.user,
      req.params.meetingId,
      req.params.trainingId,
      req.body
    );
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const updateMeeting = async (req, res, next) => {
  try {
    const result = await meetingService.updateMeeting(
      req.user,
      req.params.meetingId,
      req.params.trainingId,
      req.body
    );
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const removeMeeting = async (req, res, next) => {
  try {
    await meetingService.removeMeeting(req.user, {
      meetingId: req.params.meetingId,
      trainingId: req.params.trainingId,
    });
    res.status(200).json({
      data: "Success delete meeting",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  createMeeting,
  getMeetings,
  getMeetingDetail,
  updateMeeting,
  removeMeeting,
};
