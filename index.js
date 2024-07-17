const express = require("express");
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const Chat = require("./models/Chat"); // Ensure this path is correct

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connection successful");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

main();

const port = 8080;

// Root route to render the welcome page
app.get("/", (req, res) => {
    res.render("welcome");
});

// Index route to fetch all chats and render EJS template
app.get("/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        res.render("chats", { chats });
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).send("Error fetching chats");
    }
});

// Route to render the new chat form
app.get("/chats/new", (req, res) => {
    res.render("new");
});

// Route to render the edit form
app.get("/chats/edit/:id", async (req, res) => {
    try {
        let chat = await Chat.findById(req.params.id);
        res.render("edit", { chat });
    } catch (err) {
        console.error("Error fetching chat:", err);
        res.status(500).send("Error fetching chat");
    }
});

// POST route to create a new chat
app.post("/chats", (req, res) => {
    let { from, to, msg } = req.body;
    console.log("Received form data:", req.body); // Log the received data

    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });

    newChat.save()
        .then(() => {
            console.log("Chat was saved");
            res.redirect("/chats");
        })
        .catch((err) => {
            console.error("Error saving chat:", err);
            res.status(500).send("Error saving chat");
        });
});

// POST route to update an existing chat
app.post("/chats/edit/:id", async (req, res) => {
    let { from, to, msg } = req.body;

    try {
        await Chat.findByIdAndUpdate(req.params.id, {
            from: from,
            to: to,
            msg: msg,
            updated_at: new Date()
        });
        console.log("Chat was updated");
        res.redirect("/chats");
    } catch (err) {
        console.error("Error updating chat:", err);
        res.status(500).send("Error updating chat");
    }
});

// DELETE route to delete an existing chat
app.delete("/chats/:id", async (req, res) => {
    try {
        await Chat.findByIdAndDelete(req.params.id);
        console.log("Chat was deleted");
        res.redirect("/chats");
    } catch (err) {
        console.error("Error deleting chat:", err);
        res.status(500).send("Error deleting chat");
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
