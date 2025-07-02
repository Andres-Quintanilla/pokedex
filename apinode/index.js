const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');


const app = express();
const port = 3000;
const db = require("./models");

app.use(cors({
    origin: ['http://localhost:5173'],
    optionsSuccessStatus: 200
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

db.sequelize.sync({
     // force: true // drop tables and recreate
}).then(() => {
    console.log("Base de datos sincronizada");
});

require("./routes")(app);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});