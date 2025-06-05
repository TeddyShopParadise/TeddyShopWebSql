// controllers/inventario_controller.js

const logic = require('../Logic/inventario_logic');
const { inventariosSchemaValidation } = require('../Validations/inventario_validation');

// Listar todos los inventarios
const listarInventarios = async (req, res) => {
  console.log('[Listar Inventarios] Iniciando proceso...');
  try {
    const inventarios = await logic.listarInventarios();
    if (inventarios.length === 0) {
      console.log('[Listar Inventarios] No se encontraron registros');
      return res.status(204).send();
    }
    console.log('[Listar Inventarios] Inventarios encontrados:', inventarios.length);
    res.json(inventarios);
  } catch (err) {
    console.error('[Listar Inventarios] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar inventarios',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear un nuevo inventario
const crearInventario = async (req, res) => {
  console.log('[Crear Inventario] Iniciando proceso...');
  const { error, value } = inventariosSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Crear Inventario] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Crear Inventario] Datos validados:', value);
    const nuevoInventario = await logic.crearInventario(value);
    console.log('[Crear Inventario] Inventario creado con ID:', nuevoInventario.id);
    res.status(201).json(nuevoInventario);
  } catch (err) {
    console.error('[Crear Inventario] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar un inventario
const actualizarInventario = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar Inventario] ID:', id);
  const { _id, __v, ...resto } = req.body;

  const { error, value } = inventariosSchemaValidation.validate(resto, { abortEarly: false });

  if (error) {
    console.error('[Actualizar Inventario] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Actualizar Inventario] Datos enviados a lógica:', value);
    const inventarioActualizado = await logic.actualizarInventario(id, value);

    if (!inventarioActualizado) {
      console.log('[Actualizar Inventario] Inventario no encontrado');
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    console.log('[Actualizar Inventario] Actualizado ID:', id);
    res.json(inventarioActualizado);
  } catch (err) {
    console.error('[Actualizar Inventario] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un inventario por ID
const obtenerInventarioPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener Inventario] ID:', id);
  try {
    const inventario = await logic.buscarInventarioPorId(id);

    if (!inventario) {
      console.log('[Obtener Inventario] Inventario no encontrado');
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    res.json(inventario);
  } catch (err) {
    console.error('[Obtener Inventario] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un inventario
const eliminarInventario = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar Inventario] ID:', id);
  try {
    const eliminado = await logic.eliminarInventario(id);

    if (!eliminado) {
      console.log('[Eliminar Inventario] Inventario no encontrado');
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    console.log('[Eliminar Inventario] Eliminado ID:', eliminado.id);
    res.json(eliminado);
  } catch (err) {
    console.error('[Eliminar Inventario] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener inventario por idProducto
const obtenerInventarioPorProducto = async (req, res) => {
  const { idProducto } = req.params;
  console.log('[Buscar por Producto] ID Producto:', idProducto);
  try {
    const inventario = await logic.obtenerInventarioPorProducto(idProducto);

    if (!inventario) {
      console.log('[Buscar por Producto] No se encontró inventario');
      return res.status(404).json({ error: 'Inventario no encontrado para el producto' });
    }

    res.json(inventario);
  } catch (err) {
    console.error('[Buscar por Producto] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  listarInventarios,
  crearInventario,
  actualizarInventario,
  obtenerInventarioPorId,
  eliminarInventario,
  obtenerInventarioPorProducto
};
