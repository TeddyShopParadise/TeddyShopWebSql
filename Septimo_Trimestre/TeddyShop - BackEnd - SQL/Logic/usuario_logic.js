const db = require('../modelsSQL');
const { Op } = require('sequelize');

const Usuario  = db.Usuario;
const Empleado = db.Empleado;
const Roles    = db.Roles;

// Crear un nuevo usuario
async function crearUsuario(body) {
  const existe = await Usuario.findOne({ where: { email: body.email } });
  if (existe) throw new Error('Ya existe un usuario con este correo');

  const usuario = await Usuario.create({
    email: body.email,
    contrasena: body.contrasena,
    username: body.username,
    estado: body.estado,
    empleado_id: body.empleado_id || null,
    rol_id: body.rol_id || null
  });

  return buscarUsuarioPorId(usuario.id);
}

// Actualizar un usuario
async function actualizarUsuario(id, body) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado');

  await usuario.update({
    email: body.email,
    contrasena: body.contrasena,
    username: body.username,
    estado: body.estado,
    empleado_id: body.empleado_id || null,
    rol_id: body.rol_id || null
  });

  return buscarUsuarioPorId(id);
}

// Listar todos los usuarios
async function listarUsuarios() {
  const usuarios = await Usuario.findAll({
    include: [
      { model: Empleado, as: 'empleado', attributes: ['nombreEmpleado'] },
      { model: Roles,    as: 'rol',      attributes: ['nombre'] }
    ],
    order: [['id', 'DESC']]
  });
  return usuarios;
}

// Buscar un usuario por su ID
async function buscarUsuarioPorId(id) {
  const usuario = await Usuario.findByPk(id, {
    include: [
      { model: Empleado, as: 'empleado', attributes: ['nombreEmpleado'] },
      { model: Roles,    as: 'rol',      attributes: ['nombre'] }
    ]
  });
  if (!usuario) throw new Error(`Usuario con ID ${id} no encontrado`);
  return usuario;
}

// Eliminar un usuario por su ID
async function eliminarUsuario(id) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error(`Usuario con ID ${id} no encontrado`);

  await usuario.destroy();
  return usuario;
}

module.exports = {
  crearUsuario,
  actualizarUsuario,
  listarUsuarios,
  buscarUsuarioPorId,
  eliminarUsuario
};
