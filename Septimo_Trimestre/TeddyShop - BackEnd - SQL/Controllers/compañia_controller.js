const logic = require('../Logic/compañia_logic');
const { compañiaSchemaValidation } = require('../Validations/compañia_validation');
const db = require('../modelsSQL');
const Compania = db.Compania; // Usar el nombre correcto

// Listar todas las compañías
const listarCompanias = async (req, res) => {
  console.log('[Listar Compañías] Iniciando proceso...');

  try {
    const companias = await logic.listarCompanias();

    console.log('[Listar Compañías] Compañías encontradas:', companias.length);

    if (companias.length === 0) {
      console.log('[Listar Compañías] No se encontraron compañías');
      return res.status(204).send();
    }

    res.json(companias);
  } catch (err) {
    console.error('[Listar Compañías] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    res.status(500).json({ 
      error: 'Error al listar compañías',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear una compañía
const crearCompania = async (req, res) => {
  console.log('[Crear Compañía] Iniciando proceso...');
  console.log('Datos recibidos:', req.body);

  const { error, value } = compañiaSchemaValidation.validate(req.body);

  if (error) {
    console.error('[Crear Compañía] Error de validación:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    console.log('[Crear Compañía] Verificando existencia previa...');
    const companiaExistente = await Compania.findOne({
      where: { NIT: value.NIT }
    });

    if (companiaExistente) {
      console.warn('[Crear Compañía] Ya existe una compañía con este NIT:', value.NIT);
      return res.status(409).json({ 
        error: 'Ya existe una compañía con este NIT',
        idExistente: companiaExistente.id
      });
    }

    console.log('[Crear Compañía] Creando nueva compañía...');
    const nuevaCompania = await logic.crearCompania(value);

    console.log('[Crear Compañía] Compañía creada exitosamente:', nuevaCompania.id);
    res.status(201).json(nuevaCompania);
  } catch (err) {
    console.error('[Crear Compañía] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar una compañía
const actualizarCompania = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  console.log('[Actualizar Compañía] Iniciando proceso para ID:', id);
  console.log('Datos recibidos:', body);

  const { error, value } = compañiaSchemaValidation.validate(body);
  if (error) {
    console.error('[Actualizar Compañía] Error de validación:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    console.log('[Actualizar Compañía] Buscando compañía con ID:', id);
    const compania = await Compania.findByPk(id);

    if (!compania) {
      console.warn('[Actualizar Compañía] Compañía no encontrada con ID:', id);
      return res.status(404).json({ error: 'Compañía no encontrada' });
    }

    console.log('[Actualizar Compañía] Aplicando cambios...');
    await logic.actualizarCompania(id, value);

    console.log('[Actualizar Compañía] Compañía actualizada:', id);
    const companiaActualizada = await logic.buscarCompaniaPorId(id);
    res.json(companiaActualizada);
  } catch (err) {
    console.error('[Actualizar Compañía] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener una compañía por su ID
const obtenerCompaniaPorId = async (req, res) => {
  const { id } = req.params;

  console.log('[Obtener Compañía] Iniciando búsqueda para ID:', id);

  try {
    const compania = await logic.buscarCompaniaPorId(id);

    if (!compania) {
      console.warn('[Obtener Compañía] Compañía no encontrada con ID:', id);
      return res.status(404).json({ error: 'Compañía no encontrada' });
    }

    console.log('[Obtener Compañía] Compañía encontrada:', compania.id);
    res.json(compania);
  } catch (err) {
    console.error('[Obtener Compañía] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    res.status(500).json({ 
      error: 'Error al obtener compañía',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar una compañía por su ID
const eliminarCompania = async (req, res) => {
  const { id } = req.params;

  console.log('[Eliminar Compañía] Iniciando eliminación para ID:', id);

  try {
    const companiaEliminada = await logic.eliminarCompania(id);

    console.log('[Eliminar Compañía] Compañía eliminada:', companiaEliminada?.id || 'no encontrada');
    res.json(companiaEliminada);
  } catch (err) {
    console.error('[Eliminar Compañía] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    if (err.message.includes('no encontrada')) {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  listarCompanias,
  crearCompania,
  actualizarCompania,
  obtenerCompaniaPorId,
  eliminarCompania
};