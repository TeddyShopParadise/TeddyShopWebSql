const db = require('../modelsSQL');
const { Op, Sequelize } = require('sequelize');

const Movimiento = db.Movimiento;
const Inventario = db.Inventario;

// Crear nuevo movimiento
async function crearMovimiento(body) {
  // Usar transacción para asegurar consistencia
  return await db.sequelize.transaction(async (t) => {
    // Crear registro de movimiento
    const movimiento = await Movimiento.create({
      fecha: body.fecha,
      cantidadIngreso: body.cantidadIngreso,
      cantidadVendida: body.cantidadVendida,
      inventario_id: body.inventario_id
    }, { transaction: t });

    // Actualizar stock en inventario
    const inventario = await Inventario.findByPk(body.inventario_id, { transaction: t });
    if (!inventario) {
      throw new Error('Inventario no encontrado para el movimiento');
    }

    const nuevoStock = inventario.stock + body.cantidadIngreso - body.cantidadVendida;
    await inventario.update({ stock: nuevoStock }, { transaction: t });

    return movimiento;
  });
}

// Actualizar un movimiento existente
async function actualizarMovimiento(id, body) {
  return await db.sequelize.transaction(async (t) => {
    const movimientoAnterior = await Movimiento.findByPk(id, { transaction: t });
    if (!movimientoAnterior) {
      throw new Error(`Movimiento con ID ${id} no encontrado`);
    }

    const inventario = await Inventario.findByPk(movimientoAnterior.inventario_id, { transaction: t });
    if (!inventario) {
      throw new Error('Inventario no encontrado para revertir movimiento');
    }

    // Revertir efecto previo
    let stockRevertido = inventario.stock - movimientoAnterior.cantidadIngreso + movimientoAnterior.cantidadVendida;

    // Aplicar nuevo efecto
    const stockActualizado = stockRevertido + body.cantidadIngreso - body.cantidadVendida;
    await inventario.update({ stock: stockActualizado }, { transaction: t });

    // Actualizar movimiento
    await movimientoAnterior.update({
      fecha: body.fecha,
      cantidadIngreso: body.cantidadIngreso,
      cantidadVendida: body.cantidadVendida,
      inventario_id: body.inventario_id
    }, { transaction: t });

    return movimientoAnterior;
  });
}

// Listar todos los movimientos con su inventario asociado
async function listarMovimientos() {
  return await Movimiento.findAll({
    include: [{ model: Inventario, as: 'inventario' }],
    order: [['fecha', 'DESC']]
  });
}

// Buscar movimiento por ID
async function buscarMovimientoPorId(id) {
  const movimiento = await Movimiento.findByPk(id, {
    include: [{ model: Inventario, as: 'inventario' }]
  });
  if (!movimiento) throw new Error(`Movimiento con ID ${id} no encontrado`);
  return movimiento;
}

// Eliminar movimiento y ajustar stock
async function eliminarMovimiento(id) {
  return await db.sequelize.transaction(async (t) => {
    const movimiento = await Movimiento.findByPk(id, { transaction: t });
    if (!movimiento) throw new Error(`Movimiento con ID ${id} no encontrado`);

    const inventario = await Inventario.findByPk(movimiento.inventario_id, { transaction: t });
    if (inventario) {
      const stockAjustado = inventario.stock - movimiento.cantidadIngreso + movimiento.cantidadVendida;
      await inventario.update({ stock: stockAjustado }, { transaction: t });
    }

    await movimiento.destroy({ transaction: t });
    return movimiento;
  });
}

module.exports = {
  crearMovimiento,
  actualizarMovimiento,
  listarMovimientos,
  buscarMovimientoPorId,
  eliminarMovimiento
};
