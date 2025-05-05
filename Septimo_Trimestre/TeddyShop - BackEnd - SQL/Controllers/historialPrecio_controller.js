const logic = require('../Logic/historialPrecio_logic');
const { historialPrecioSchemaValidation } = require('../Validations/historialPrecio_validation');

console.log('[HistorialPrecio Controller] Cargado correctamente');

// Listar todos los historiales de precios
const listarHistorialPrecios = async (req, res) => {
  console.log('[Listar HistorialPrecio] Iniciando proceso...');
  try {
    const historiales = await logic.listarHistorialPrecios();
    if (historiales.length === 0) {
      console.log('[Listar HistorialPrecio] No se encontraron registros');
      return res.status(204).send();
    }
    console.log('[Listar HistorialPrecio] Registros encontrados:', historiales.length);
    res.json(historiales);
  } catch (err) {
    console.error('[Listar HistorialPrecio] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar historial de precios',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear un nuevo historial de precio
const crearHistorialPrecio = async (req, res) => {
  console.log('[Crear HistorialPrecio] Iniciando proceso...');
  const { error, value } = historialPrecioSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Crear HistorialPrecio] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    const nuevoHistorial = await logic.crearHistorialPrecio(value);
    console.log('[Crear HistorialPrecio] Historial creado:', nuevoHistorial.id);
    res.status(201).json(nuevoHistorial);
  } catch (err) {
    console.error('[Crear HistorialPrecio] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al crear historial de precio',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar un historial de precio
const actualizarHistorialPrecio = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar HistorialPrecio] ID:', id);
  const { error, value } = historialPrecioSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Actualizar HistorialPrecio] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    const actualizado = await logic.actualizarHistorialPrecio(id, value);
    console.log('[Actualizar HistorialPrecio] Actualizado ID:', id);
    res.json(actualizado);
  } catch (err) {
    console.error('[Actualizar HistorialPrecio] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error al actualizar historial de precio',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un historial por ID
const obtenerHistorialPrecioPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener HistorialPrecio] ID:', id);
  try {
    const historial = await logic.buscarHistorialPrecioPorId(id);
    res.json(historial);
  } catch (err) {
    console.error('[Obtener HistorialPrecio] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error al obtener historial de precio',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un historial
const eliminarHistorialPrecio = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar HistorialPrecio] ID:', id);
  try {
    const eliminado = await logic.eliminarHistorialPrecio(id);
    console.log('[Eliminar HistorialPrecio] Eliminado ID:', eliminado.id);
    res.json(eliminado);
  } catch (err) {
    console.error('[Eliminar HistorialPrecio] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error al eliminar historial de precio',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  listarHistorialPrecios,
  crearHistorialPrecio,
  actualizarHistorialPrecio,
  obtenerHistorialPrecioPorId,
  eliminarHistorialPrecio
};
