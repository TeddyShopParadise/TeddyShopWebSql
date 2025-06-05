//Controlador para catalogo
const logic = require('../Logic/catalogo_logic');
const { catalogoSchemaValidation } = require('../Validations/catalogo_validation');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid'); 
const sequelize = require('../config/config');
const db = require('../modelsSQL'); // Asegúrate que esto apunte a tu archivo de modelos central
const Catalogo = db.Catalogo; 
cloudinary.config({
    cloud_name: 'peluches',    
    api_key: '381838619856281',          
    api_secret: 'K3bBlaVv-cGj1A0LopGfOLstHs4'    
});

// Controlador para crear un catálogo
const crearCatalogo = async (req, res) => {
    console.log('[Crear Catálogo] Iniciando proceso...');
    console.log('Datos recibidos:', req.body);
    console.log('Archivo recibido:', req.file ? 'Sí' : 'No');
    
    const body = req.body;
    const { imagen, ...resto } = body;

    const { error, value } = catalogoSchemaValidation.validate(resto);
    if (error) {
        console.error('[Crear Catálogo] Error de validación:', {
            error: error.details[0].message,
            detalles: error.details
        });
        return res.status(400).json({ 
            error: error.details[0].message,
            detalles: error.details 
        });
    }

    try {
        let imageUrl = '';
        if (req.file) {
            console.log('[Crear Catálogo] Subiendo imagen a Cloudinary...');
            try {
                const result = await cloudinary.uploader.upload(req.file.buffer, {
                    public_id: uuidv4(),
                    resource_type: 'auto',
                });
                imageUrl = result.secure_url;
                console.log('[Crear Catálogo] Imagen subida con éxito. URL:', imageUrl);
            } catch (uploadError) {
                console.error('[Crear Catálogo] Error al subir imagen:', uploadError);
                throw new Error('Error al subir la imagen');
            }
        }

        const catalogoConImagen = { 
            ...value, 
            imagen: imageUrl || imagen || '' 
        };

        console.log('[Crear Catálogo] Datos completos para creación:', catalogoConImagen);
        
        console.log('[Crear Catálogo] Verificando si el catálogo ya existe...');
        const catalogoExistente = await Catalogo.findOne({
            where: { nombreCatalogo: catalogoConImagen.nombreCatalogo }
        });
        
        if (catalogoExistente) {
            console.warn('[Crear Catálogo] Catálogo ya existe con nombre:', catalogoConImagen.nombreCatalogo);
            return res.status(409).json({ 
                error: 'Ya existe un catálogo con este nombre',
                idExistente: catalogoExistente.id
            });
        }

        console.log('[Crear Catálogo] Creando nuevo catálogo...');
        const nuevoCatalogo = await logic.crearCatalogo(catalogoConImagen);
        
        console.log('[Crear Catálogo] Catálogo creado exitosamente:', {
            id: nuevoCatalogo.id,
            nombre: nuevoCatalogo.nombreCatalogo
        });
        
        res.status(201).json(nuevoCatalogo);
    } catch (err) {
        console.error('[Crear Catálogo] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        if (err.message === 'Ya existe un catálogo con este nombre') {
            return res.status(409).json({ 
                error: err.message,
                tipo: 'conflicto_nombre'
            });
        }

        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controlador para actualizar un catálogo
const actualizarCatalogo = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    console.log('[Actualizar Catálogo] Iniciando proceso para ID:', id);
    console.log('Datos de actualización recibidos:', body);

    const { error, value } = catalogoSchemaValidation.validate(body);
    if (error) {
        console.error('[Actualizar Catálogo] Error de validación:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        console.log('[Actualizar Catálogo] Buscando catálogo con ID:', id);
        
        // Usar el modelo importado correctamente
        const catalogo = await Catalogo.findByPk(id);
        
        if (!catalogo) {
            console.warn('[Actualizar Catálogo] Catálogo no encontrado con ID:', id);
            return res.status(404).json({ error: 'Catálogo no encontrado' });
        }

        console.log('[Actualizar Catálogo] Aplicando cambios...');
        
        // Actualizar campos individualmente para mayor control
        catalogo.nombreCatalogo = value.nombreCatalogo;
        catalogo.descripcionCatalogo = value.descripcionCatalogo;
        catalogo.disponibilidadCatalogo = value.disponibilidadCatalogo;
        catalogo.imagen = value.imagen;
        catalogo.compania_id = value.compania;
        
        await catalogo.save();
        
        console.log('[Actualizar Catálogo] Catálogo actualizado exitosamente:', {
            id: catalogo.id,
            cambios: value
        });

        res.json(catalogo);
    } catch (err) {
        console.error('[Actualizar Catálogo] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
// Controlador para desactivar un catálogo
const desactivarCatalogo = async (req, res) => {
    const { id } = req.params;
    
    console.log('[Desactivar Catálogo] Iniciando proceso para ID:', id);

    try {
        console.log('[Desactivar Catálogo] Buscando catálogo con ID:', id);
        const catalogo = await Catalogo.findByPk(id);
        
        if (!catalogo) {
            console.warn('[Desactivar Catálogo] Catálogo no encontrado con ID:', id);
            return res.status(404).json({ 
                error: 'Catálogo no encontrado',
                id: id
            });
        }

        console.log('[Desactivar Catálogo] Catálogo encontrado. Estado actual:', {
            nombre: catalogo.nombreCatalogo,
            disponibilidad: catalogo.disponibilidadCatalogo
        });

        if (catalogo.disponibilidadCatalogo === false) {
            console.log('[Desactivar Catálogo] El catálogo ya está desactivado');
            return res.json({ 
                message: 'El catálogo ya estaba desactivado',
                catalogo: catalogo
            });
        }

        console.log('[Desactivar Catálogo] Desactivando catálogo...');
        await catalogo.update({ disponibilidadCatalogo: false });
        
        console.log('[Desactivar Catálogo] Catálogo desactivado exitosamente:', {
            id: catalogo.id,
            nuevoEstado: catalogo.disponibilidadCatalogo
        });

        res.json({ 
            message: 'Catálogo desactivado correctamente',
            catalogo: catalogo
        });
    } catch (err) {
        console.error('[Desactivar Catálogo] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controlador para listar catálogos activos
const listarCatalogosActivos = async (req, res) => {
    console.log('[Listar Catálogos] Iniciando proceso...');
    
    try {
        console.log('[Listar Catálogos] Buscando catálogos activos...');
        const catalogosActivos = await logic.listarCatalogosActivos();
        
        console.log('[Listar Catálogos] Resultados encontrados:', {
            cantidad: catalogosActivos.length
        });

        if (catalogosActivos.length === 0) {
            console.log('[Listar Catálogos] No se encontraron catálogos activos');
            return res.status(204).send();
        }

        console.log('[Listar Catálogos] Enviando respuesta con catálogos');
        res.json(catalogosActivos);
    } catch (err) {
        console.error('[Listar Catálogos] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        res.status(500).json({ 
            error: 'Error al listar catálogos',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controlador para buscar un catálogo por su ID
const obtenerCatalogoPorId = async (req, res) => {
    const { id } = req.params;
    
    console.log('[Obtener Catálogo] Iniciando proceso para ID:', id);

    try {
        console.log('[Obtener Catálogo] Buscando catálogo con ID:', id);
        const catalogo = await logic.buscarCatalogoPorId(id);
        
        if (!catalogo) {
            console.warn('[Obtener Catálogo] Catálogo no encontrado con ID:', id);
            return res.status(404).json({ 
                error: 'Catálogo no encontrado',
                id: id
            });
        }

        console.log('[Obtener Catálogo] Catálogo encontrado:', {
            id: catalogo.id,
            nombre: catalogo.nombreCatalogo
        });

        res.json(catalogo);
    } catch (err) {
        console.error('[Obtener Catálogo] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        res.status(500).json({ 
            error: 'Error al obtener catálogo',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controlador para guardar una colección de catálogos
const guardarColeccionCatalogos = async (req, res) => {
    const catalogos = req.body;
    
    console.log('[Guardar Colección] Iniciando proceso...');
    console.log('Cantidad de catálogos recibidos:', catalogos.length);

    // Validación de cada catálogo
    for (let [index, catalogo] of catalogos.entries()) {
        console.log(`[Guardar Colección] Validando catálogo ${index + 1}/${catalogos.length}`);
        
        const { error } = catalogoSchemaValidation.validate(catalogo);
        if (error) {
            console.error(`[Guardar Colección] Error en catálogo ${index + 1}:`, {
                nombre: catalogo.nombreCatalogo,
                error: error.details[0].message
            });
            
            return res.status(400).json({
                error: `Error en catálogo "${catalogo.nombreCatalogo}" (posición ${index + 1})`,
                detalle: error.details[0].message,
                posicion: index + 1
            });
        }
    }

    try {
        console.log('[Guardar Colección] Todos los catálogos son válidos. Procesando...');
        const resultados = await logic.guardarCatalogos(catalogos);
        
        console.log('[Guardar Colección] Resultado del proceso:', {
            exitosos: resultados.length,
            total: catalogos.length
        });

        res.status(201).json({ 
            message: 'Catálogos guardados exitosamente',
            total: catalogos.length,
            exitosos: resultados.length,
            catalogos: resultados
        });
    } catch (err) {
        console.error('[Guardar Colección] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        res.status(500).json({
            error: 'Error al guardar colección de catálogos',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = {
    crearCatalogo,
    actualizarCatalogo,
    desactivarCatalogo,
    listarCatalogosActivos,
    obtenerCatalogoPorId,
    guardarColeccionCatalogos
};