const db = require('../modelsSQL');
const { Op } = require('sequelize');

const Inventario = db.Inventario;
const Movimiento  = db.Movimiento;
const sequelize   = db.sequelize;

// Crear un nuevo inventario y registrar movimiento inicial
async function crearInventario(body) {
  // Validaciones de negocio
  if (body.precioVenta <= 0 || body.precioCompra <= 0) {
    throw new Error('Los precios deben ser valores positivos');
  }
  if (body.precioVenta <= body.precioCompra) {
    throw new Error('El precio de venta debe ser mayor al precio de compra');
  }
  if (body.stockMinimo > body.stockMaximo) {
    throw new Error('El stock mínimo no puede ser mayor al stock máximo');
  }

  const t = await sequelize.transaction();
  try {
    // Crear inventario
    const inventario = await Inventario.create({
      stockMinimo:   body.stockMinimo,
      precioVenta:   body.precioVenta,
      precioCompra:  body.precioCompra,
      stock:         body.stock,
      stockMaximo:   body.stockMaximo,
      idproducto_id: body.idProducto,
      iddevolucion_id: body.idDevolucion || null
    }, { transaction: t });

    // Movimiento inicial
    const movimiento = await Movimiento.create({
      fecha:           new Date(),
      cantidadIngreso: body.stock,
      cantidadVendida: 0,
      inventario_id:   inventario.id
    }, { transaction: t });

    await t.commit();
    return buscarInventarioPorId(inventario.id);
  } catch (err) {
    await t.rollback();
    console.error('Error creando inventario y movimiento inicial:', err);
    throw err;
  }
}

// Actualizar inventario
async function actualizarInventario(id, body) {
  const inventario = await Inventario.findByPk(id);
  if (!inventario) throw new Error(`Inventario con ID ${id} no encontrado`);

  await inventario.update({
    stockMinimo:   body.stockMinimo,
    precioVenta:   body.precioVenta,
    precioCompra:  body.precioCompra,
    stock:         body.stock,
    stockMaximo:   body.stockMaximo,
    iddevolucion_id: body.idDevolucion || inventario.iddevolucion_id,
    idproducto_id: body.idProducto,
  });

  return buscarInventarioPorId(id);
}

// Listar inventarios con relaciones
async function listarInventarios() {
  const items = await Inventario.findAll({
    include: [
      { model: db.Devoluciones, as: 'devolucion' },
      { model: db.Producto,    as: 'producto' },
      { model: Movimiento,     as: 'movimientos' }
    ],
    order: [['id', 'DESC']]
  });
  return items;
}

// Buscar inventario por ID
async function buscarInventarioPorId(id) {
  const inv = await Inventario.findByPk(id, {
    include: [
      { model: db.Devoluciones, as: 'devolucion' },
      { model: db.Producto,    as: 'producto' },
      { model: Movimiento,     as: 'movimientos' }
    ]
  });
  if (!inv) throw new Error(`Inventario con ID ${id} no encontrado`);
  return inv;
}

// Eliminar inventario
async function eliminarInventario(id) {
  const inv = await Inventario.findByPk(id);
  if (!inv) throw new Error(`Inventario con ID ${id} no encontrado`);
  await inv.destroy();
  return inv;
}

// Obtener inventario por idProducto
async function obtenerInventarioPorProducto(idProducto) {
  const inv = await Inventario.findOne({
    where: { idproducto_id: idProducto },
    include: [ { model: Movimiento, as: 'movimientos' } ]
  });
  return inv;
}

module.exports = {
  crearInventario,
  actualizarInventario,
  listarInventarios,
  buscarInventarioPorId,
  eliminarInventario,
  obtenerInventarioPorProducto
};
