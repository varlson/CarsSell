const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
require("./models");
const Cars = mongoose.model("cars");
const PORT = 9888;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

/********************************* ROTAS  **************************************888**/
/****************** ROTA LISTAR CARRO   ***********************888**/
app.get("/api/cars", (req, res) => {
  Cars.find((error, cars) => {
    if (!error) {
      return res
        .status(200)
        .json({ cars: cars, msg: "", error: false, succ: true });
    }

    return res
      .status(200)
      .json({ msg: `houve um error ${error}`, error: true, succ: false });
  });
});

/****************** ROTA ADICIONAR CARRO  ***********************888**/
app.post("/api/add-cars", upload.single("img"), async (req, res) => {
  const { nome, modelo, ano, preco, imagem } = req.body;
  // const imagem = req.file.originalname;
  const novoCarro = { nome, modelo, ano, imagem, preco };
  try {
    await new Cars(novoCarro)
      .save()
      .then(() => {
        res.status(200).json({
          msg: "salvo com sucesso",
          error: false,
          succ: true,
        });
      })
      .catch((error) => {
        console.log(`error to save ${error}`);
        res.status(502).json({
          msg: `erro na tentativa de adicionar caro ${error}`,
          error: true,
          succ: false,
        });
      });
  } catch (error) {
    es.status(502).json({
      msg: `erro interno ${error}`,
      error: true,
      succ: false,
    });
  }
});

/****************** ROTA DELETE ROTAS  ***********************888**/
app.get("/api/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    Cars.findByIdAndDelete(id, (error, car) => {
      res.status(200).json({
        msg: `carro deletado com sucesso`,
        error: false,
        succ: true,
      });
    });
  } catch (error) {
    res.status(502).json({
      msg: `erro na tentativa de deletar caro ${error}`,
      error: true,
      succ: false,
    });
  }
});

/****************** ROTA EDITAR CARRO  ***********************888**/

app.post("/api/editar/:id", async (req, res) => {
  const { nome, modelo, ano, imagem } = req.body;
  const novoCarro = { nome, modelo, ano, imagem };
  try {
    Cars.findByIdAndUpdate(req.params.id, novoCarro, (error, succ) => {
      if (!error) {
        return res.status(200).json({
          msg: "salvo com sucesso",
          error: false,
          succ: true,
        });
      }

      return res.status(502).json({
        msg: `erro na tentativa de editar caro ${error}`,
        error: true,
        succ: false,
      });
    });
  } catch (error) {
    es.status(502).json({
      msg: `erro interno ${error}`,
      error: true,
      succ: false,
    });
  }
});

/********************************* FIM DE ROTAS  **************************************888**/
const url =
  "mongodb+srv://loginSystem:A6K2JjSJyxtCHD72@cluster0.tcc6i.mongodb.net/cars?retryWrites=true&w=majority";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("listening on port", PORT);
    });
  })
  .catch((error) => {
    console.log(`error to connect databse ${error}`);
  });
