// Importación correcta de los modelos
const { Catalogo, Producto, Compania } = require('../modelsSQL');
const { Op } = require('sequelize');

async function crearCatalogo(body) {
    const catalogoExistente = await Catalogo.findOne({
        where: {
            nombrecatalogo: body.nombreCatalogo
        }
    });

    if (catalogoExistente) {
        throw new Error('Ya existe un catálogo con este nombre');
    }

    // Crear el catálogo con Sequelize
    const catalogo = await Catalogo.create({
        nombreCatalogo: body.nombreCatalogo,
        descripcionCatalogo: body.descripcionCatalogo,
        disponibilidadcatalogo: body.disponibilidadCatalogo,
        imagen: body.imagen,
        compania_id: body.compania
    });

    if (body.productos && body.productos.length > 0) {
        await catalogo.setProductos(body.productos);
    }

    return catalogo;
}

async function actualizarCatalogo(id, body) {
    const catalogo = await Catalogo.findByPk(id);
    if (!catalogo) {
        throw new Error('Catálogo no encontrado');
    }

    await catalogo.update({
        nombreCatalogo: body.nombreCatalogo,
        descripcionCatalogo: body.descripcionCatalogo,
        disponibilidadcatalogo: body.disponibilidadCatalogo,
        imagen: body.imagen,
        compania_id: body.compania
    });

    if (body.productos) {
        await catalogo.setProductos(body.productos);
    }

    return catalogo;
}

// Función asíncrona para desactivar un catálogo 
async function desactivarCatalogo(id) {
    const catalogo = await Catalogo.findByPk(id);
    if (!catalogo) {
        throw new Error('Catálogo no encontrado');
    }

    await catalogo.update({ disponibilidadcatalogo: false });
    return catalogo;
}

// Función asíncrona para listar catálogos activos
async function listarCatalogosActivos() {
    return await Catalogo.findAll({
        where: { disponibilidadcatalogo: true },
        include: [
            {
                model: Compania,
                as: 'compania',  
                attributes: ['nombreempresa']
            },
            {
                model: Producto,
                attributes: ['id', 'tamanoproducto'],
                through: { attributes: [] }
            }
        ]
    });
}


// Función asíncrona para buscar un catálogo por su ID 
async function buscarCatalogoPorId(id) {
    const catalogo = await Catalogo.findByPk(id, {
        include: [
            {
                model: Compania,
                attributes: ['nombreempresa']
            },
            {
                model: Producto,
                attributes: ['id', 'tamanoproducto'],
                through: { attributes: [] }
            }
        ]
    });

    if (!catalogo) {
        throw new Error(`Catálogo con ID ${id} no encontrado`);
    }

    return catalogo;
}

// Función asíncrona para guardar una colección de catálogos 
async function guardarCatalogos(catalogos) {
    // Asegúrate de importar sequelize correctamente
    const { sequelize } = require('../modelsSQL');
    const transaction = await sequelize.transaction();
    try {
        const resultados = [];
        
        for (const catalogoData of catalogos) {
            const [catalogo, created] = await Catalogo.findOrCreate({
                where: { nombrecatalogo: catalogoData.nombreCatalogo },
                defaults: {
                    descripcioncatalogo: catalogoData.descripcionCatalogo,
                    disponibilidadcatalogo: catalogoData.disponibilidadCatalogo,
                    imagen: catalogoData.imagen,
                    compania_id: catalogoData.compania
                },
                transaction
            });

            if (created && catalogoData.productos) {
                await catalogo.setProductos(catalogoData.productos, { transaction });
            }

            resultados.push(catalogo);
        }

        await transaction.commit();
        return resultados;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
}

module.exports = {
    crearCatalogo,
    actualizarCatalogo,
    desactivarCatalogo,
    listarCatalogosActivos,
    buscarCatalogoPorId,
    guardarCatalogos
};