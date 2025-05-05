const logic = require('../Logic/empleado_logic');
const { empleadoSchemaValidation } = require('../Validations/empleado_validation');
const db = require('../modelsSQL');
const Empleado = db.Empleado;

// Listar todos los empleados
const listarEmpleados = async (req, res) => {
  console.log('[Listar Empleados] Iniciando proceso...');

  try {
    const empleados = await logic.listarEmpleados();

    console.log('[Listar Empleados] Empleados encontrados:', empleados.length);

    if (empleados.length === 0) {
      console.log('[Listar Empleados] No se encontraron empleados');
      return res.status(204).send();
    }

    res.json(empleados);
  } catch (err) {
    console.error('[Listar Empleados] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    res.status(500).json({ 
      error: 'Error al listar empleados',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Crear un nuevo empleado
const crearEmpleado = async (req, res) => {
  console.log('[Crear Empleado] Iniciando proceso...');
  console.log('Datos recibidos:', req.body);

  const { error, value } = empleadoSchemaValidation.validate(req.body, { abortEarly: false });

  if (error) {
    console.error('[Crear Empleado] Error de validación:', error.details);
    return res.status(400).json({ 
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message) 
    });
  }

  try {
    console.log('[Crear Empleado] Verificando existencia previa...');
    const empleadoExistente = await Empleado.findOne({
      where: { dniEmpleado: value.dniEmpleado }
    });

    if (empleadoExistente) {
      console.warn('[Crear Empleado] Ya existe un empleado con este DNI:', value.dniEmpleado);
      return res.status(409).json({ 
        error: 'Ya existe un empleado con este DNI',
        idExistente: empleadoExistente.id
      });
    }

    console.log('[Crear Empleado] Creando nuevo empleado...');
    const nuevoEmpleado = await logic.crearEmpleado(value);

    console.log('[Crear Empleado] Empleado creado exitosamente:', nuevoEmpleado.id);
    res.status(201).json(nuevoEmpleado);
  } catch (err) {
    console.error('[Crear Empleado] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Actualizar un empleado
const actualizarEmpleado = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  console.log('[Actualizar Empleado] Iniciando proceso para ID:', id);
  console.log('Datos recibidos:', req.body);

  const { error, value } = empleadoSchemaValidation.validate(body, { abortEarly: false });
  if (error) {
    console.error('[Actualizar Empleado] Error de validación:', error.details);
    return res.status(400).json({ 
      error: 'Validación fallida',
      detalles: error.details.map(d => d.message)
    });
  }

  try {
    console.log('[Actualizar Empleado] Buscando empleado con ID:', id);
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      console.warn('[Actualizar Empleado] Empleado no encontrado con ID:', id);
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    console.log('[Actualizar Empleado] Aplicando cambios...');
    const empleadoActualizado = await logic.actualizarEmpleado(id, value);

    console.log('[Actualizar Empleado] Empleado actualizado:', id);
    res.json(empleadoActualizado);
  } catch (err) {
    console.error('[Actualizar Empleado] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Obtener un empleado por su ID
const obtenerEmpleadoPorId = async (req, res) => {
  const { id } = req.params;

  console.log('[Obtener Empleado] Iniciando búsqueda para ID:', id);

  try {
    const empleado = await logic.buscarEmpleadoPorId(id);

    if (!empleado) {
      console.warn('[Obtener Empleado] Empleado no encontrado con ID:', id);
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    console.log('[Obtener Empleado] Empleado encontrado:', empleado.id);
    res.json(empleado);
  } catch (err) {
    console.error('[Obtener Empleado] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ 
      error: 'Error al obtener empleado',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Eliminar un empleado por su ID
const eliminarEmpleado = async (req, res) => {
  const { id } = req.params;

  console.log('[Eliminar Empleado] Iniciando eliminación para ID:', id);

  try {
    const empleadoEliminado = await logic.eliminarEmpleado(id);

    console.log('[Eliminar Empleado] Empleado eliminado:', empleadoEliminado?.id || 'no encontrado');
    res.json(empleadoEliminado);
  } catch (err) {
    console.error('[Eliminar Empleado] Error en el proceso:', {
      error: err.message,
      stack: err.stack
    });

    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  listarEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  obtenerEmpleadoPorId,
  eliminarEmpleado
};