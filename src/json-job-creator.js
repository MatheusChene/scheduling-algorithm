import validator from "./job-validator.js";

import fs from "fs";

let jsonJobCreator = {};

jsonJobCreator.create = (uiLogMessage) => {
	uiLogMessage("Generating new file...");

	const startDate = jsonJobCreator.randomDate(new Date(2020, 0, 31), new Date(2020, 11, 31));
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + jsonJobCreator.randomNumberBetween(1, 5));
	endDate.setHours(startDate.getHours() + jsonJobCreator.randomNumberBetween(0, 24));

	let randomJobsJson = {
		executionWindow: {
			startDate: startDate.toJSON(),
			endDate: endDate.toJSON(),
		},
		jobs: [],
	};

	const numberOfJobs = jsonJobCreator.randomNumberBetween(4, 50);

	for (let index = 0; index < numberOfJobs; index++) {
		const estimatedTime = jsonJobCreator.randomNumberBetween(1, 8);
		const validStartDate = new Date(startDate);
		validStartDate.setHours(startDate.getHours() + estimatedTime);

		let conclusionMaxDate = jsonJobCreator.randomDate(validStartDate, endDate);

		if (conclusionMaxDate < validStartDate) {
			conclusionMaxDate.setHours(validStartDate.getHours());
		}

		if (validator.validateConclusionMaxDate(conclusionMaxDate, startDate, endDate)) {
			conclusionMaxDate = endDate;
		}

		let job = {
			id: index,
			description: `Job ${index}`,
			estimatedTime,
			conclusionMaxDate,
		};

		randomJobsJson.jobs.push(job);
	}

	let validations = validator.validateJson(randomJobsJson);

	if (validations.length) {
		uiLogMessage("Something wrong is not right:");

		for (const validation of validations) {
			uiLogMessage(validation);
		}

		uiLogMessage("This file will generate some inconsistent data.");
	}

	const jsonPath = "./jobs/generated-json.json";

	if (fs.existsSync(jsonPath)) {
		const data = JSON.stringify(randomJobsJson, null, 2);
		fs.writeFileSync(jsonPath, data);
		uiLogMessage("New file generation is completed.");
	} else {
		uiLogMessage("generated-json.json file does not exists, please verify.");
	}
};

jsonJobCreator.randomDate = (start, end) => {
	let date = new Date(+start + Math.random() * (end - start));

	date.setHours(jsonJobCreator.randomNumberBetween(0, 24));
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
};

jsonJobCreator.randomNumberBetween = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default jsonJobCreator;
