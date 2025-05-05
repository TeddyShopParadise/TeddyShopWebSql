// controllers/cliente_controller.js

const logic = require('../Logic/cliente_logic');
const { clienteSchemaValidation } = require('../Validations/cliente_validation');

// Listar todos los clientes
const listarClientes = async (req, res) => {
  console.log('[Listar Clientes] Iniciando proceso...');
  try {
    const clientes = await logic.listarClientes();
    if (clientes.length === 0) {
      console.log('[Listar Clientes] No se encontraron clientes');
      return res.status(204).send();
    }
    console.log('[Listar Clientes] Clientes encontrados:', clientes.length);
    res.json(clientes);
  } catch (err) {
    console.error('[Listar Clientes] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar clientes',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  console.log('[Crear Cliente] Iniciando proceso...');
  const { error, value } = clienteSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Crear Cliente] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Crear Cliente] Datos validados:', value);
    const nuevoCliente = await logic.crearCliente(value);
    console.log('[Crear Cliente] Cliente creado:', nuevoCliente.id);
    res.status(201).json(nuevoCliente);
  } catch (err) {
    console.error('[Crear Cliente] Error en el proceso:', err);
    if (err.message.includes('Ya existe un cliente')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar un cliente
const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar Cliente] ID:', id);

  const { error, value } = clienteSchemaValidation.validate(req.body, { abortEarly: false });
  if (error) {
    console.error('[Actualizar Cliente] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    const clienteActualizado = await logic.actualizarCliente(id, value);
    console.log('[Actualizar Cliente] Actualizado ID:', id);
    res.json(clienteActualizado);
  } catch (err) {
    console.error('[Actualizar Cliente] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un cliente por su ID
const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener Cliente] ID:', id);
  try {
    const cliente = await logic.buscarClientePorId(id);
    res.json(cliente);
  } catch (err) {
    console.error('[Obtener Cliente] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un cliente por su ID
const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar Cliente] ID:', id);
  try {
    const eliminado = await logic.eliminarCliente(id);
    console.log('[Eliminar Cliente] Eliminado ID:', eliminado.id);
    res.json(eliminado);
  } catch (err) {
    console.error('[Eliminar Cliente] Error en el proceso:', err);
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
  listarClientes,
  crearCliente,
  actualizarCliente,
  obtenerClientePorId,
  eliminarCliente
};
