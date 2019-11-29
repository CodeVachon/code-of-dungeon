const express = require("express");
const router = express.Router({
    caseSensitive: true,
    mergeParams: true
});

router.route("/").get((request, response) => {
    response.render("index");
}); // close router.route("/")

module.exports = router;
