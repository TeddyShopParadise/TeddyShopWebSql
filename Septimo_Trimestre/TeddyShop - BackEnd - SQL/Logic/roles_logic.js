const db = require('../modelsSQL');
const Roles = db.Roles;
const Usuario = db.Usuario;

// Función asíncrona para crear un nuevo rol
async function crearRol(body) {
  const rol = await Roles.create({
    estado: body.estado,
    nombre: body.nombre
  });

  return buscarRolPorId(rol.id);
}

// Función asíncrona para actualizar un rol
async function actualizarRol(id, body) {
  const rol = await Roles.findByPk(id);
  if (!rol) throw new Error(`Rol con ID ${id} no encontrado`);

  await rol.update({
    estado: body.estado,
    nombre: body.nombre
  });

  return buscarRolPorId(id);
}

// Función asíncrona para listar todos los roles
async function listarRoles() {
  const roles = await Roles.findAll({
    order: [['id', 'DESC']]
  });

  return roles;
}

// Función asíncrona para buscar un rol por su ID
async function buscarRolPorId(id) {
  const rol = await Roles.findByPk(id, {
    include: [
      { model: Usuario, as: 'usuarios', attributes: ['username', 'email'] }
    ]
  });
  
  if (!rol) throw new Error(`Rol con ID ${id} no encontrado`);
  
  return rol;
}

// Función asíncrona para eliminar un rol por su ID
async function eliminarRol(id) {
  const rol = await Roles.findByPk(id);
  if (!rol) throw new Error(`Rol con ID ${id} no encontrado`);

  await rol.destroy();
  return rol;
}

module.exports = {
  crearRol,
  actualizarRol,
  listarRoles,
  buscarRolPorId,
  eliminarRol
};
