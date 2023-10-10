const Job = require("../models/Job");

// route GET /api/v1/jobs
const getAllJobs = async (req, res) => {
  const { userId } = req.user;
  const jobs = await Job.find({ createdBy: userId }).sort("createdAt");
  res.status(201).json({ count: jobs.length, jobs });
};

//route  GET /api/v1/jobs/:id
const getJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    res.status(404).json({ msg: "Job Not Found" });
  }
  res.status(201).json({ job });
};

// route POST /api/v1/jobs
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(201).json({ job });
};

//route PATCH /api/v1/jobs/:id
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const { company, position } = req.body;
  if (!company || !position) {
    return res.status(400).json({ msg: "company or Position cannot be empty" });
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true }
  );
  if (!job) {
    res.status(404).json({ msg: "Job Not Found" });
  }

  res.status(200).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    res.status(404).json({ msg: "Job not found" });
  }

  res.status(200).json({ msg: "Job Deleted", job });
};

module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  createJob,
  deleteJob,
};
