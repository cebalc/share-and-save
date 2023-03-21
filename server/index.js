const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

app.get("/prueba", (req, res) => {
    res.json({message: "Backend Node.js funcionando"})
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});