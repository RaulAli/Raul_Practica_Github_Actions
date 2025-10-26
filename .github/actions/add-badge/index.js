const fs = require("fs");

const OUTCOME = process.env.INPUT_OUTCOME; // "success" | "failure"
const README = "README.md";
const MARK = "RESULTAT DELS ÚLTIMS TESTS";

const BADGE_SUCCESS = "![Cypress](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)";
const BADGE_FAILURE = "![Tests](https://img.shields.io/badge/test-failure-red)";

function run() {
    if (!fs.existsSync(README)) {
        console.error("README.md not found");
        process.exit(1);
    }
    const badge = OUTCOME === "success" ? BADGE_SUCCESS : BADGE_FAILURE;
    let content = fs.readFileSync(README, "utf8");

    const i = content.indexOf(MARK);
    if (i === -1) {
        content += `\n\n${MARK}\n\n${badge}\n`;
    } else {
        const before = content.slice(0, i + MARK.length);
        const after = content.slice(i + MARK.length);
        const cleanedAfter = after.replace(/\n+\!\[.*?\]\(https:\/\/img\.shields\.io\/badge.*?\)\s*/i, "\n");
        content = `${before}\n\n${badge}\n${cleanedAfter}`;
    }

    fs.writeFileSync(README, content, "utf8");
    console.log(`Badge (${OUTCOME}) actualizado en README.md`);
}
run();
