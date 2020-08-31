import fs from "fs";

let core = {};

core.loadJobs = (jobs) => {
    console.log(student);
};

core.readFile = (filePath) => {
    let rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
};

core.scheduleJobs = (jsonObj) => {
    let scheduleJobs = [];
    let helperArr = [];
    let sortedJobs = jsonObj.jobs.sort((a, b) => new Date(a.conclusionMaxDate).getTime() - new Date(b.conclusionMaxDate).getTime());

    const startDate = new Date(jsonObj.executionWindow.startDate);

    for (const job of sortedJobs) {
        if (!helperArr.length) {
            helperArr.push({ id: job.id, estimatedTime: job.estimatedTime });
        } else {
            let matchJob = helperArr.find((x) => this.jobMatch(x, job, startDate));

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

    let jobConclusionDate = startDate.setHours(startDate.getHours() + scheduledJob.estimatedTime + job.estimatedTime);

    if (jobConclusionDate > job.conclusionMaxDate) return false;

    return true;
};

core.validateJson = (jsonObj) => {
    let validationsMessages = [];

    for (const job of jsonObj.jobs) {
        if (this.validateTimeToExecute(job, jsonObj.executionWindow.startDate)) validationMessage.push(`Not enought time to execute job id ${job.id}`);
        if (this.validateConclusionMaxDate(job.conclusionMaxDate, jsonObj.executionWindow.endDate)) validationMessage.push(`Job id ${job.id} maximum date conclusion is out of the execution window`);
    }

    return validationsMessages;
};

core.validateTimeToExecute = ({ estimatedTime, conclusionMaxDate }, startDate) => {
    let minimumConclusionDate = new Date(startDate);
    minimumConclusionDate.setHours(minimumConclusionDate.getHours() + estimatedTime);

    if (minimumConclusionDate > new Date(conclusionMaxDate)) return true;

    return false;
};

core.validateConclusionMaxDate = (jobMaxDate, endDate) => {
    if (new Date(jobMaxDate) > new Date(endDate)) return true;

    return false;
};

//TODO
core.validateJsonStructure = () => {};

core.test = () => {
    let rawData = fs.readFileSync("./jobs/cit-test.json");
    let { executionWindow, jobs } = JSON.parse(rawData);

    let endDate = new Date(executionWindow.endDate);
    console.log("Data final: " + endDate.toString());

    let calculatedDate = new Date(executionWindow.startDate);

    let sortedArray = jobs.sort((a, b) => new Date(a.conclusionMaxDate).getTime() - new Date(b.conclusionMaxDate).getTime());
    for (const job of sortedArray) {
        calculatedDate.setHours(calculatedDate.getHours() + job.estimatedTime);

        console.log(`Data que a execução do id ${job.id} vai acabar: ${calculatedDate.toString()}`);
    }
};

export default core;
