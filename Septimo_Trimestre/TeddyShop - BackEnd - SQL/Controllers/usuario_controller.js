// controllers/usuario_controller.js

const logic = require('../Logic/usuario_logic');
const { usuarioSchemaValidation } = require('../Validations/usuario_validation');
const bcrypt = require('bcrypt');

// Listar todos los usuarios
const listarUsuarios = async (req, res) => {
  console.log('[Listar Usuarios] Iniciando proceso...');
  try {
    const usuarios = await logic.listarUsuarios();
    if (usuarios.length === 0) {
      console.log('[Listar Usuarios] No se encontraron usuarios');
      return res.status(204).send();
    }
    console.log('[Listar Usuarios] Usuarios encontrados:', usuarios.length);
    res.json(usuarios);
  } catch (err) {
    console.error('[Listar Usuarios] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar usuarios',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  console.log('[Crear Usuario] Iniciando proceso...');
  const { error, value } = usuarioSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Crear Usuario] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Crear Usuario] Encriptando contraseña...');
    const salt = await bcrypt.genSalt(10);
    value.contrasena = await bcrypt.hash(value.contrasena, salt);

    console.log('[Crear Usuario] Datos enviados a lógica:', value);
    const nuevoUsuario = await logic.crearUsuario(value);

    console.log('[Crear Usuario] Usuario creado:', nuevoUsuario.id);
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error('[Crear Usuario] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar Usuario] ID:', id);
  const { _id, __v, ...resto } = req.body;

  const { error, value } = usuarioSchemaValidation.validate(resto, { abortEarly: false });

  if (error) {
    console.error('[Actualizar Usuario] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    if (value.contrasena) {
      console.log('[Actualizar Usuario] Encriptando nueva contraseña...');
      const salt = await bcrypt.genSalt(10);
      value.contrasena = await bcrypt.hash(value.contrasena, salt);
    }

    console.log('[Actualizar Usuario] Datos enviados a lógica:', value);
    const usuarioActualizado = await logic.actualizarUsuario(id, value);

    if (!usuarioActualizado) {
      console.log('[Actualizar Usuario] Usuario no encontrado');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('[Actualizar Usuario] Actualizado ID:', id);
    res.json(usuarioActualizado);
  } catch (err) {
    console.error('[Actualizar Usuario] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un usuario por su ID
const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener Usuario] ID:', id);
  try {
    const usuario = await logic.buscarUsuarioPorId(id);
    res.json(usuario);
  } catch (err) {
    console.error('[Obtener Usuario] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un usuario por su ID
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar Usuario] ID:', id);
  try {
    const eliminado = await logic.eliminarUsuario(id);
    console.log('[Eliminar Usuario] Eliminado ID:', eliminado.id);
    res.json(eliminado);
  } catch (err) {
    console.error('[Eliminar Usuario] Error en el proceso:', err);
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
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorId,
  eliminarUsuario
};
