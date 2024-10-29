import fs from "fs";
import _ from "lodash";

export class CountryAndStateCodeWriter {
    outputFilePath = null;
    fileData = "# Country and State Codes\n";

    constructor(outputFilePath) {
        this.outputFilePath = outputFilePath;
    }

    add(placeName, placeDataFilePath) {
        this.fileData += `\n# ${placeName}\n\n`;
        const placeData = JSON.parse(fs.readFileSync(placeDataFilePath));
        const places = _(placeData)
            .map((item) => {
                const { name } = item;
                const code = item.codeIso3 ?? item.stateCode;
                return { name, code };
            })
            .sortBy("code")
            .value();
        const maxPlaceNameLength = _(places).map("code.length").maxBy();
        places.forEach((item) => {
            this.fileData += `${item.code} = ${_.padEnd(item.name, maxPlaceNameLength)}\n`;
        });
    }

    write() {
        fs.writeFileSync(this.outputFilePath, this.fileData, "utf8");
    }
}
