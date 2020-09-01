let validator = {};

validator.validateJson = (jsonObj) => {
	const validationsMessages = [];

	for (const job of jsonObj.jobs) {
		if (validator.validateTimeToExecute(job, jsonObj.executionWindow.startDate)) {
			validationsMessages.push(`Not enought time to execute job id ${job.id}`);
		}
		if (validator.validateConclusionMaxDate(job.conclusionMaxDate, jsonObj.executionWindow.startDate, jsonObj.executionWindow.endDate)) {
			validationsMessages.push(`Job id ${job.id} maximum date conclusion is out of the execution window`);
		}
	}

	return validationsMessages;
};

validator.validateJob = (job, startDate, endDate) => {
	if (validator.validateTimeToExecute(job, startDate) || validator.validateConclusionMaxDate(job.conclusionMaxDate, startDate, endDate)) {
		return false;
	}

	return true;
};

validator.validateTimeToExecute = ({ estimatedTime, conclusionMaxDate }, startDate) => {
	const minimumConclusionDate = new Date(startDate);
	minimumConclusionDate.setHours(minimumConclusionDate.getHours() + estimatedTime);

	if (minimumConclusionDate > new Date(conclusionMaxDate) || estimatedTime > 8) return true;

	return false;
};

validator.validateConclusionMaxDate = (jobMaxDate, startDate, endDate) => {
	jobMaxDate = new Date(jobMaxDate);

	if (jobMaxDate < new Date(startDate) || jobMaxDate > new Date(endDate)) return true;

	return false;
};

export default validator;
