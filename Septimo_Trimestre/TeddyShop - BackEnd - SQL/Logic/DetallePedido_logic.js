// Logic/DetallePedido_logic.js
const db = require('../modelsSQL');
const { Op } = require('sequelize');

const DetallePedido = db.DetallePedido;
const Pedido = db.Pedido;
const Producto = db.Producto;
const Inventario = db.Inventario;
const Movimiento = db.Movimiento;
const sequelize = db.sequelize;

// Crear un detalle de pedido, ajustar inventario y registrar movimiento
async function crearDetallePedido(body) {
  const t = await sequelize.transaction();
  try {
    console.log('Procesando datos en lógica:', body);
    
    // 1. Verificar producto usando el campo correcto
    const producto = await Producto.findByPk(body.idproducto_id, { transaction: t });
    if (!producto) throw new Error(`Producto con ID ${body.idproducto_id} no encontrado`);

    // 2. Verificar inventario
    const inventario = await Inventario.findOne({
      where: { idproducto_id: body.idproducto_id },
      transaction: t
    });

    if (!inventario) throw new Error('Inventario no encontrado');
    if (inventario.stock < body.cantidadDetallePedido) throw new Error('Stock insuficiente');

    // 3. Crear detallePedido con los nombres de campo correctos
    const detalle = await DetallePedido.create({
      precioDetallePedido: body.precioDetallePedido,
      cantidadDetallePedido: body.cantidadDetallePedido,
      idpedido_id: body.idPedido,        // Mapear desde idPedido a idpedido_id
      idproducto_id: body.idproducto_id  // Usar directamente idproducto_id
    }, { transaction: t });

    // 4. Registrar movimiento
    await Movimiento.create({
      fecha: new Date(),
      cantidadVendida: body.cantidadDetallePedido,
      cantidadIngreso: 0,
      inventario_id: inventario.id
    }, { transaction: t });

    // 5. Actualizar inventario
    inventario.stock -= body.cantidadDetallePedido;
    await inventario.save({ transaction: t });

    await t.commit();
    return detalle;
  } catch (err) {
    await t.rollback();
    console.error('Error en lógica de detalles:', err);
    throw err;
  }
}

// Actualizar un detalle de pedido
async function actualizarDetallePedido(id, body) {
  const detalle = await DetallePedido.findByPk(id);
  if (!detalle) throw new Error(`DetallePedido con ID ${id} no encontrado`);

  await detalle.update({
    precioDetallePedido: body.precioDetallePedido,
    cantidadDetallePedido: body.cantidadDetallePedido,
    idpedido_id: body.idPedido,
    idproducto_id: body.idproducto_id
  });
  return detalle;
}

// Listar todos los detalles de pedido
async function listarDetallesPedido() {
  const detalles = await DetallePedido.findAll({
    include: [
      { model: Pedido, as: 'pedido', attributes: ['nombrecomprador'] },
      { model: Producto, as: 'producto', attributes: ['id','tamanoproducto'] }
    ],
    order: [['id', 'DESC']]
  });
  return detalles;
}

// Buscar detalle por ID
async function buscarDetallePedidoPorId(id) {
  const detalle = await DetallePedido.findByPk(id, {
    include: [
      { model: Pedido, as: 'pedido', attributes: ['nombrecomprador'] },
      { model: Producto, as: 'producto', attributes: ['id','tamanoproducto'] }
    ]
  });
  if (!detalle) throw new Error(`DetallePedido con ID ${id} no encontrado`);
  return detalle;
}

// Eliminar detalle de pedido
async function eliminarDetallePedido(id) {
  const detalle = await DetallePedido.findByPk(id);
  if (!detalle) throw new Error(`DetallePedido con ID ${id} no encontrado`);
  await detalle.destroy();
  return detalle;
}

module.exports = {
  crearDetallePedido,
  actualizarDetallePedido,
  listarDetallesPedido,
  buscarDetallePedidoPorId,
  eliminarDetallePedido
};