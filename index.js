import core from "./src/core.js";
import jsonJobCreator from "./src/json-job-creator.js";
// import UI from "./UI.js";

// UI.init(core);

//jsonJobCreator.create();
let jsonJobs = core.readFile("./jobs/cit-test.json");
//let jsonJobs = core.readFile("./jobs/generated-json.json");
core.scheduleJobs(jsonJobs);
//core.test();
