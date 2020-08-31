import fs from "fs";

const core = {};

core.loadJobs = (jobs) => {
	console.log(student);
};

core.readFile = (filePath) => {
	const rawData = fs.readFileSync(filePath);
	return JSON.parse(rawData);
};

core.scheduleJobs = (jsonObj) => {
	const scheduleJobs = [];
	const helperArr = [];
	const sortedJobs = jsonObj.jobs.sort((a, b) => new Date(a.conclusionMaxDate).getTime() - new Date(b.conclusionMaxDate).getTime());

	const startDate = new Date(jsonObj.executionWindow.startDate);

	for (const job of sortedJobs) {
		if (!helperArr.length) {
			helperArr.push({ id: job.id, estimatedTime: job.estimatedTime });
		} else {
			const matchJob = helperArr.find((x) => this.jobMatch(x, job, startDate));

			if (matchJob) {
				scheduleJobs.push([matchJob.id, job.id]);
			} else {
				helperArr.push({ id: job.id, estimatedTime: job.estimatedTime });
			}
		}
	}

	if (helperArr.length) {
		for (const job of helperArr) {
			scheduleJobs.push([job.id]);
		}
	}

	return scheduleJobs;
};

core.jobMatch = (scheduledJob, job, startDate) => {
	if (scheduledJob.estimatedTime + job.estimatedTime > 8) return false;

	const jobConclusionDate = startDate.setHours(startDate.getHours() + scheduledJob.estimatedTime + job.estimatedTime);

	if (jobConclusionDate > job.conclusionMaxDate) return false;

	return true;
};

export default core;
