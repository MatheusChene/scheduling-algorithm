let validator = {};

validator.validateJson = (jsonObj) => {
	const validationsMessages = [];

	for (const job of jsonObj.jobs) {
		if (validateTimeToExecute(job, jsonObj.executionWindow.startDate)) {
			validationsMessages.push(`Not enought time to execute job id ${job.id}`);
		}
		if (validateConclusionMaxDate(job.conclusionMaxDate, jsonObj.executionWindow.endDate)) {
			validationsMessages.push(`Job id ${job.id} maximum date conclusion is out of the execution window`);
		}
	}

	return validationsMessages;
};

const validateTimeToExecute = ({ estimatedTime, conclusionMaxDate }, startDate) => {
	const minimumConclusionDate = new Date(startDate);
	minimumConclusionDate.setHours(minimumConclusionDate.getHours() + estimatedTime);

	if (minimumConclusionDate > new Date(conclusionMaxDate)) return true;

	return false;
};

const validateConclusionMaxDate = (jobMaxDate, endDate) => {
	if (new Date(jobMaxDate) > new Date(endDate)) return true;

	return false;
};

export default validator;
