import validator from "./job-validator.js";
import fs from "fs";

const core = {};

core.readFile = (filePath) => {
	if (fs.existsSync(filePath)) {
		const rawData = fs.readFileSync(filePath);
		return JSON.parse(rawData);
	}
};

core.scheduleJobs = (jsonObj) => {
	const scheduleJobs = [];
	const invalidJobList = [];
	const jobList = [];
	const startDate = new Date(jsonObj.executionWindow.startDate);
	const sortedJobs = jsonObj.jobs.sort((a, b) => new Date(a.conclusionMaxDate).getTime() - new Date(b.conclusionMaxDate).getTime());

	for (const job of sortedJobs) {
		if (!validator.validateJob(job, jsonObj.executionWindow.startDate, jsonObj.executionWindow.endDate)) {
			invalidJobList.push(job.id);
			continue;
		}

		if (!jobList.length) {
			jobList.push({ scheduleAccumulatedTime: job.estimatedTime, jobs: [job.id] });
			continue;
		}

		core.fitJobOnSchedule(jobList, job, startDate);
	}

	for (const list of jobList) {
		scheduleJobs.push(list.jobs);
	}

	console.log(scheduleJobs);
	console.log("Invalid jobs ids:");
	console.log(invalidJobList);
};

core.fitJobOnSchedule = (jobList, job, startDate) => {
	const scheduleMatch = jobList.find((uJob) => core.jobMatch(uJob.scheduleAccumulatedTime, job, startDate));

	if (scheduleMatch) {
		scheduleMatch.scheduleAccumulatedTime += job.estimatedTime;
		scheduleMatch.jobs.push(job.id);
	} else {
		jobList.push({ scheduleAccumulatedTime: job.estimatedTime, jobs: [job.id] });
	}
};

core.jobMatch = (scheduleAccumulatedTime, job, startDate) => {
	const jobConclusionDate = startDate.setHours(startDate.getHours() + scheduleAccumulatedTime + job.estimatedTime);

	if (scheduleAccumulatedTime + job.estimatedTime > 8 || jobConclusionDate > job.conclusionMaxDate) {
		return false;
	}

	return true;
};

export default core;
