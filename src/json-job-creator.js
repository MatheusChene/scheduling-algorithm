import validator from "./json-validator.js";
import fs from "fs";

let jsonJobCreator = {};

jsonJobCreator.create = () => {
	const startDate = randomDate(new Date(2020, 0, 31), new Date(2020, 11, 31));
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + randomNumberBetween(1, 5));
	endDate.setHours(startDate.getHours() + randomNumberBetween(0, 24));

	let randomJobsJson = {
		executionWindow: {
			startDate: startDate.toJSON(),
			endDate: endDate.toJSON(),
		},
		jobs: [],
	};

	const numberOfJobs = randomNumberBetween(4, 50);

	for (let index = 0; index < numberOfJobs; index++) {
		const estimatedTime = randomNumberBetween(1, 8);
		const validStartDate = new Date(startDate);
		validStartDate.setHours(startDate.getHours() + estimatedTime);

		let conclusionMaxDate = randomDate(validStartDate, endDate);

		if (conclusionMaxDate < validStartDate) {
			conclusionMaxDate.setHours(validStartDate.getHours());
		}

		if (conclusionMaxDate > endDate) {
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
		for (const validation of validations) {
			console.log(validation);
		}
	}

	const data = JSON.stringify(randomJobsJson, null, 2);
	fs.writeFileSync("./jobs/generated-json.json", data);
};

function randomDate(start, end) {
	let date = new Date(+start + Math.random() * (end - start));

	date.setHours(randomNumberBetween(0, 24));
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
}

function randomNumberBetween(n1, n2) {
	return Math.floor(Math.random() * n2) + n1;
}

export default jsonJobCreator;
