var express = require("express");
var app = express();
var port = 8000;
var session = require("express-session");
var bp = require("body-parser");
var path = require("path");
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/basic_mongoose");

var QuoteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quote: { type: String, required: true }
}, { timestamps: true });
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model("Quote");


app.use(bp.urlencoded());
app.use(express.static(path.join(__dirname, "/client")));
app.use(session({ secret: "keylog" }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("index");
})
app.post("/process", function(req, res) {
    console.log(req.body);
    var quote = new Quote({ name: req.body.name, quote: req.body.quote });
    quote.save(function(err) {
        if (err) {
            console.log("something went wrong");
            res.redirect("/");
        } else {
            console.log("we added one more quote");
            res.redirect("/result");

        }
    })
})
app.get("/result", function(req, res) {
    Quote.find({}, function(error, result) {
        console.log(result[0].name);
        res.render("result", { quotes: result })
    })

})

app.listen(port, function() {
    console.log("Listening on port:8000");
})