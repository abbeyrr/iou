const db = require('../db');

module.exports = (io) => {

    // socket.io server-side
    async function getChatLog(id) {
        let messages = await db.Message.findAll({ where: { houseId: id } });
        messages = messages.map((message) => {
            return {
                id: message.id,
                username: message.username,
                text: message.text,
                datetime: message.datetime,
            }
        });
        return messages;
    }

    function addMessageToDatabase(message) {
        console.log("server: message sent");
        console.log(message.text, message.houseId, message.username);
        db.Message.create({
            text: message.text,
            datetime: Date.now(),
            houseId: message.houseId,
            username: message.username
        });

    }

    io.on("connection", (socket) => {

        socket.on("History", async id => { //To get the Log history when you first join the chat
            console.log(`request received, houseId=${id}`);
            var log = await getChatLog(id);
            socket.emit("chatLogData", log);
        })

        socket.on("message", async message => {
            addMessageToDatabase(message);
            io.emit("chatLog", message);
        })
    });

    function clearMessageTable() {
        db.Message.destroy({
            where: {},
            truncate: true,
        })
    }

    // clearMessageTable();

}