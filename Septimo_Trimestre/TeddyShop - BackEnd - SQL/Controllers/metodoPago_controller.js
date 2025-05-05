// controllers/metodoPago_controller.js

const logic = require('../Logic/metodoPago_logic');
const { metodoPagoSchemaValidation } = require('../Validations/metodoPago_validation');

// Listar todos los métodos de pago
const listarMetodosPago = async (req, res) => {
  console.log('[Listar Métodos de Pago] Iniciando proceso...');
  try {
    const metodos = await logic.listarMetodosPago();
    if (metodos.length === 0) {
      console.log('[Listar Métodos de Pago] No se encontraron métodos');
      return res.status(204).send();
    }
    console.log('[Listar Métodos de Pago] Métodos encontrados:', metodos.length);
    res.json(metodos);
  } catch (err) {
    console.error('[Listar Métodos de Pago] Error:', err);
    res.status(500).json({
      error: 'Error al listar métodos de pago',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear nuevo método de pago
const crearMetodoPago = async (req, res) => {
  console.log('[Crear Método de Pago] Iniciando proceso...');
  const { error, value } = metodoPagoSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Crear Método de Pago] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    const nuevoMetodo = await logic.crearMetodoPago(value);
    console.log('[Crear Método de Pago] Creado:', nuevoMetodo._id || nuevoMetodo.id);
    res.status(201).json(nuevoMetodo);
  } catch (err) {
    console.error('[Crear Método de Pago] Error:', err);
    res.status(500).json({
      error: 'Error al crear método de pago',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar método de pago
const actualizarMetodoPago = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar Método de Pago] ID:', id);
  const { _id, __v, ...resto } = req.body;

  const { error, value } = metodoPagoSchemaValidation.validate(resto, { abortEarly: false });

  if (error) {
    console.error('[Actualizar Método de Pago] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    const actualizado = await logic.actualizarMetodoPago(id, value);
    if (!actualizado) {
      console.log('[Actualizar Método de Pago] No encontrado');
      return res.status(404).json({ error: 'Método de pago no encontrado' });
    }

    console.log('[Actualizar Método de Pago] Actualizado:', id);
    res.json(actualizado);
  } catch (err) {
    console.error('[Actualizar Método de Pago] Error:', err);
    res.status(500).json({
      error: 'Error al actualizar método de pago',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un método de pago por ID
const obtenerMetodoPagoPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener Método de Pago] ID:', id);
  try {
    const metodo = await logic.buscarMetodoPagoPorId(id);
    res.json(metodo);
  } catch (err) {
    console.error('[Obtener Método de Pago] Error:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error al obtener método de pago',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un método de pago por ID
const eliminarMetodoPago = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar Método de Pago] ID:', id);
  try {
    const eliminado = await logic.eliminarMetodoPago(id);
    console.log('[Eliminar Método de Pago] Eliminado:', eliminado._id || eliminado.id);
    res.json(eliminado);
  } catch (err) {
    console.error('[Eliminar Método de Pago] Error:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error al eliminar método de pago',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  listarMetodosPago,
  crearMetodoPago,
  actualizarMetodoPago,
  obtenerMetodoPagoPorId,
  eliminarMetodoPago
};
