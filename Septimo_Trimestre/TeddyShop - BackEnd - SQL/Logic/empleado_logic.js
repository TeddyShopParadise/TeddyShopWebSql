const { Op } = require('sequelize');
const db = require('../modelsSQL');
const Empleado = db.Empleado;
const Compania = db.Compania;
const Usuario = db.Usuario; 



// Crear un nuevo empleado
async function crearEmpleado(body) {
  const empleadoExistente = await Empleado.findOne({
    where: { dniEmpleado: body.dniEmpleado }
  });

  if (empleadoExistente) {
    throw new Error('Ya existe un empleado con este DNI');
  }

  // Verificar que la compañía existe
  if (body.compania_id) {
    const compania = await Compania.findByPk(body.compania_id);
    if (!compania) {
      throw new Error('La compañía especificada no existe');
    }
  }

  // Crear el empleado
  const empleado = await Empleado.create({
    dniEmpleado: body.dniEmpleado,
    telefonoEmpleado: body.telefonoEmpleado,
    nombreEmpleado: body.nombreEmpleado,
    compania_id: body.compania_id
  });

  return empleado;
}

// Actualizar un empleado
async function actualizarEmpleado(id, body) {
  const empleado = await Empleado.findByPk(id);
  if (!empleado) {
    throw new Error('Empleado no encontrado');
  }

  if (body.compania_id) {
    const compania = await Compania.findByPk(body.compania_id);
    if (!compania) {
      throw new Error('La compañía especificada no existe');
    }
  }

  await empleado.update({
    dniEmpleado: body.dniEmpleado,
    telefonoEmpleado: body.telefonoEmpleado,
    nombreEmpleado: body.nombreEmpleado,
    compania_id: body.compania_id
  });

  return empleado;
}

// Listar todos los empleados
async function listarEmpleados() {
  return await Empleado.findAll({
    attributes: ['id', 'dniEmpleado', 'telefonoEmpleado', 'nombreEmpleado', 'created_at', 'updated_at'],
    include: [
      {
        model: Compania,
        attributes: ['nombreempresa'],
        as: 'companias'
      },
    ],
    order: [['created_at', 'DESC']]
  });
}

// Buscar un empleado por su ID
async function buscarEmpleadoPorId(id) {
  const empleado = await Empleado.findByPk(id, {
    include: [{
      model: Compania, 
      attributes: [ 'nombreempresa'],
      as: 'companias'
    }]
  });

  if (!empleado) {
    throw new Error(`Empleado con ID ${id} no encontrado`);
  }

  return empleado;
}

// Eliminar un empleado por su ID
async function eliminarEmpleado(id) {
  const empleado = await Empleado.findByPk(id);
  if (!empleado) {
    throw new Error(`Empleado con ID ${id} no encontrado`);
  }

  await empleado.destroy();
  return empleado;
}

module.exports = {
  crearEmpleado,
  actualizarEmpleado,
  listarEmpleados,
  buscarEmpleadoPorId,
  eliminarEmpleado
};