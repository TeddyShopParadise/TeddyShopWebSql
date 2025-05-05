const { Categoria, Producto } = require('../modelsSQL');
const { Op } = require('sequelize');

// Crear una nueva categoría
async function crearCategoria(body) {
    const categoriaExistente = await Categoria.findOne({
        where: { nombreCategoria: body.nombreCategoria }
    });

    if (categoriaExistente) {
        throw new Error('Ya existe una categoría con este nombre');
    }

    // Crear la categoría
    const categoria = await Categoria.create({
        nombreCategoria: body.nombreCategoria,
        descripcionCategoria: body.descripcionCategoria,
        imagen: body.imagen
    });

    if (body.productos && body.productos.length > 0) {
        await categoria.setProductos(body.productos);
    }

    return categoria;
}

// Actualizar una categoría
async function actualizarCategoria(id, body) {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        throw new Error('Categoría no encontrada');
    }

    await categoria.update({
        nombreCategoria: body.nombreCategoria,
        descripcionCategoria: body.descripcionCategoria,
        imagen: body.imagen
    });

    if (body.productos) {
        await categoria.setProductos(body.productos);
    }

    return categoria;
}

// Listar categorías activas (con productos asociados)
async function listarCategorias() {
    return await Categoria.findAll({
        attributes: ['id', 'nombreCategoria', 'descripcionCategoria', 'imagen'],
        include: [{
            model: Producto,
            attributes: ['id', 'tamanoproducto'],
            through: { attributes: [] }
        }]
    });
}

// Buscar categoría por ID
async function buscarCategoriaPorId(id) {
    const categoria = await Categoria.findByPk(id, {
        include: [{
            model: Producto,
            attributes: ['id', 'tamanoproducto'],
            through: { attributes: [] }
        }]
    });

    if (!categoria) {
        throw new Error(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
}

// Eliminar categoría por ID
async function eliminarCategoria(id) {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        throw new Error(`Categoría con ID ${id} no encontrada`);
    }

    await categoria.destroy();
    return categoria;
}

module.exports = {
    crearCategoria,
    actualizarCategoria,
    listarCategorias,
    buscarCategoriaPorId,
    eliminarCategoria
};
