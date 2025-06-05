const { Op } = require('sequelize');
const db = require('../modelsSQL');

const Producto        = db.Producto;
const HistorialPrecio = db.HistorialPrecio;
const Catalogo        = db.Catalogo;
const Categoria       = db.Categoria;

// Crear un nuevo producto
async function crearProducto(body) {
  const existe = await Producto.findOne({ where: { estiloProducto: body.estiloProducto } });
  if (existe) throw new Error('Ya existe un producto con este estilo');

  const producto = await Producto.create({
    estiloProducto: body.estiloProducto,
    disponibilidadProducto: body.disponibilidadProducto,
    tamanoproducto: body.tamanoproducto,
    imagen: body.imagen,
    historial_precio_id: body.historialPrecios?.[0] || null 
  });

  if (body.catalogos?.length) {
    await producto.setCatalogos(body.catalogos);
  }

  if (body.categorias?.length) {
    await producto.setCategorias(body.categorias);
  }

  return buscarProductoPorId(producto.id);
}

// Actualizar un producto
async function actualizarProducto(id, body) {
  const producto = await Producto.findByPk(id);
  if (!producto) throw new Error('Producto no encontrado');

  await producto.update({
    estiloProducto: body.estiloProducto,
    disponibilidadProducto: body.disponibilidadProducto,
    tamanoproducto: body.tamanoproducto,
    imagen: body.imagen,
    historial_precio_id: body.historialPrecios?.[0] || null 
  });

  if (body.catalogos) await producto.setCatalogos(body.catalogos);
  if (body.categorias) await producto.setCategorias(body.categorias);

  return buscarProductoPorId(id);
}

// Listar todos los productos
async function listarProductos() {
  const products = await Producto.findAll({
    include: [
      { model: HistorialPrecio, as: 'HistorialPrecio' },
      { model: Catalogo,        as: 'Catalogos', through: { attributes: [] } },
      { model: Categoria,       as: 'Categorias', through: { attributes: [] } }
    ],
    order: [['created_at', 'DESC']]
  });
  return products;
}

// Buscar un producto por su ID
async function buscarProductoPorId(id) {
  const producto = await Producto.findByPk(id, {
    include: [
      { model: HistorialPrecio, as: 'HistorialPrecio' },
      { model: Catalogo,        as: 'Catalogos', through: { attributes: [] } },
      { model: Categoria,       as: 'Categorias', through: { attributes: [] } }
    ]
  });
  if (!producto) throw new Error(`Producto con ID ${id} no encontrado`);
  return producto;
}

// Eliminar un producto por su ID
async function eliminarProducto(id) {
  const producto = await Producto.findByPk(id);
  if (!producto) throw new Error(`Producto con ID ${id} no encontrado`);

  await producto.destroy();
  return producto;
}

module.exports = {
  crearProducto,
  actualizarProducto,
  listarProductos,
  buscarProductoPorId,
  eliminarProducto
};
