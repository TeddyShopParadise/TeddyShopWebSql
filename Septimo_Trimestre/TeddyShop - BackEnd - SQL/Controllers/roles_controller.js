// controllers/roles_controller.js

const logic = require('../Logic/roles_logic');
const { rolesSchemaValidation } = require('../Validations/roles_validation');

// Controlador para listar todos los roles
const listarRoles = async (req, res) => {
  try {
    const roles = await logic.listarRoles();
    res.json(roles);
  } catch (err) {
    console.error('[Listar Roles] Error en el proceso:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para crear un nuevo rol
const crearRol = async (req, res) => {
  const body = req.body;

  const { error, value } = rolesSchemaValidation.validate(body);

  if (error) {
    console.error('[Crear Rol] Validación fallida:', error.details);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const nuevoRol = await logic.crearRol(value);
    console.log('[Crear Rol] Rol creado:', nuevoRol.id);
    res.status(201).json(nuevoRol);
  } catch (err) {
    console.error('[Crear Rol] Error en el proceso:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para actualizar un rol
const actualizarRol = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const { error, value } = rolesSchemaValidation.validate(body);

  if (error) {
    console.error('[Actualizar Rol] Validación fallida:', error.details);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const rolActualizado = await logic.actualizarRol(id, value);
    if (!rolActualizado) {
      console.log('[Actualizar Rol] Rol no encontrado');
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    console.log('[Actualizar Rol] Rol actualizado:', id);
    res.json(rolActualizado);
  } catch (err) {
    console.error('[Actualizar Rol] Error en el proceso:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener un rol por su ID
const obtenerRolPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const rol = await logic.buscarRolPorId(id);
    res.json(rol);
  } catch (err) {
    console.error('[Obtener Rol] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para eliminar un rol por su ID
const eliminarRol = async (req, res) => {
  const { id } = req.params;

  try {
    const rolEliminado = await logic.eliminarRol(id);
    console.log('[Eliminar Rol] Rol eliminado:', rolEliminado.id);
    res.json(rolEliminado);
  } catch (err) {
    console.error('[Eliminar Rol] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Exportar los controladores
module.exports = {
  listarRoles,
  crearRol,
  actualizarRol,
  obtenerRolPorId,
  eliminarRol
};
