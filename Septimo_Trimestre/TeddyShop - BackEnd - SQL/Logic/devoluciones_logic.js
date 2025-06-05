const db = require('../modelsSQL');
const { Op } = require('sequelize');

const Devoluciones = db.Devoluciones;
const Inventario   = db.Inventario;

// Crear nueva devolución
async function crearDevolucion(body) {
  // Crear registro de devolución
  const devolucion = await Devoluciones.create({
    detalleDevolucion: body.detalleDevolucion,
    // Suponemos que body.inventarios es arreglo de inventario IDs
  });

  // Asociar devoluciones <-> inventarios (muchos a muchos o hasMany)
  if (Array.isArray(body.inventarios) && body.inventarios.length) {
    await devolucion.setInventarios(body.inventarios);
  }

  return buscarDevolucionPorId(devolucion.id);
}

// Actualizar una devolución
async function actualizarDevolucion(id, body) {
  const devolucion = await Devoluciones.findByPk(id);
  if (!devolucion) throw new Error(`Devolución con ID ${id} no encontrada`);

  await devolucion.update({ detalleDevolucion: body.detalleDevolucion });

  if (Array.isArray(body.inventarios)) {
    await devolucion.setInventarios(body.inventarios);
  }

  return buscarDevolucionPorId(id);
}

// Listar todas las devoluciones
async function listarDevoluciones() {
  const devoluciones = await Devoluciones.findAll({
    include: [
      { model: Inventario, as: 'inventarios' }
    ],
    order: [['id', 'DESC']]
  });
  return devoluciones;
}

// Buscar devolución por ID
async function buscarDevolucionPorId(id) {
  const devolucion = await Devoluciones.findByPk(id, {
    include: [
      { model: Inventario, as: 'inventarios' }
    ]
  });
  if (!devolucion) throw new Error(`Devolución con ID ${id} no encontrada`);
  return devolucion;
}

// Eliminar devolución
async function eliminarDevolucion(id) {
  const devolucion = await Devoluciones.findByPk(id);
  if (!devolucion) throw new Error(`Devolución con ID ${id} no encontrada`);

  await devolucion.destroy();
  return devolucion;
}

module.exports = {
  crearDevolucion,
  actualizarDevolucion,
  listarDevoluciones,
  buscarDevolucionPorId,
  eliminarDevolucion
};
