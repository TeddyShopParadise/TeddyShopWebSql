// controllers/devoluciones_controller.js

const logic = require('../Logic/devoluciones_logic');
const { devolucionesSchemaValidation } = require('../Validations/devoluciones_validation');

// Listar todas las devoluciones
const listarDevoluciones = async (req, res) => {
  console.log('[Listar Devoluciones] Iniciando proceso...');
  try {
    const devoluciones = await logic.listarDevoluciones();
    if (devoluciones.length === 0) {
      console.log('[Listar Devoluciones] No se encontraron devoluciones');
      return res.status(204).send();
    }
    console.log('[Listar Devoluciones] Devoluciones encontradas:', devoluciones.length);
    res.json(devoluciones);
  } catch (err) {
    console.error('[Listar Devoluciones] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar devoluciones',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear una nueva devolución
const crearDevolucion = async (req, res) => {
  console.log('[Crear Devolución] Iniciando proceso...');
  const { error, value } = devolucionesSchemaValidation.validate(req.body, { abortEarly: false });
  if (error) {
    console.error('[Crear Devolución] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Crear Devolución] Datos enviados a lógica:', value);
    const nueva = await logic.crearDevolucion(value);
    console.log('[Crear Devolución] Devolución creada con ID:', nueva.id);
    res.status(201).json(nueva);
  } catch (err) {
    console.error('[Crear Devolución] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar una devolución
const actualizarDevolucion = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar Devolución] ID:', id);
  const { error, value } = devolucionesSchemaValidation.validate(req.body, { abortEarly: false });
  if (error) {
    console.error('[Actualizar Devolución] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Actualizar Devolución] Datos enviados a lógica:', value);
    const actualizada = await logic.actualizarDevolucion(id, value);
    console.log('[Actualizar Devolución] Devolución actualizada con ID:', id);
    res.json(actualizada);
  } catch (err) {
    console.error('[Actualizar Devolución] Error en el proceso:', err);
    if (err.message.includes('no encontrada')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener una devolución por ID
const obtenerDevolucionPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener Devolución] ID:', id);
  try {
    const devolucion = await logic.buscarDevolucionPorId(id);
    res.json(devolucion);
  } catch (err) {
    console.error('[Obtener Devolución] Error en el proceso:', err);
    if (err.message.includes('no encontrada')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar una devolución
const eliminarDevolucion = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar Devolución] ID:', id);
  try {
    const eliminada = await logic.eliminarDevolucion(id);
    console.log('[Eliminar Devolución] Devolución eliminada con ID:', eliminada.id);
    res.json(eliminada);
  } catch (err) {
    console.error('[Eliminar Devolución] Error en el proceso:', err);
    if (err.message.includes('no encontrada')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  listarDevoluciones,
  crearDevolucion,
  actualizarDevolucion,
  obtenerDevolucionPorId,
  eliminarDevolucion
};
