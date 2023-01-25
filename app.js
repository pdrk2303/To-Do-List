
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const e = require("express");
const _ = require("lodash");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin-Priyadarshini:test123@cluster0.t12oe1m.mongodb.net/todolistDB', {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "Welcome to your to-do-list😍"
});

const item2 = new Item({
    name: "Hit the ➕ button to add a new item"
});

const item3 = new Item({
    name: "⬅️ Hit this to delete an item"
});

Item.find({}, function (err) {
    if (err) {
        console.log(err);f
    }
})

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items : [itemsSchema]
});

const List = mongoose.model("List", listSchema);
const workItems = [];

app.get("/", function (req, res) {

    const day = date.getDate();
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully added the document!")
                }
            });
            
        } else {
            res.render("list", {listName: day, newListItem: foundItems});
        }
        
    });

});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name: customListName}, function(err, results) {
        if (!err) {
            if (!results) {
                const list = new List ({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            } else{
                res.render("list", {listName: results.name, newListItem: results.items});
            }    
        } else {
            console.log(err);
        };
    });
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item ({
        name: itemName
    });
    if (listName === date.getDate()) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function (err, results) {
            results.items.push(item);
            results.save();
            res.redirect("/"+listName);
            if (err) {
                console.log(err);
            }
        })
    }


});

app.post("/delete", function (req,res) {
    const itemID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === date.getDate()) {
        Item.findByIdAndRemove(itemID, function (err) {
            if (!err) {
                console.log("Successfully deleted the document");
                res.redirect("/");
            };
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, function (err, results){
            if (!err) {
                res.redirect("/"+listName);
            }
        })
    }
    

})
app.get("/checklist", function (req, res) {
    res.render("list", {listName: "Check List", newListItem: workItems});
})



app.listen(3000, function (req, res) {
    console.log("Server started on port 3000.")
})