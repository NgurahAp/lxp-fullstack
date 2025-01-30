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
    const result = await meetingService.getMeetingDetail(req.user, {
      trainingId: req.params.trainingId,
      meetingId: req.params.meetingId,
    });
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

export default { createMeeting, getMeetings, getMeetingDetail };
