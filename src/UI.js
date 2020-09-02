import jsonJobCreator from "./json-job-creator.js";
import validator from "./job-validator.js";
import core from "./core.js";

import blessed from "blessed";
import contrib from "blessed-contrib";
import fs from "fs";

let UI = {};

UI.init = () => {
	const screen = blessed.screen({
		smartCSR: true,
	});

	UI.grid = new contrib.grid({
		rows: 12,
		cols: 6,
		screen: screen,
	});

	UI.logger = UI.grid.set(0, 0, 8, 6, contrib.log, {
		fg: "green",
		selectedFg: "green",
		label: "Logs",
	});

	logMessage("Welcome to Scheduling Algorithm");
	logMessage("Initializing UI...");

	UI.fileLoaded = UI.grid.set(8, 0, 1, 6, blessed.box, {
		label: "File currently loaded:",
		content: "None",
	});

	UI.commands = UI.grid.set(9, 0, 3, 3, contrib.tree, {
		label: "Commands",
	});

	UI.commands.setData({
		extended: true,
		children: [
			{
				name: "Select file",
				command: 1,
			},
			{
				name: "Generate new random job file",
				command: 2,
			},
			{
				name: "Verify selected file",
				command: 3,
			},
			{
				name: "Execute scheduler algorithm",
				command: 4,
			},
		],
	});

	UI.commands.on("select", function (item) {
		switch (item.command) {
			case 1:
				setBorder(UI.commands, false);
				setBorder(UI.files, true);
				selectFiles();
				break;
			case 2:
				generateNewRandomJobFile();
				break;
			case 3:
				verifySelectedFile();
				break;
			case 4:
				executeScheduler();
				break;
			default:
				break;
		}
	});

	UI.files = UI.grid.set(9, 3, 3, 3, contrib.tree, {
		label: "Saved jobs Json",
	});

	UI.files.on("select", function (item) {
		const fileName = item.name;

		logMessage(`Loading Jobs from file ${fileName}...`);
		UI.commands.focus();

		UI.fileLoaded.setContent(item.name);
		setBorder(UI.files, false);
		setBorder(UI.commands, true);
		screen.render();
	});

	screen.key(["escape", "q", "C-c"], function (ch, key) {
		return process.exit(0);
	});

	refreshFiles();
	screen.render();

	UI.commands.focus();
	setBorder(UI.commands, true);
	logMessage("UI loading completed!");
};

const refreshFiles = () => {
	let files = [];
	let fileData = {
		extended: true,
		children: [],
	};

	logMessage("Reading jobs dir...");
	files = fs.readdirSync("./jobs");
	for (var k in files) {
		if (files[k].indexOf(".json") >= 0) {
			fileData.children.push({
				name: files[k],
			});
		}
	}

	UI.files.setData(fileData);
};

const selectFiles = () => {
	refreshFiles();
	logMessage("Select a file:");
	UI.files.focus();
};

const generateNewRandomJobFile = () => {
	jsonJobCreator.create(logMessage);
};

const verifySelectedFile = () => {
	const file = UI.fileLoaded.getContent();

	if (file === "None") {
		logMessage("No file currently selected...");
		logMessage("Please select a file...");

		return null;
	} else {
		const filePath = `./jobs/${file}`;

		const jsonJob = core.readFile(filePath);
		const messages = validator.validateJson(jsonJob);

		if (messages.length) {
			for (const message of messages) {
				logMessage(message);
			}
		} else {
			logMessage("Selected file is valid.");
		}

		return jsonJob;
	}
};

const executeScheduler = () => {
	const jsonJob = verifySelectedFile();

	if (jsonJob) {
		const result = core.scheduleJobs(jsonJob);

		if (result.scheduleJobs) {
			logMessage("Valid jobs schedule arrays:");
			logMessage(JSON.stringify(result.scheduleJobs));
		}
		if (result.invalidJobList) {
			logMessage("Invalid jobs ids:");
			logMessage(JSON.stringify(result.invalidJobList));
		}
	}
};

const setBorder = (box, selected) => {
	if (selected) {
		box.style = {
			border: {
				fg: "blue",
				bold: true,
			},
		};
	} else {
		box.style = {
			border: {
				fg: "green",
				bold: false,
			},
		};
	}
};

const logMessage = (message) => {
	UI.logger.log(message);
};

export default UI;
