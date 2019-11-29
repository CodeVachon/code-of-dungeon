const app = require("./app");
const pkg = require("./package.json");
const port = process.env.PORT || 3030;
const env = process.env.NODE_ENV || "local";

const stdOut = (message) => console.log(`-> ${message}`);

new Promise((resolve, reject) => {
    stdOut(`${pkg.name}:${pkg.version}`);
    stdOut("-".repeat(25));
    Object.keys(pkg.nodemonConfig.env).forEach((key) => {
        stdOut(`${key}: ${process.env[key]}`);
    });
    stdOut("-".repeat(25));

    resolve();
})
    .then(() => {
        const Application = app(env);

        stdOut(`Waiting for Application to Start`);
        Application.on("appStarted", () => {
            stdOut("Application to Started");

            Application.listen(port, () => {
                stdOut(`Listing at http://localhost:${port}`);
            });
        });
    })
    .catch((error) => {
        throw error;
    });
