import fs from "fs";

const core = {};

core.readFile = (filePath) => {
	if (fs.existsSync(jsonPath)) {
		const rawData = fs.readFileSync(filePath);
		return JSON.parse(rawData);
	}
};

core.scheduleJobs = (jsonObj) => {
	const scheduleJobs = [];
	const jobList = [];
	const startDate = new Date(jsonObj.executionWindow.startDate);
	const sortedJobs = jsonObj.jobs.sort((a, b) => new Date(a.conclusionMaxDate).getTime() - new Date(b.conclusionMaxDate).getTime());

	for (const job of sortedJobs) {
		if (!jobList.length) {
			jobList.push({ scheduleAccumulatedTime: job.estimatedTime, jobs: [job.id] });
		} else {
			const scheduleMatch = jobList.find((uJob) => core.jobMatch(uJob.scheduleAccumulatedTime, job, startDate));

			if (scheduleMatch) {
				scheduleMatch.scheduleAccumulatedTime += job.estimatedTime;
				scheduleMatch.jobs.push(job.id);
			} else {
				jobList.push({ scheduleAccumulatedTime: job.estimatedTime, jobs: [job.id] });
			}
		}
	}

	for (const list of jobList) {
		scheduleJobs.push(list.jobs);
	}

	console.log(scheduleJobs);
};

core.jobMatch = (scheduleAccumulatedTime, job, startDate) => {
	if (scheduleAccumulatedTime + job.estimatedTime > 8) {
		return false;
	}

	const jobConclusionDate = startDate.setHours(startDate.getHours() + scheduleAccumulatedTime + job.estimatedTime);

	if (jobConclusionDate > job.conclusionMaxDate) {
		return false;
	}

	return true;
};

export default core;
