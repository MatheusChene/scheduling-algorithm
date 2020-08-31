import contrib from "blessed-contrib";
import blessed from "blessed";
import fs from "fs";

let screen = blessed.screen();

let UI = {};

UI.init = (core) => {
    //grid.set(row, col, rowSpan, colSpan, obj, opts)

    UI.grid = new contrib.grid({
        rows: 12,
        cols: 6,
        screen: screen,
    });

    UI.logger = UI.grid.set(0, 0, 9, 6, contrib.log, {
        fg: "green",
        selectedFg: "green",
        label: "Logs",
    });

    // UI.commands = UI.grid.set(9, 0, 3, 3, blessed.box, {
    //     label: "Commands",
    // });

    UI.commands = UI.grid.set(9, 0, 3, 3, blessed.listbar, {
        label: "Commands",
        mouse: true,
        keys: true,
        vi: true,
        autoCommandKeys: true,
        style: {
            item: {
                fg: "white",
            },
            selected: {
                bg: "#00bcd4",
            },
        },
        commands: {
            "Refresh data-base list": function () {
                UI.refreshFiles();
                UI.logger.log("Loading Jobs from file:");
            },
            one: {
                keys: ["a"],
                callback: function () {
                    UI.logger.log("Loading Jobs from file1:");
                },
            },
            two: function () {
                UI.logger.log("Loading Jobs from file2:");
            },
            three: function () {
                UI.logger.log("Loading Jobs from file3:");
            },
        },
    });

    UI.commands.on("click", UI.commands.focus.bind(UI.commands));

    // UI.commands.on("keypress", function (ch, item) {
    //     console.log("aaa");
    // });

    // UI.commands.key(["right", "left"], function (ch, key) {
    //     UI.files.focus();
    // });

    UI.files = UI.grid.set(9, 3, 3, 3, contrib.tree, {
        label: "Saved jobs Json",
    });

    UI.files.on("select", function (item) {
        const fileName = item.name;

        UI.logger.log("Loading Jobs from file:");
        UI.logger.log(fileName);

        const jobs = require("./jobs/" + fileName);

        core.loadJobs(jobs);
    });

    UI.files.key(["right", "left"], function (ch, key) {
        UI.commands.focus();
    });

    screen.key(["escape", "q", "C-c"], function (ch, key) {
        return process.exit(0);
    });

    UI.refreshFiles();
    screen.render();
};

UI.refreshFiles = () => {
    let files = [];
    let fileData = {
        extended: true,
        children: [{ name: "teste" }],
    };

    UI.logger.log("Reading data-base dir...");
    files = fs.readdirSync("./data-base");
    for (var k in files) {
        if (files[k].indexOf(".json") >= 0) {
            fileData.children.push({
                name: files[k],
            });
        }
    }

    UI.files.setData(fileData);
};

export default UI;
