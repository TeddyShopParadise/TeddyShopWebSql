// controllers/producto_controller.js

const logic = require('../Logic/producto_logic');
const { productoSchemaValidation } = require('../Validations/producto_validation');
const db = require('../modelsSQL');
const Producto = db.Producto;
const HistorialPrecio = db.HistorialPrecio;
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');

cloudinary.config({
  cloud_name: 'peluches',    
  api_key: '381838619856281',          
  api_secret: 'K3bBlaVv-cGj1A0LopGfOLstHs4'    
});
// Listar todos los productos
const listarProductos = async (req, res) => {
  console.log('[Listar Productos] Iniciando proceso...');
  try {
    const productos = await logic.listarProductos();
    if (productos.length === 0) {
      console.log('[Listar Productos] No se encontraron productos');
      return res.status(204).send();
    }
    console.log('[Listar Productos] Productos encontrados:', productos.length);
    res.json(productos);
  } catch (err) {
    console.error('[Listar Productos] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error al listar productos',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear un nuevo producto
const crearProducto = async (req, res) => {
  console.log('[Crear Producto] Iniciando proceso...');
  const { imagen, historialPrecios, catalogos, categorias, ...resto } = req.body;
  const { error, value } = productoSchemaValidation.validate(resto, { abortEarly: false });

  if (error) {
    console.error('[Crear Producto] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    let imageUrl = imagen || '';
    if (req.file) {
      console.log('[Crear Producto] Subiendo imagen a Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        public_id: uuidv4(),
        resource_type: 'auto'
      });
      imageUrl = result.secure_url;
    }

    console.log('[Crear Producto] Datos enviados a lógica:');
    console.log('→ Datos básicos:', value);
    console.log('→ Imagen:', imageUrl);
    console.log('→ HistorialPrecios:', historialPrecios);
    console.log('→ Catalogos:', catalogos);
    console.log('→ Categorias:', categorias);

    const nuevoProducto = await logic.crearProducto({
      ...value,
      imagen: imageUrl,
      historialPrecios,
      catalogos,
      categorias
    });

    console.log('[Crear Producto] Producto creado:', nuevoProducto.id);
    res.status(201).json(nuevoProducto);
  } catch (err) {
    console.error('[Crear Producto] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  console.log('[Actualizar Producto] ID:', id);
  const { _id, __v, ...resto } = req.body;
  const { error, value } = productoSchemaValidation.validate(resto, { abortEarly: false });

  if (error) {
    console.error('[Actualizar Producto] Validación fallida:', error.details);
    return res.status(400).json({
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    let imageUrl = value.imagen;
    if (req.file) {
      console.log('[Actualizar Producto] Subiendo nueva imagen a Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        public_id: uuidv4(),
        resource_type: 'auto'
      });
      imageUrl = result.secure_url;
    }

    console.log('[Actualizar Producto] Datos enviados a lógica:');
    console.log('→ Datos básicos:', value);
    console.log('→ Imagen:', imageUrl);
    console.log('→ HistorialPrecios:', value.historialPrecios);
    console.log('→ Catalogos:', value.catalogos);
    console.log('→ Categorias:', value.categorias);

    const productoActualizado = await logic.actualizarProducto(id, {
      ...value,
      imagen: imageUrl,
      historialPrecios: value.historialPrecios,
      catalogos: value.catalogos,
      categorias: value.categorias
    });

    console.log('[Actualizar Producto] Actualizado ID:', id);
    res.json(productoActualizado);
  } catch (err) {
    console.error('[Actualizar Producto] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un producto por su ID
const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  console.log('[Obtener Producto] ID:', id);
  try {
    const producto = await logic.buscarProductoPorId(id);
    res.json(producto);
  } catch (err) {
    console.error('[Obtener Producto] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un producto por su ID
const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  console.log('[Eliminar Producto] ID:', id);
  try {
    const eliminado = await logic.eliminarProducto(id);
    console.log('[Eliminar Producto] Eliminado ID:', eliminado.id);
    res.json(eliminado);
  } catch (err) {
    console.error('[Eliminar Producto] Error en el proceso:', err);
    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Listar productos por catálogo
const getProductosByCatalogo = async (req, res) => {
  const { id } = req.params;
  console.log('[GetProductosByCatalogo] Catálogo ID:', id);
  try {
    const productos = await Producto.findAll({
      include: [
        { model: db.Catalogo, as: 'Catalogos', where: { id } },
        { model: db.Categoria, as: 'Categorias', through: { attributes: [] } }
      ]
    });
    res.json(productos);
  } catch (err) {
    console.error('[GetProductosByCatalogo] Error en el proceso:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  listarProductos,
  crearProducto,
  actualizarProducto,
  obtenerProductoPorId,
  eliminarProducto,
  getProductosByCatalogo
};
