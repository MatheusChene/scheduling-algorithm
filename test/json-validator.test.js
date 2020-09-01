import validator from "../src/json-validator.js";

const jsonObj = {
	executionWindow: {
		startDate: "2019-11-10T12:00:00.000Z",
		endDate: "2019-11-11T15:00:00.000Z",
	},
	jobs: [
		{
			id: 1,
			description: "Importação de arquivos de fundos",
			conclusionMaxDate: "2019-11-10T15:00:00.000Z",
			estimatedTime: 2,
		},
		{
			id: 2,
			description: "Importação de dados da Base Legada",
			conclusionMaxDate: "2019-11-11T15:00:00.000Z",
			estimatedTime: 4,
		},
		{
			id: 3,
			description: "Importação de dados de integração",
			conclusionMaxDate: "2019-11-11T11:00:00.000Z",
			estimatedTime: 6,
		},
	],
};

const invalidJobs = [
	{
		id: 1,
		description: "Importação de arquivos de fundos",
		conclusionMaxDate: "2019-11-09T15:00:00.000Z",
		estimatedTime: 5,
	},
	{
		id: 2,
		description: "Importação de dados da Base Legada",
		conclusionMaxDate: "2019-11-09T15:00:00.000Z",
		estimatedTime: 4,
	},
];

test("should give exception error, jsonObj null", () => {
	expect(() => validator.validateJson()).toThrow("Cannot read property 'jobs' of undefined");
});

test("should give exception error, jsonObj.jobs null", () => {
	expect(() => validator.validateJson({})).toThrow("jsonObj.jobs is not iterable");
});

test("validateTimeToExecute should return true", () => {
	const jobObj = { estimatedTime: 5, conclusionMaxDate: "2019-11-10T15:00:00.000Z" };
	const startDate = "2019-11-10T12:00:00.000Z";

	expect(validator.validateTimeToExecute(jobObj, startDate)).toBe(true);
});

test("validateTimeToExecute should return false", () => {
	const jobObj = { estimatedTime: 2, conclusionMaxDate: "2019-11-10T15:00:00.000Z" };
	const startDate = "2019-11-10T12:00:00.000Z";

	expect(validator.validateTimeToExecute(jobObj, startDate)).toBe(false);
});

test("validateConclusionMaxDate should return true", () => {
	const jobMaxDate = "2019-11-09T15:00:00.000Z";
	const startDate = "2019-11-10T12:00:00.000Z";
	const endDate = "2019-11-11T15:00:00.000Z";

	expect(validator.validateConclusionMaxDate(jobMaxDate, startDate, endDate)).toBe(true);
});

test("validateConclusionMaxDate should return false", () => {
	const jobMaxDate = "2019-11-10T15:00:00.000Z";
	const startDate = "2019-11-10T12:00:00.000Z";
	const endDate = "2019-11-11T15:00:00.000Z";

	expect(validator.validateConclusionMaxDate(jobMaxDate, startDate, endDate)).toBe(false);
});

test("should return 3 validation message", () => {
	const spy = jest.spyOn(validator, "validateTimeToExecute");
	spy.mockReturnValue(true);

	expect(validator.validateJson(jsonObj)).toHaveLength(3);
	expect(spy).toHaveBeenCalledTimes(3);

	spy.mockRestore();
});

test("should return 6 validation message", () => {
	const spyValidateTimeToExecute = jest.spyOn(validator, "validateTimeToExecute");
	spyValidateTimeToExecute.mockReturnValue(true);

	const spyValidateConclusionMaxDate = jest.spyOn(validator, "validateConclusionMaxDate");
	spyValidateConclusionMaxDate.mockReturnValue(true);

	expect(validator.validateJson(jsonObj)).toHaveLength(6);
	expect(spyValidateTimeToExecute).toHaveBeenCalledTimes(3);
	expect(spyValidateConclusionMaxDate).toHaveBeenCalledTimes(3);

	spyValidateTimeToExecute.mockRestore();
	spyValidateConclusionMaxDate.mockRestore();
});

test("should return 4 validation message", () => {
	const cloneObj = { ...jsonObj };
	cloneObj.jobs = [...invalidJobs];

	expect(validator.validateJson(cloneObj)).toHaveLength(4);
});

test("should return 0 validation message", () => {
	expect(validator.validateJson(jsonObj)).toHaveLength(0);
});
