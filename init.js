const mongoose = require('mongoose');
const Chat = require("./models/Chat"); // Ensure this path is correct

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connection successful");

        // Array of chat objects
        const chatObjects = [
            {
                from: "neha",
                to: "priya",
                msg: "send me your exam sheet",
                created_at: new Date() // Example date
            },
            {
                from: "priya",
                to: "neha",
                msg: "I will send it soon",
                created_at: new Date() // Example date
            },
            {
                from: "Shaan",
                to: "Purav",
                msg: "Hello ! how are you?",
                created_at: new Date() // Example date
            }
            // Add more chat objects as needed
        ];
        await Chat.insertMany(chatObjects);
        console.log("Chat documents inserted successfully");

        // Disconnecting from the database after inserting
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
