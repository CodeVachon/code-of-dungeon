const express = require("express");
const compression = require("compression");
const robots = require("express-robots");
const errorMessages = require("@christophervachon/error-messages");
const pkg = require("./package.json");
const extend = require("extend");

module.exports = (env) => {
    const app = express();

    app.set("appStarted", false);
    app.set("json spaces", 4);
    app.set("view engine", "pug");

    app.set("title", `${pkg.name}:${pkg.version}`);
    app.set("cdn_static_path");
    app.set("maincssfiles", [`${cdn_static_path}${pkg.name}.css`]);
    app.set("mainjsfiles", [`${cdn_static_path}${pkg.name}.js`]);
    app.set("metadata", [
        {
            name: "description",
            content: `${pkg.name}:${pkg.version} website`
        },
        {
            name: "robots",
            content: "noindex, nofollow"
        }
    ]);

    /**
     * Application Middlewares
     */
    app.use(compression());
    app.use(express.static(__dirname + "/public"));
    app.use(robots(require("./conf/robots.json")));

    if (env === "local") {
        const reload = require("reload");
        const Bundler = require("parcel-bundler");
        const parcelConf = require("./conf/parcel");

        reload(app).catch((error) => {
            console.error(error);
        });

        const jsList = app.get("mainjsfiles");
        jsList.push("/reload/reload.js");
        app.set("mainjsfiles", jsList);

        const bundler = new Bundler(
            parcelConf.entry,
            extend(false, parcelConf.options, {
                hmr: true,
                watch: true
            })
        );

        app.use(bundler.middleware());
    } // close if (env === "local")

    /**
     * Static files should be served by this point. 404 anything else
     */
    app.use((request, response, next) => {
        if (
            new RegExp(
                "\\.(jpe?g|gif|png|css|js|ico|pdf|jspx?|html?|php|cfml?|aspx?|txt)$",
                "gi"
            ).test(request.originalUrl.replace(/\?.{0,}$/, ""))
        ) {
            next(errorMessages.notFound());
        } else {
            next();
        }
    });

    /**
     * Application Routes
     */
    app.get("/", require("./routes/index"));

    /**
     * Catch All
     */
    app.use("*", (request, response, next) => {
        next(errorMessages.notFound());
    });

    /**
     * The Global Error Handler Goes Here!
     */
    app.use((error, request, response, next) => {
        if (!error.statusCode) {
            error.statusCode = error.status || 500;
        }

        if (error.message) {
            response.status(error.statusCode).render("error", {
                statusCode: error.statusCode,
                message: error.message
            });
        } else {
            next(error);
        }
    }); // close error handler

    /**
     * Start the Application
     */
    setTimeout(() => {
        app.emit("appStarted");
        app.set("appStarted", true);
    }, 50);

    return app;
}; // close module.exports
