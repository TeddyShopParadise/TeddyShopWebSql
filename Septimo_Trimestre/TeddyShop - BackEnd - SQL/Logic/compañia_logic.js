const { Op } = require('sequelize');
const db = require('../modelsSQL');
const Compania = db.Compania; 
const Catalogo = db.Catalogo;
const Empleado = db.Empleado;

// Crear una nueva compañía
async function crearCompania(body) {
  const companiaExistente = await Compania.findOne({
    where: { NIT: body.NIT }
  });

  if (companiaExistente) {
    throw new Error('Ya existe una compañía con este NIT');
  }

  // Crear la compañía
  const compania = await Compania.create({
    NIT: body.NIT,
    telefonoEmpresa: body.telefonoEmpresa,
    nombreEmpresa: body.nombreEmpresa,
    direccionEmpresa: body.direccionEmpresa
  });

  if (body.catalogos && body.catalogos.length > 0) {
    await compania.setCatalogos(body.catalogos);
  }

  if (body.empleados && body.empleados.length > 0) {
    await compania.setEmpleados(body.empleados);
  }

  return compania;
}

// Actualizar una compañía
async function actualizarCompania(id, body) {
  const compania = await Compania.findByPk(id);
  if (!compania) {
    throw new Error('Compañía no encontrada');
  }

  await compania.update({
    NIT: body.NIT,
    telefonoEmpresa: body.telefonoEmpresa,
    nombreEmpresa: body.nombreEmpresa,
    direccionEmpresa: body.direccionEmpresa
  });

  if (body.catalogos) {
    await compania.setCatalogos(body.catalogos);
  }

  if (body.empleados) {
    await compania.setEmpleados(body.empleados);
  }

  return compania;
}

// Listar todas las compañías
async function listarCompanias() {
  return await Compania.findAll({
    attributes: ['id', 'NIT', 'telefonoEmpresa', 'nombreEmpresa', 'direccionEmpresa', 'created_at', 'updated_at'],
    include: [
      {
        model: Catalogo,
        attributes: ['id', 'nombreCatalogo'],
        as: 'catalogos'
      },
      {
        model: Empleado,
        attributes: ['id', 'nombreempleado', 'dniempleado'],
        as: 'empleados'
      }
    ],
    order: [['created_at', 'DESC']]
  });
}

// Buscar una compañía por su ID
async function buscarCompaniaPorId(id) {
  const compania = await Compania.findByPk(id, {
    include: [
      {
        model: Catalogo,
        attributes: ['id', 'nombreCatalogo'],
        as: 'catalogos'
      },
      {
        model: Empleado,
        attributes: ['id', 'nombreempleado', 'dniempleado'],
        as: 'empleados'
      }
    ]
  });

  if (!compania) {
    throw new Error(`Compañía con ID ${id} no encontrada`);
  }

  return compania;
}

// Eliminar una compañía por su ID
async function eliminarCompania(id) {
  const compania = await Compania.findByPk(id);
  if (!compania) {
    throw new Error(`Compañía con ID ${id} no encontrada`);
  }

  await compania.destroy();
  return compania;
}

module.exports = {
  crearCompania,
  actualizarCompania,
  listarCompanias,
  buscarCompaniaPorId,
  eliminarCompania
};