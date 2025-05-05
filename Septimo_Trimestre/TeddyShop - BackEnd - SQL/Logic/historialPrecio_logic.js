const db = require('../modelsSQL');
const HistorialPrecio = db.HistorialPrecio;
const Producto = db.Producto;

// Crear un nuevo historial de precio
async function crearHistorialPrecio(body) {
    const historialPrecio = await HistorialPrecio.create({
      precio: body.precio,
      fechaInicio: body.fechaInicio,
      fechaFin: body.fechaFin,
      estadoPrecio: body.estadoPrecio,
      productoId: body.productoId  
    });
  
    return historialPrecio;
  }
// Actualizar un historial de precio
async function actualizarHistorialPrecio(id, body) {
    const historialPrecio = await HistorialPrecio.findByPk(id);
    if (!historialPrecio) throw new Error(`Historial de precio con ID ${id} no encontrado`);
  
    await historialPrecio.update({
      precio: body.precio,
      fechaInicio: body.fechaInicio,
      fechaFin: body.fechaFin,
      estadoPrecio: body.estadoPrecio,
      productoId: body.productoId  
    });
  
    return historialPrecio;
  }

// Listar todos los historiales de precios
async function listarHistorialPrecios() {
  const historiales = await HistorialPrecio.findAll({
    order: [['fechaInicio', 'DESC']]
  });
  return historiales;
}

// Buscar un historial de precio por su ID
async function buscarHistorialPrecioPorId(id) {
  const historial = await HistorialPrecio.findByPk(id, {
  });

  if (!historial) throw new Error(`Historial de precio con ID ${id} no encontrado`);
  return historial;
}

// Eliminar un historial de precio
async function eliminarHistorialPrecio(id) {
  const historial = await HistorialPrecio.findByPk(id);
  if (!historial) throw new Error(`Historial de precio con ID ${id} no encontrado`);

  await historial.destroy();
  return historial;
}

module.exports = {
  crearHistorialPrecio,
  actualizarHistorialPrecio,
  listarHistorialPrecios,
  buscarHistorialPrecioPorId,
  eliminarHistorialPrecio
};
