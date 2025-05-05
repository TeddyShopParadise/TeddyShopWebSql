// Logic/cliente_logic.js

const db = require('../modelsSQL');
const Cliente = db.Cliente;
const Pedido  = db.Pedido;
const Factura = db.Factura;

function separarNombreYApellido(nombreCompleto) {
  const [nombre, ...resto] = nombreCompleto.trim().split(' ');
  const apellido = resto.join(' ') || '';
  return { nombre, apellido };
}

// Crear un nuevo cliente
async function crearCliente(body) {
  const existente = await Cliente.findOne({ where: { telefonocliente: body.telefonocliente } });
  if (existente) throw new Error('Ya existe un cliente con este número de teléfono');

  // Separar nombre y apellido
  const { nombre, apellido } = separarNombreYApellido(body.nombrecliente);

  // Crear
  const cliente = await Cliente.create({
    nombrecliente: body.nombrecliente,
    nombre,
    apellido,
    telefonocliente: body.telefonocliente
  });

  return buscarClientePorId(cliente.id);
}

// Actualizar un cliente
async function actualizarCliente(id, body) {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) throw new Error(`Cliente con ID ${id} no encontrado`);

  const { nombre, apellido } = separarNombreYApellido(body.nombrecliente);

  await cliente.update({
    nombrecliente:   body.nombrecliente,
    nombre,
    apellido,
    telefonocliente: body.telefonocliente
  });

  return buscarClientePorId(id);
}

// Listar todos los clientes
async function listarClientes() {
  const clientes = await Cliente.findAll({
    include: [
      { model: Pedido,  as: 'pedidos'  },
      { model: Factura, as: 'facturas' }
    ],
    order: [['id', 'DESC']]
  });
  return clientes;
}

// Buscar un cliente por su ID
async function buscarClientePorId(id) {
  const cliente = await Cliente.findByPk(id, {
    include: [
      { model: Pedido,  as: 'pedidos'  },
      { model: Factura, as: 'facturas' }
    ]
  });
  if (!cliente) throw new Error(`Cliente con ID ${id} no encontrado`);
  return cliente;
}

// Eliminar un cliente por su ID
async function eliminarCliente(id) {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) throw new Error(`Cliente con ID ${id} no encontrado`);

  await cliente.destroy();
  return cliente;
}

module.exports = {
  crearCliente,
  actualizarCliente,
  listarClientes,
  buscarClientePorId,
  eliminarCliente,
  separarNombreYApellido
};
