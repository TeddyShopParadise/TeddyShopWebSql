  // controllers/pedido_controller.js

  const logic = require('../Logic/pedido_logic');
  const { pedidoSchemaValidation } = require('../Validations/pedido_validation');

  // Listar todos los pedidos
  const listarPedidos = async (req, res) => {
    console.log('[Listar Pedidos] Iniciando proceso...');
    try {
      const pedidos = await logic.listarPedidos();
      if (pedidos.length === 0) {
        console.log('[Listar Pedidos] No se encontraron pedidos');
        return res.status(204).send();
      }
      console.log('[Listar Pedidos] Pedidos encontrados:', pedidos.length);
      res.json(pedidos);
    } catch (err) {
      console.error('[Listar Pedidos] Error en el proceso:', err);
      res.status(500).json({
        error: 'Error al listar pedidos',
        detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };

  // Crear un nuevo pedido
  const crearPedido = async (req, res) => {
    console.log('[Crear Pedido] Iniciando proceso...');
    const { error, value } = pedidoSchemaValidation.validate(req.body, { abortEarly: false });

    if (error) {
      console.error('[Crear Pedido] Validación fallida:', error.details);
      return res.status(400).json({
        error: 'Validación fallida',
        detalles: error.details.map(d => d.message)
      });
    }

    try {
      console.log('[Crear Pedido] Datos enviados a lógica:', value);
      const nuevoPedido = await logic.crearPedido(value);

      console.log('[Crear Pedido] Pedido creado con ID:', nuevoPedido.id);
      res.status(201).json(nuevoPedido);
    } catch (err) {
      console.error('[Crear Pedido] Error en el proceso:', err);
      res.status(500).json({
        error: 'Error interno del servidor',
        detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };

  // Actualizar un pedido
  const actualizarPedido = async (req, res) => {
    const { id } = req.params;
    const { _id, __v, ...resto } = req.body;

    console.log('[Actualizar Pedido] ID:', id);

    const { error, value } = pedidoSchemaValidation.validate(resto, { abortEarly: false });

    if (error) {
      console.error('[Actualizar Pedido] Validación fallida:', error.details);
      return res.status(400).json({
        error: 'Validación fallida',
        detalles: error.details.map(d => d.message)
      });
    }

    try {
      console.log('[Actualizar Pedido] Datos enviados a lógica:', value);
      const pedidoActualizado = await logic.actualizarPedido(id, value);

      if (!pedidoActualizado) {
        console.log('[Actualizar Pedido] Pedido no encontrado');
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      console.log('[Actualizar Pedido] Actualizado ID:', id);
      res.json(pedidoActualizado);
    } catch (err) {
      console.error('[Actualizar Pedido] Error en el proceso:', err);
      res.status(500).json({
        error: 'Error interno del servidor',
        detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };

  // Obtener un pedido por ID
  const obtenerPedidoPorId = async (req, res) => {
    const { id } = req.params;
    console.log('[Obtener Pedido] ID:', id);
    try {
      const pedido = await logic.buscarPedidoPorId(id);
      res.json(pedido);
    } catch (err) {
      console.error('[Obtener Pedido] Error en el proceso:', err);
      if (err.message.includes('no encontrado')) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({
        error: 'Error interno del servidor',
        detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };

  // Eliminar un pedido
  const eliminarPedido = async (req, res) => {
    const { id } = req.params;
    console.log('[Eliminar Pedido] ID:', id);
    try {
      const eliminado = await logic.eliminarPedido(id);
      console.log('[Eliminar Pedido] Eliminado ID:', eliminado.id);
      res.json(eliminado);
    } catch (err) {
      console.error('[Eliminar Pedido] Error en el proceso:', err);
      if (err.message.includes('no encontrado')) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({
        error: 'Error interno del servidor',
        detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };

  // Actualizar estado del pedido
  const actualizarEstadoPedido = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    console.log('[Actualizar Estado] ID:', id, '| Estado:', estado);

    const estadosValidos = ['cancelado', 'en_proceso', 'realizado'];

    if (!estadosValidos.includes(estado)) {
      console.warn('[Actualizar Estado] Estado inválido recibido');
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: cancelado, en_proceso o realizado'
      });
    }

    try {
      const pedidoActualizado = await logic.actualizarEstado(id, estado);
      if (!pedidoActualizado) {
        console.log('[Actualizar Estado] Pedido no encontrado');
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      console.log('[Actualizar Estado] Estado actualizado con éxito');
      res.json(pedidoActualizado);
    } catch (err) {
      console.error('[Actualizar Estado] Error en el proceso:', err);
      res.status(500).json({
        error: 'Error al actualizar el estado del pedido',
        detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };

  module.exports = {
    listarPedidos,
    crearPedido,
    actualizarPedido,
    obtenerPedidoPorId,
    eliminarPedido,
    actualizarEstadoPedido
  };
