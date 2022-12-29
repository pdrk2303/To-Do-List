
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static("public"));

const items = [];
const workItems = [];

app.get("/", function (req, res) {

    const day = date.getDate();
    res.render("list", {listName: day, newListItem: items})

})

app.post("/", function (req, res) {
    const item = req.body.newItem;
    console.log(req.body)
    
    if (req.body.button === "Check") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
    
});

app.get("/checklist", function (req, res) {
    res.render("list", {listName: "Check List", newListItem: workItems});
})



app.listen(3000, function (req, res) {
    console.log("Server started on port 3000.")
})