// controllers/detallePedido_controller.js

const logic = require('../Logic/DetallePedido_logic');
const { detallePedidoSchemaValidation } = require('../Validations/detallePedido_validation');

// Listar todos los detalles de pedido
const listarDetallesPedido = async (req, res) => {
  console.log('[Listar DetallesPedido] Iniciando proceso...');
  try {
    const detalles = await logic.listarDetallesPedido();
    if (detalles.length === 0) {
      console.log('[Listar DetallesPedido] No se encontraron detalles');
      return res.status(204).send();
    }
    console.log('[Listar DetallesPedido] Detalles encontrados:', detalles.length);
    res.json(detalles);
  } catch (err) {
    console.error('[Listar DetallesPedido] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar detalles de pedido',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear un nuevo detalle de pedido
// Crear un detalle de pedido
const crearDetallePedido = async (req, res) => {
  try {
    // 1. Validar la solicitud primero
    const { error, value } = detallePedidoSchemaValidation.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errores = error.details.map(err => err.message);
      console.log('Errores de validación:', errores);
      return res.status(400).json({ error: 'Validación fallida', detalles: errores });
    }
    
    console.log('Datos validados:', value);
    
    // 2. Preparar los datos para pasarlos a la lógica
    // Asegurar que los nombres de campos coincidan exactamente con lo que espera DetallePedido_logic
    const datosDetalle = {
      precioDetallePedido: value.precioDetallePedido,
      cantidadDetallePedido: value.cantidadDetallePedido,
      idPedido: value.idPedido,         // Recibido de la validación
      idproducto_id: value.idproducto_id // Recibido de la validación y pasado tal cual
    };
    
    // 3. Llamar a la lógica de negocio
    const detalle = await logic.crearDetallePedido(datosDetalle);
    
    // 4. Devolver respuesta exitosa
    return res.status(201).json(detalle);
  } catch (err) {
    console.error('Error al crear detalle de pedido:', err);
    return res.status(500).json({ error: err.message });
  }
};
// Actualizar un detalle de pedido
const actualizarDetallePedido = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar DetallePedido] ID:', id);
  const { error, value } = detallePedidoSchemaValidation.validate(req.body, { abortEarly: false });
  if (error) {
    console.error('[Actualizar DetallePedido] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Actualizar DetallePedido] Datos enviados a lógica:', value);
    // Ya no necesitamos mapeo adicional, los nombres ya coinciden
    const actualizado = await logic.actualizarDetallePedido(id, value);
    console.log('[Actualizar DetallePedido] Actualizado ID:', id);
    res.json(actualizado);
  } catch (err) {
    console.error('[Actualizar DetallePedido] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un detalle de pedido por ID
const obtenerDetallePedidoPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener DetallePedido] ID:', id);
  try {
    const detalle = await logic.buscarDetallePedidoPorId(id);
    res.json(detalle);
  } catch (err) {
    console.error('[Obtener DetallePedido] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un detalle de pedido
const eliminarDetallePedido = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar DetallePedido] ID:', id);
  try {
    const eliminado = await logic.eliminarDetallePedido(id);
    console.log('[Eliminar DetallePedido] Eliminado ID:', eliminado.id);
    res.json(eliminado);
  } catch (err) {
    console.error('[Eliminar DetallePedido] Error en el proceso:', err);
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
  listarDetallesPedido,
  crearDetallePedido,
  actualizarDetallePedido,
  obtenerDetallePedidoPorId,
  eliminarDetallePedido
};