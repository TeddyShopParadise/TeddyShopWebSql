// controllers/movimiento_controller.js

const logic = require('../Logic/movimiento_logic');
const { movimientoSchemaValidation } = require('../Validations/movimiento_validation');

// Listar todos los movimientos
const listarMovimientos = async (req, res) => {
  console.log('[Listar Movimientos] Iniciando proceso...');
  try {
    const movimientos = await logic.listarMovimientos();
    if (movimientos.length === 0) {
      console.log('[Listar Movimientos] No se encontraron movimientos');
      return res.status(204).send();
    }
    console.log('[Listar Movimientos] Movimientos encontrados:', movimientos.length);
    res.json(movimientos);
  } catch (err) {
    console.error('[Listar Movimientos] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar movimientos',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear un nuevo movimiento
const crearMovimiento = async (req, res) => {
  console.log('[Crear Movimiento] Iniciando proceso...');
  const { error, value } = movimientoSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Crear Movimiento] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Crear Movimiento] Datos enviados a lógica:', value);
    const nuevoMovimiento = await logic.crearMovimiento(value);
    console.log('[Crear Movimiento] Movimiento creado con ID:', nuevoMovimiento.id);
    res.status(201).json(nuevoMovimiento);
  } catch (err) {
    console.error('[Crear Movimiento] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar un movimiento
const actualizarMovimiento = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar Movimiento] ID:', id);

  const { error, value } = movimientoSchemaValidation.validate(req.body, { abortEarly: false });
  if (error) {
    console.error('[Actualizar Movimiento] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Actualizar Movimiento] Datos enviados a lógica:', value);
    const movimientoActualizado = await logic.actualizarMovimiento(id, value);
    if (!movimientoActualizado) {
      console.log('[Actualizar Movimiento] Movimiento no encontrado');
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    console.log('[Actualizar Movimiento] Actualizado ID:', id);
    res.json(movimientoActualizado);
  } catch (err) {
    console.error('[Actualizar Movimiento] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un movimiento por ID
const obtenerMovimientoPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener Movimiento] ID:', id);
  try {
    const movimiento = await logic.buscarMovimientoPorId(id);
    res.json(movimiento);
  } catch (err) {
    console.error('[Obtener Movimiento] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un movimiento
const eliminarMovimiento = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar Movimiento] ID:', id);
  try {
    const movimientoEliminado = await logic.eliminarMovimiento(id);
    console.log('[Eliminar Movimiento] Eliminado ID:', movimientoEliminado.id);
    res.json(movimientoEliminado);
  } catch (err) {
    console.error('[Eliminar Movimiento] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  listarMovimientos,
  crearMovimiento,
  actualizarMovimiento,
  obtenerMovimientoPorId,
  eliminarMovimiento
};
