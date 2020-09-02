import core from "../src/core.js";
import fs from "fs";

jest.mock("fs");

test("should call readFileSync", () => {
	fs.existsSync.mockReturnValue(true);
	fs.readFileSync.mockReturnValue("{}");
	core.readFile();
	expect(fs.readFileSync).toHaveBeenCalled();
});

test("should not call readFileSync", () => {
	fs.existsSync.mockReturnValue(false);
	core.readFile();
	expect(fs.readFileSync).not.toHaveBeenCalled();
});

test("should return a valid array of jobs", () => {
	expect(core.scheduleJobs(jsonObj)).toStrictEqual({
		scheduleJobs: [[1, 3], [2]],
		invalidJobList: [],
	});
});

test("should return a valid and invalid array of jobs", () => {
	const cloneObj = { ...jsonObj };
	cloneObj.jobs = [...cloneObj.jobs, ...invalidJobs];

	expect(core.scheduleJobs(cloneObj)).toStrictEqual({
		scheduleJobs: [[1, 3], [2]],
		invalidJobList: [4, 5],
	});
});

test("should match a job", () => {
	const job = {
		id: 1,
		estimatedTime: 3,
		conclusionMaxDate: "2020-07-21T19:00:00.000Z",
	};

	const spy = jest.spyOn(core, "jobMatch");
	spy.mockReturnValue(false);

	const jobList = [{ scheduleAccumulatedTime: 2, jobs: [] }];
	const pushSpy = jest.spyOn(jobList, "push");

	core.fitJobOnSchedule(jobList, job, new Date("2020-07-21T14:00:00.000Z"));
	expect(pushSpy).toHaveBeenCalled();

	spy.mockRestore();
});

test("should not match a job", () => {
	const job = {
		id: 1,
		estimatedTime: 3,
		conclusionMaxDate: "2020-07-21T19:00:00.000Z",
	};

	const spy = jest.spyOn(core, "jobMatch");
	spy.mockReturnValue(true);

	const jobList = [{ scheduleAccumulatedTime: 2, jobs: [] }];
	const pushSpy = jest.spyOn(jobList, "push");

	core.fitJobOnSchedule(jobList, job, new Date("2020-07-21T14:00:00.000Z"));
	expect(pushSpy).not.toHaveBeenCalled();

	spy.mockRestore();
});

test("should return true when job is compatible", () => {
	const job = {
		estimatedTime: 3,
		conclusionMaxDate: "2020-07-21T19:00:00.000Z",
	};

	expect(core.jobMatch(2, job, new Date("2020-07-21T14:00:00.000Z"))).toBe(true);
});

test("should return false when job is not compatible", () => {
	const job = {
		estimatedTime: 4,
		conclusionMaxDate: "2020-07-21T19:00:00.000Z",
	};

	expect(core.jobMatch(2, job, new Date("2020-07-21T14:00:00.000Z"))).toBe(false);
});

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
		id: 4,
		description: "Importação de arquivos de fundos",
		conclusionMaxDate: "2019-11-09T15:00:00.000Z",
		estimatedTime: 9,
	},
	{
		id: 5,
		description: "Importação de dados da Base Legada",
		conclusionMaxDate: "2019-11-09T15:00:00.000Z",
		estimatedTime: 4,
	},
];
