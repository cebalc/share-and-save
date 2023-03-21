const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
    res.json({message: "Backend Node.js funcionando"})
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});