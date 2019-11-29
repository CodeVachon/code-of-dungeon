const Bundler = require("parcel-bundler");
const conf = require("./conf/parcel");

const path = require("path");
const copyFiles = require("@christophervachon/copyfiles").default;

(async function() {
    // Initializes a bundler using the entrypoint location and options provided
    const bundler = new Bundler(conf.entry, conf.options);

    await copyFiles(
        path.resolve(__dirname, "./src/"),
        path.resolve(__dirname, "./public/"),
        {
            filter: new RegExp(".(jpe?g|png|gif|svg|ico)$")
        }
    );

    // Run the bundler, this returns the main bundle
    // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
    return await bundler.bundle();
})();
