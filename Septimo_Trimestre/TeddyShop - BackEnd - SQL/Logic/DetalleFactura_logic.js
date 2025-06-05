const db = require('../modelsSQL');
const { Op, Sequelize } = require('sequelize');

const DetalleFactura = db.DetalleFactura;
const Inventario = db.Inventario;
const Producto = db.Producto;
const Factura = db.Factura;

// Crear nuevo detalle de factura
async function crearDetalleFactura(body) {
  return await db.sequelize.transaction(async (t) => {
    // Ajustar nombres de campos recibidos - Incluir el campo idinventario_id directamente
    const inventarioId = body.inventarioId || body.inventario_id || body.idInventario_id || body.idinventario_id;
    const productoId = body.productoId || body.producto_id || body.idProducto_id || body.idproducto_id;
    const facturaId = body.facturaId || body.factura_id || body.idFactura_id || body.idfactura_id;

    // Validar existencia de relaciones
    const inventario = await Inventario.findByPk(inventarioId, { transaction: t });
    if (!inventario) throw new Error(`Inventario con ID ${inventarioId} no encontrado`);

    const producto = await Producto.findByPk(productoId, { transaction: t });
    if (!producto) throw new Error(`Producto con ID ${productoId} no encontrado`);

    const factura = await Factura.findByPk(facturaId, { transaction: t });
    if (!factura) throw new Error(`Factura con ID ${facturaId} no encontrada`);

    // Crear detalle usando los nombres de FK correctos según el modelo
    const detalle = await DetalleFactura.create({
      precioDetalleFactura: body.precioDetalleFactura,
      cantidadDetalleFactura: body.cantidadDetalleFactura,
      idinventario_id: inventarioId,
      idproducto_id: productoId,
      idfactura_id: facturaId
    }, { transaction: t });

    return detalle;
  });
}

// Actualizar detalle de factura
async function actualizarDetalleFactura(id, body) {
  return await db.sequelize.transaction(async (t) => {
    const detalle = await DetalleFactura.findByPk(id, { transaction: t });
    if (!detalle) throw new Error(`Detalle de Factura con ID ${id} no encontrado`);

    // Ajustar nombres de campos recibidos - Incluir los campos directos
    const inventarioId = body.inventarioId || body.inventario_id || body.idInventario_id || body.idinventario_id;
    const productoId = body.productoId || body.producto_id || body.idProducto_id || body.idproducto_id;
    const facturaId = body.facturaId || body.factura_id || body.idFactura_id || body.idfactura_id;

    // Validar relaciones
    if (inventarioId) {
      const inv = await Inventario.findByPk(inventarioId, { transaction: t });
      if (!inv) throw new Error(`Inventario con ID ${inventarioId} no encontrado`);
    }
    if (productoId) {
      const prod = await Producto.findByPk(productoId, { transaction: t });
      if (!prod) throw new Error(`Producto con ID ${productoId} no encontrado`);
    }
    if (facturaId) {
      const fac = await Factura.findByPk(facturaId, { transaction: t });
      if (!fac) throw new Error(`Factura con ID ${facturaId} no encontrada`);
    }

    // Actualizar usando nombres de FK correctos
    await detalle.update({
      precioDetalleFactura: body.precioDetalleFactura !== undefined ? body.precioDetalleFactura : detalle.precioDetalleFactura,
      cantidadDetalleFactura: body.cantidadDetalleFactura !== undefined ? body.cantidadDetalleFactura : detalle.cantidadDetalleFactura,
      idinventario_id: inventarioId !== undefined ? inventarioId : detalle.idinventario_id,
      idproducto_id: productoId !== undefined ? productoId : detalle.idproducto_id,
      idfactura_id: facturaId !== undefined ? facturaId : detalle.idfactura_id
    }, { transaction: t });

    return detalle;
  });
}

// Listar todos los detalles de factura con sus relaciones
async function listarDetallesFactura() {
  return await DetalleFactura.findAll({
   include: [
  { model: Inventario, as: 'inventario', attributes: ['stock'] },
  { 
    model: Producto, 
    as: 'producto', 
    attributes: ['id','tamanoproducto', 'estiloproducto'],
    include: [
      {
        model: db.HistorialPrecio,
        as: 'HistorialPrecio',
        attributes: ['precio'], 
        order: [['fechacambio', 'DESC']]
      }
    ]
  },
  { model: Factura, as: 'factura', attributes: ['fechacreacionfactura', 'horacreacionfactura'] }
],
    order: [['id', 'DESC']]
  });
}

// Buscar detalle por ID
async function buscarDetalleFacturaPorId(id) {
  const detalle = await DetalleFactura.findByPk(id, {
    include: [
      { model: Inventario, as: 'inventario', attributes: ['stock'] },
      { model: Producto, as: 'producto', attributes: ['tamanoproducto', 'estiloproducto'] },
      { model: Factura, as: 'factura', attributes: ['fechacreacionfactura', 'horacreacionfactura'] }
    ]
  });
  if (!detalle) throw new Error(`Detalle de Factura con ID ${id} no encontrado`);
  return detalle;
}

// Eliminar detalle de factura
async function eliminarDetalleFactura(id) {
  return await db.sequelize.transaction(async (t) => {
    const detalle = await DetalleFactura.findByPk(id, { transaction: t });
    if (!detalle) throw new Error(`Detalle de Factura con ID ${id} no encontrado`);

    await detalle.destroy({ transaction: t });
    return detalle;
  });
}

module.exports = {
  crearDetalleFactura,
  actualizarDetalleFactura,
  listarDetallesFactura,
  buscarDetalleFacturaPorId,
  eliminarDetalleFactura
};