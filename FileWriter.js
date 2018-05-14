"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class FileWriter {
    constructor(location) {
        this.fileLocation = location;
        this.stream = fs.createWriteStream(this.fileLocation);
        fs.stat(this.fileLocation, function (err, stat) {
            if (err == null) {
                var d = (new Date());
                var newName = location.substr(0, location.lastIndexOf(".")) + d.getFullYear() + d.getMonth() + d.getDate() + "-" + d.getHours() + d.getMinutes() + location.substr(location.lastIndexOf("."));
                console.log("File exists, renaming: " + newName);
                fs.rename(location, newName, function (e) {
                    console.log(e);
                });
            }
            else if (err.code == "ENOENT") {
                // fs.writeFile('log.txt', 'Some log\n');
            }
            else {
                console.log("Some other error: ", err.code);
            }
        });
    }
    ;
    appendHeader(header) {
        this.stream = fs.createWriteStream(this.fileLocation);
        this.stream.write(header + "\r\n");
    }
    ;
    appendLine(line) {
        this.stream.write(line + "\r\n");
    }
    close() {
        this.stream.close();
    }
}
exports.FileWriter = FileWriter;
