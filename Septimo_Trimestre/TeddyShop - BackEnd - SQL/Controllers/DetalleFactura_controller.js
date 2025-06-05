// controllers/detalleFactura_controller.js

const logic = require('../Logic/DetalleFactura_logic');
const { detalleFacturaSchemaValidation } = require('../Validations/detalleFactura_validation');

// Listar todos los detalles de factura
const listarDetallesFactura = async (req, res) => {
  console.log('[Listar DetallesFactura] Iniciando proceso...');
  try {
    const detalles = await logic.listarDetallesFactura();
    if (detalles.length === 0) {
      console.log('[Listar DetallesFactura] No se encontraron detalles');
      return res.status(204).send();
    }
    console.log('[Listar DetallesFactura] Detalles encontrados:', detalles.length);
    res.json(detalles);
  } catch (err) {
    console.error('[Listar DetallesFactura] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar detalles de factura',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear un nuevo detalle de factura
const crearDetalleFactura = async (req, res) => {
  console.log('[Crear DetalleFactura] Iniciando proceso...');
  const { error, value } = detalleFacturaSchemaValidation.validate(req.body, { abortEarly: false });
  if (error) {
    console.error('[Crear DetalleFactura] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Crear DetalleFactura] Datos enviados a lógica:', value);
    const nuevo = await logic.crearDetalleFactura(value);
    console.log('[Crear DetalleFactura] Detalle creado con ID:', nuevo.id || nuevo.detallefacturaId);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('[Crear DetalleFactura] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar un detalle de factura
const actualizarDetalleFactura = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar DetalleFactura] ID:', id);

  const { error, value } = detalleFacturaSchemaValidation.validate(req.body, { abortEarly: false });
  if (error) {
    console.error('[Actualizar DetalleFactura] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Actualizar DetalleFactura] Datos enviados a lógica:', value);
    const actualizado = await logic.actualizarDetalleFactura(id, value);
    if (!actualizado) {
      console.log('[Actualizar DetalleFactura] Detalle no encontrado');
      return res.status(404).json({ error: 'Detalle de factura no encontrado' });
    }
    console.log('[Actualizar DetalleFactura] Actualizado ID:', id);
    res.json(actualizado);
  } catch (err) {
    console.error('[Actualizar DetalleFactura] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un detalle de factura por ID
const obtenerDetalleFacturaPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener DetalleFactura] ID:', id);
  try {
    const detalle = await logic.buscarDetalleFacturaPorId(id);
    res.json(detalle);
  } catch (err) {
    console.error('[Obtener DetalleFactura] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un detalle de factura
const eliminarDetalleFactura = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar DetalleFactura] ID:', id);
  try {
    const eliminado = await logic.eliminarDetalleFactura(id);
    console.log('[Eliminar DetalleFactura] Eliminado ID:', eliminado.id || eliminado.detallefacturaId);
    res.json(eliminado);
  } catch (err) {
    console.error('[Eliminar DetalleFactura] Error en el proceso:', err);
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
  listarDetallesFactura,
  crearDetalleFactura,
  actualizarDetalleFactura,
  obtenerDetalleFacturaPorId,
  eliminarDetalleFactura
};