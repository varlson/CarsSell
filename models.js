const mongoose = require("mongoose");
const Scheema = new mongoose.Schema({
  nome: {
    type: String,
  },
  ano: {
    type: Number,
  },
  modelo: {
    type: String,
  },
  preco: {
    type: Number,
  },
  imagem: {
    type: String,
  },
});
module.exports = mongoose.model("cars", Scheema);
