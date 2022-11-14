const { Op } = require("sequelize");
const express = require("express");
const app = express();
app.use(express.json());

const Product = require("./models/product");

// app.get("/product", async (req, res) => {
//   const { name } = req.query;
//   try {
//     const product = await Product.findAll({ where: { name } });
//     return res.status(200).json({ result: product });
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ message: "Error al obtener los productos.", error });
//   }
// });

app.get("/product", async (req, res) => {
  const { q, limit, page } = req.query;

  const search = q.toLowerCase();

  const finalLimit = Number(limit) || 5;
  const finalOffset = page ? (Number(page) - 1) * finalLimit : 0;

  try {
    const { count, rows } = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          { brand: { [Op.like]: "%" + search + "%" } },
        ],
      },
      offset: finalOffset,
      limit: finalLimit,
    });

    if (rows.length > 0) {
      const totalPages = Math.ceil(count / finalLimit);
      return res.status(200).json({ totalPages, total: count, result: rows });
    } else {
      return res
        .status(400)
        .json({ message: "No se encontraton resultados para la busqueda." });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error al obtener los productos.", error });
  }
});

app.post("/product", async (req, res) => {
  const { name, brand, price } = req.body;

  if (!name || !brand || !price) {
    return res.status(400).json({
      message: {
        error: "Faltan datos. Debes proporcionar name, brand y price.",
      },
    });
  }

  try {
    const id = Math.floor(Math.random() * 100000);

    const [product, created] = await Product.findOrCreate({
      where: { id },
      defaults: {
        name,
        brand,
        price,
      },
    });

    if (created) {
      return res.status(200).json({ res: product });
    }
  } catch (error) {
    return res.status(400).json({ message: { error } });
  }
});

app.put("/product/:id", async (req, res) => {
  const { id } = req.params;
  const { name, brand, price } = req.body;

  if ((name || brand || price) && id) {
    const response = await Product.update(
      {
        name,
        brand,
        price,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (response[0] == 1)
      return res.status(200).json({ res: "Modificacion exitosa" });
  } else
    return res
      .status(400)
      .json({ message: { error: "No se pudo modificar el producto." } });

  return res
    .status(400)
    .json({ message: { error: "Producto no encontrado." } });
});

app.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Product.destroy({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "No se pudo elimnar el producto.", error });
  }
});

app.listen(3000, () => {
  return console.log(`Server running on 3000`);
});
