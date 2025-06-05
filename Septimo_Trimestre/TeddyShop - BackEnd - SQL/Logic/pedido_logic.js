const db = require('../modelsSQL');
const { Op } = require('sequelize');

const Pedido = db.Pedido;
const Cliente = db.Cliente;
const DetallePedido = db.DetallePedido;
const Factura = db.Factura;
const Producto = db.Producto;

// Crear nuevo pedido
async function crearPedido(body) {
  let cliente = await Cliente.findOne({ where: { telefonocliente: body.numeroComprador } });

if (!cliente) {
  cliente = await Cliente.create({
    nombrecliente: body.nombreComprador,
    telefonocliente: body.numeroComprador
  });
}

// Asegúrate de que cliente.id es un número mayor que 0
const pedido = await Pedido.create({
  nombreComprador: body.nombreComprador,
  numeroComprador: body.numeroComprador,
  nombreAgendador: body.nombreAgendador,
  numeroAgendador: body.numeroAgendador,
  localidad: body.localidad,
  direccion: body.direccion,
  barrio: body.barrio,
  cliente_id: cliente.id,  // cliente.id debe ser mayor que 0
  estado: body.estado || 'en_proceso'
});
  const detalles = await Promise.all(body.detallesPedido.map(async (detalle) => {
    const producto = await Producto.findByPk(detalle.idProducto);
    if (!producto) throw new Error(`Producto con ID ${detalle.idProducto} no encontrado`);

    return await DetallePedido.create({
      precioDetallePedido: detalle.precioDetallePedido,
      cantidadDetallePedido: detalle.cantidadDetallePedido,
      pedido_id: pedido.id,
      idproducto_id: detalle.idProducto_id
    });
  }));

  const ahora = new Date();

  const factura = await Factura.create({
    pedido_id: pedido.id,
    totalFactura: body.totalFactura || 0,
    estado: 'emitida',
    metodopago_id: body.metodopago_id || 2, 
    cliente_id: cliente.id,
    fechaCreacionFactura: ahora.toISOString().split('T')[0], 
  horaCreacionFactura: ahora.toTimeString().split(' ')[0],             
  });

  return buscarPedidoPorId(pedido.id);
}

// Actualizar pedido
async function actualizarPedido(id, body) {
  const pedido = await Pedido.findByPk(id);
  if (!pedido) throw new Error(`Pedido con ID ${id} no encontrado`);

  await pedido.update({
    nombreComprador: body.nombreComprador,
    numeroComprador: body.numeroComprador,
    nombreAgendador: body.nombreAgendador,
    numeroAgendador: body.numeroAgendador,
    localidad: body.localidad,
    direccion: body.direccion,
    barrio: body.barrio,
    cliente_id: body.cliente_id,
    estado: body.estado
  });

  return buscarPedidoPorId(id);
}

// Listar pedidos
async function listarPedidos() {
  const pedidos = await Pedido.findAll({
    include: [
      { model: Cliente, as: 'cliente', attributes: ['id','telefonocliente'] },
      {
        model: DetallePedido,
        as: 'detallesPedido',
        include: [{
          model: Producto,
          as: 'producto',
          attributes: ['id', 'tamanoproducto', 'historial_precio_id'],
          include: [{
            model: db.HistorialPrecio,
            as: 'HistorialPrecio',
            attributes: ['precio'],
            where: { estadoPrecio: true },
            required: false
          }]
        }]
      },
      {
        model: Factura,
        as: 'facturas',
        order: [['fecha', 'DESC']]
      }
    ],
    order: [['id', 'DESC']]
  });

  return pedidos;
}
// Buscar por ID
async function buscarPedidoPorId(id) {
  const pedido = await Pedido.findByPk(id, {
    include: [
      { 
        model: DetallePedido,
        as: 'detallesPedido',
        include: [{
          model: Producto,
          as: 'producto',
          attributes: ['id', 'tamanoproducto', 'historial_precio_id'],
          include: [{
            model: db.HistorialPrecio,
            as: 'HistorialPrecio',
            attributes: ['precio'],
            where: { estadoPrecio: true },
            required: false
          }]
        }]
      },
      { model: Factura, as: 'facturas' }
    ]
  });

  if (!pedido) throw new Error(`Pedido con ID ${id} no encontrado`);
  return pedido;
}

// Eliminar pedido
async function eliminarPedido(id) {
  const pedido = await Pedido.findByPk(id);
  if (!pedido) throw new Error(`Pedido con ID ${id} no encontrado`);

  await pedido.destroy();
  return pedido;
}

// Actualizar estado
async function actualizarEstado(id, nuevoEstado) {
  const pedido = await Pedido.findByPk(id);
  if (!pedido) throw new Error(`Pedido con ID ${id} no encontrado`);

  await pedido.update({ estado: nuevoEstado });
  return pedido;
}

// Agregar factura a pedido
async function agregarFacturaAPedido(idPedido, idFactura) {
  const factura = await Factura.findByPk(idFactura);
  if (!factura) throw new Error(`Factura con ID ${idFactura} no encontrada`);

  factura.pedido_id = idPedido;
  await factura.save();

  return buscarPedidoPorId(idPedido);
}

module.exports = {
  crearPedido,
  actualizarPedido,
  listarPedidos,
  buscarPedidoPorId,
  eliminarPedido,
  actualizarEstado,
  agregarFacturaAPedido
};
