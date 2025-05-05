// Controlador para categoría
const logic = require('../Logic/categoria_logic');
const { categoriaSchemaValidation } = require('../Validations/categoria_validation');
const db = require('../modelsSQL');
const Categoria = db.Categoria;

// Controlador para listar todas las categorías
const listarCategorias = async (req, res) => {
    console.log('[Listar Categorías] Iniciando proceso...');

    try {
        const categorias = await logic.listarCategorias();

        console.log('[Listar Categorías] Categorías encontradas:', categorias.length);

        if (categorias.length === 0) {
            console.log('[Listar Categorías] No se encontraron categorías');
            return res.status(204).send();
        }

        res.json(categorias);
    } catch (err) {
        console.error('[Listar Categorías] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        res.status(500).json({ 
            error: 'Error al listar categorías',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controlador para crear una categoría
const crearCategoria = async (req, res) => {
    console.log('[Crear Categoría] Iniciando proceso...');
    console.log('Datos recibidos:', req.body);

    const { error, value } = categoriaSchemaValidation.validate(req.body);

    if (error) {
        console.error('[Crear Categoría] Error de validación:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        console.log('[Crear Categoría] Verificando existencia previa...');
        const categoriaExistente = await Categoria.findOne({
            where: { nombreCategoria: value.nombreCategoria }
        });

        if (categoriaExistente) {
            console.warn('[Crear Categoría] Ya existe una categoría con este nombre:', value.nombreCategoria);
            return res.status(409).json({ 
                error: 'Ya existe una categoría con este nombre',
                idExistente: categoriaExistente.id
            });
        }

        console.log('[Crear Categoría] Creando nueva categoría...');
        const nuevaCategoria = await logic.crearCategoria(value);

        console.log('[Crear Categoría] Categoría creada exitosamente:', nuevaCategoria.id);
        res.status(201).json(nuevaCategoria);
    } catch (err) {
        console.error('[Crear Categoría] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controlador para actualizar una categoría
const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    console.log('[Actualizar Categoría] Iniciando proceso para ID:', id);
    console.log('Datos recibidos:', body);

    const { error, value } = categoriaSchemaValidation.validate(body);
    if (error) {
        console.error('[Actualizar Categoría] Error de validación:', error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        console.log('[Actualizar Categoría] Buscando categoría con ID:', id);
        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            console.warn('[Actualizar Categoría] Categoría no encontrada con ID:', id);
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        console.log('[Actualizar Categoría] Aplicando cambios...');
        categoria.nombreCategoria = value.nombreCategoria;
        categoria.descripcionCategoria = value.descripcionCategoria;

        await categoria.save();

        console.log('[Actualizar Categoría] Categoría actualizada:', categoria.id);
        res.json(categoria);
    } catch (err) {
        console.error('[Actualizar Categoría] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controlador para obtener una categoría por su ID
const obtenerCategoriaPorId = async (req, res) => {
    const { id } = req.params;

    console.log('[Obtener Categoría] Iniciando búsqueda para ID:', id);

    try {
        const categoria = await logic.buscarCategoriaPorId(id);

        if (!categoria) {
            console.warn('[Obtener Categoría] Categoría no encontrada con ID:', id);
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        console.log('[Obtener Categoría] Categoría encontrada:', categoria.id);
        res.json(categoria);
    } catch (err) {
        console.error('[Obtener Categoría] Error en el proceso:', {
            error: err.message,
            stack: err.stack
        });

        res.status(500).json({ 
            error: 'Error al obtener categoría',
            detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controlador para eliminar una categoría por su ID (lo dejaste igual)
const eliminarCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const categoriaEliminada = await logic.eliminarCategoria(id);
        res.json(categoriaEliminada);
    } catch (err) {
        if (err.message.includes('no encontrada')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    obtenerCategoriaPorId,
    eliminarCategoria
};
