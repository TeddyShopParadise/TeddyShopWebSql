const db = require('../modelsSQL');
const { Op } = require('sequelize');

const Factura = db.Factura;
const DetalleFactura = db.DetalleFactura;
const Cliente = db.Cliente;
const Pedido = db.Pedido;
const MetodoPago = db.MetodoPago;
const { agregarFacturaAPedido } = require('./pedido_logic');

// Crear factura
async function crearFactura(body) {
  // Verificar si el pedido ya tiene una factura asociada
  const existente = await Factura.findOne({ where: { pedido_id: body.pedido_id } });
  if (existente) return buscarFacturaPorId(existente.id);

  // Crear cabecera de factura
  const ahora = new Date();
  const factura = await Factura.create({
    pedido_id: body.pedido_id,
    cliente_id: body.cliente_id,
    metodopago_id: body.metodopago_id,
    fechaCreacionFactura: ahora.toISOString().split('T')[0],
    horaCreacionFactura: ahora.toTimeString().split(' ')[0]
  });

  // Crear detalles de factura si llegan
  if (Array.isArray(body.detallesFactura) && body.detallesFactura.length > 0) {
    await Promise.all(
      body.detallesFactura.map(async det => {
        return await DetalleFactura.create({
          idfactura_id: idfactura.id,
          idproducto_id: det.idproducto_id,
          idinventario_id: det.idinventario_id,
          cantidad: det.cantidad,
          precioVenta: det.precioVenta,
          precioCompra: det.precioCompra
        });
      })
    );
  }

  // Asociar factura al pedido
  await agregarFacturaAPedido(body.pedido_id, factura.id);

  return buscarFacturaPorId(factura.id);
}

// Actualizar factura
async function actualizarFactura(id, body) {
  const factura = await Factura.findByPk(id);
  if (!factura) throw new Error(`Factura con ID ${id} no encontrada`);

  // Si cambia pedido, validar no duplicar
  if (body.pedido_id && factura.pedido_id !== body.pedido_id) {
    const ya = await Factura.findOne({ where: { pedido_id: body.pedido_id } });
    if (ya) throw new Error('El nuevo pedido ya tiene una factura generada.');
  }

  // Actualizar campos
  const ahora = new Date();
  await factura.update({
    pedido_id: body.pedido_id,
    cliente_id: body.cliente_id,
    metodopago_id: body.metodopago_id,
    fechaCreacionFactura: body.fechaCreacionFactura || ahora.toISOString().split('T')[0],
    horaCreacionFactura: body.horaCreacionFactura || ahora.toTimeString().split(' ')[0]
  });

  // Reemplazar detalles si vienen
  if (Array.isArray(body.detallesFactura)) {
    // borrar existentes
    await DetalleFactura.destroy({ where: { idfactura_id: id } });
    // crear nuevos
    await Promise.all(
      body.detallesFactura.map(det =>
        DetalleFactura.create({
          factura_id: id,
          idproducto_id: det.idproducto_id,
          idinventario_id: det.idinventario_id,
          cantidad: det.cantidad,
          precioVenta: det.precioVenta,
          precioCompra: det.precioCompra
        })
      )
    );
  }

  return buscarFacturaPorId(id);
}

// Listar facturas
async function listarFacturas() {
  const facturas = await Factura.findAll({
    include: [
      { model: Pedido, as: 'pedido', attributes: ['id', 'nombreComprador'] },
      { model: Cliente, as: 'cliente', attributes: ['nombrecliente', 'telefonocliente'] },
      { model: MetodoPago, as: 'metodoPago', attributes: ['nombremetodopago'] },
      {
        model: DetalleFactura,
        as: 'detallesFactura',
        include: [
          { model: db.Producto, as: 'producto', attributes: ['estiloProducto', 'disponibilidadProducto'] },
          { model: db.Inventario, as: 'inventario', attributes: ['stock', 'precioVenta', 'precioCompra'] }
        ]
      }
    ],
    order: [['id', 'DESC']]
  });
  return facturas;
}

// Buscar factura por ID
async function buscarFacturaPorId(id) {
  const factura = await Factura.findByPk(id, {
    include: [
      { model: Pedido, as: 'pedido', attributes: ['id', 'nombreComprador'] },
      { model: Cliente, as: 'cliente', attributes: ['nombrecliente', 'telefonocliente'] },
      { model: MetodoPago, as: 'metodoPago', attributes: ['nombremetodopago'] },
      {
        model: DetalleFactura,
        as: 'detallesFactura',
        include: [
          { model: db.Producto, as: 'producto', attributes: ['id','estiloProducto', 'disponibilidadProducto'] },
          { model: db.Inventario, as: 'inventario', attributes: ['id','stock', 'precioVenta', 'precioCompra'] }
        ]
      }
    ]
  });
  if (!factura) throw new Error(`Factura con ID ${id} no encontrada`);
  return factura;
}

// Eliminar factura
async function eliminarFactura(id) {
  const factura = await Factura.findByPk(id);
  if (!factura) throw new Error(`Factura con ID ${id} no encontrada`);
  await factura.destroy();
  return factura;
}

module.exports = {
  crearFactura,
  actualizarFactura,
  listarFacturas,
  buscarFacturaPorId,
  eliminarFactura
};
