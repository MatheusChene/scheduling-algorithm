import jsonJobCreator from "../src/json-job-creator.js";
import validator from "../src/json-validator.js";
import fs from "fs";

jest.mock("fs");

test("should give a random date between two dates", () => {
	const startDate = new Date("2019-11-10T00:00:00.000Z");
	const endDate = new Date("2019-11-15T00:00:00.000Z");

	const test = expect(jsonJobCreator.randomDate(startDate, endDate).getTime());
	test.toBeGreaterThanOrEqual(startDate.getTime());
	test.toBeLessThanOrEqual(endDate.getTime());
});

test("should give a random number between two numbers", () => {
	const test = expect(jsonJobCreator.randomNumberBetween(3, 7));
	test.toBeGreaterThanOrEqual(3);
	test.toBeLessThanOrEqual(7);
});

test("should validate set hour causing date bigger then end date", () => {
	const spy = jest.spyOn(validator, "validateConclusionMaxDate");
	spy.mockReturnValue(false);
	spy.mockReturnValueOnce(true);

	fs.existsSync.mockReturnValue(true);
	jsonJobCreator.create();
	expect(fs.writeFileSync).toHaveBeenCalled();

	spy.mockRestore();
});

test("should return validation messages and write files.", () => {
	const spyValidateTimeToExecute = jest.spyOn(validator, "validateTimeToExecute");
	spyValidateTimeToExecute.mockReturnValue(true);

	const spyValidateConclusionMaxDate = jest.spyOn(validator, "validateConclusionMaxDate");
	spyValidateConclusionMaxDate.mockReturnValue(true);

	console.log = jest.fn();

	fs.existsSync.mockReturnValue(true);
	jsonJobCreator.create();
	expect(fs.writeFileSync).toHaveBeenCalled();
	expect(console.log).toHaveBeenCalled();

	spyValidateTimeToExecute.mockRestore();
	spyValidateConclusionMaxDate.mockRestore();
});

test("should modify a file", () => {
	fs.existsSync.mockReturnValue(true);
	jsonJobCreator.create();
	expect(fs.writeFileSync).toHaveBeenCalled();
});

test("should not modify a file", () => {
	fs.existsSync.mockReturnValue(false);
	jsonJobCreator.create();
	expect(fs.writeFileSync).not.toHaveBeenCalled();
});
