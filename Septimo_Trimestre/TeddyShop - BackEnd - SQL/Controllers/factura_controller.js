// controllers/factura_controller.js

const logic = require('../Logic/factura_logic');
const { facturaSchemaValidation } = require('../Validations/factura_validation');
const db = require('../modelsSQL');
const Factura = db.Factura;
const Pedido = db.Pedido;

// Listar todas las facturas
const listarFacturas = async (req, res) => {
  console.log('[Listar Facturas] Iniciando proceso...');
  try {
    const facturas = await logic.listarFacturas();
    if (facturas.length === 0) {
      console.log('[Listar Facturas] No se encontraron facturas');
      return res.status(204).send();
    }
    console.log('[Listar Facturas] Facturas encontradas:', facturas.length);
    res.json(facturas);
  } catch (err) {
    console.error('[Listar Facturas] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar facturas',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear nueva factura
const crearFactura = async (req, res) => {
  console.log('[Crear Factura] Iniciando proceso...');
  const { error, value } = facturaSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Crear Factura] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  // Mapear posibles arrays a valores escalares
  const body = {
    pedido_id: value.pedido_id ?? (Array.isArray(value.pedido) ? value.pedido[0] : undefined),
    cliente_id: value.cliente_id ?? (Array.isArray(value.cliente) ? value.cliente[0] : undefined),
    metodopago_id: value.metodopago_id ?? (Array.isArray(value.metodoPago) ? value.metodoPago[0] : undefined),
    detallesFactura: value.detallesFactura
  };

  try {
    console.log('[Crear Factura] Datos enviados a lógica:', body);
    const nuevaFactura = await logic.crearFactura(body);
    console.log('[Crear Factura] Factura creada con ID:', nuevaFactura.id);
    res.status(201).json(nuevaFactura);
  } catch (err) {
    console.error('[Crear Factura] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar factura
const actualizarFactura = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar Factura] ID:', id);
  const { error, value } = facturaSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Actualizar Factura] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  // Mapear posibles arrays a valores escalares
  const body = {
    pedido_id: value.pedido_id ?? (Array.isArray(value.pedido) ? value.pedido[0] : undefined),
    cliente_id: value.cliente_id ?? (Array.isArray(value.cliente) ? value.cliente[0] : undefined),
    metodopago_id: value.metodopago_id ?? (Array.isArray(value.metodoPago) ? value.metodoPago[0] : undefined),
    detallesFactura: value.detallesFactura,
    fechaCreacionFactura: value.fechaCreacionFactura,
    horaCreacionFactura: value.horaCreacionFactura
  };

  try {
    console.log('[Actualizar Factura] Datos enviados a lógica:', body);
    const facturaActualizada = await logic.actualizarFactura(id, body);
    console.log('[Actualizar Factura] Factura actualizada con ID:', id);
    res.json(facturaActualizada);
  } catch (err) {
    console.error('[Actualizar Factura] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener factura por ID
const obtenerFacturaPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener Factura] ID:', id);
  try {
    const factura = await logic.buscarFacturaPorId(id);
    res.json(factura);
  } catch (err) {
    console.error('[Obtener Factura] Error en el proceso:', err);
    if (err.message.includes('no encontrada')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar factura
const eliminarFactura = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar Factura] ID:', id);
  try {
    const facturaEliminada = await logic.eliminarFactura(id);
    console.log('[Eliminar Factura] Factura eliminada ID:', facturaEliminada.id);
    res.json(facturaEliminada);
  } catch (err) {
    console.error('[Eliminar Factura] Error en el proceso:', err);
    if (err.message.includes('no encontrada')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Generar factura desde pedido
const generarFacturaDesdePedido = async (req, res) => {
  const { pedidoId } = req.params;
  console.log('[Generar Factura] Desde Pedido ID:', pedidoId);
  try {
    const pedido = await Pedido.findByPk(pedidoId, {
      include: ['detallesPedido', 'cliente']
    });
    if (!pedido) {
      console.warn('[Generar Factura] Pedido no encontrado');
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const body = {
      pedido_id: pedido.id,
      cliente_id: pedido.cliente.id,
      metodopago_id: Array.isArray(req.body.metodopago_id) ? req.body.metodopago_id[0] : req.body.metodopago_id,
      detallesFactura: req.body.detallesFactura
    };

    const factura = await logic.crearFactura(body);
    console.log('[Generar Factura] Factura generada ID:', factura.id);
    res.status(201).json(factura);
  } catch (err) {
    console.error('[Generar Factura] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Buscar factura por pedido
const buscarFacturaPorPedido = async (req, res) => {
  const { pedidoId } = req.params;
  console.log('[Buscar Factura por Pedido] Pedido ID:', pedidoId);
  try {
    const factura = await Factura.findOne({
      where: { pedido_id: pedidoId },
      include: ['pedido', 'cliente', 'metodoPago', 'detallesFactura']
    });
    if (!factura) {
      console.warn('[Buscar Factura por Pedido] No se encontró factura');
      return res.status(404).json({ error: 'No se encontró factura para este pedido' });
    }
    res.json(factura);
  } catch (err) {
    console.error('[Buscar Factura por Pedido] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  listarFacturas,
  crearFactura,
  actualizarFactura,
  obtenerFacturaPorId,
  eliminarFactura,
  generarFacturaDesdePedido,
  buscarFacturaPorPedido
};
