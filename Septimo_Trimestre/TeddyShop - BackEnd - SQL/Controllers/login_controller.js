const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../modelsSQL');
const Usuario = db.Usuario;
const Rol = db.Roles;
require('dotenv').config();

const login = async (req, res) => {
  const { email, contrasena } = req.body;
  console.log('[Login] Datos recibidos:', req.body);

  if (!email || !contrasena) {
    console.error('[Login] Faltan campos requeridos: email o contrasena');
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    const usuario = await Usuario.findOne({
      where: { email },
      include: [
        {
          model: Rol,
          as: 'rol',
          attributes: ['nombre']
        }
      ]
    });

    if (!usuario) {
      console.error('[Login] Usuario no encontrado con el email:', email);
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    if (!usuario.contrasena) {
      console.error('[Login] La contrasena almacenada es undefined o null');
      return res.status(500).json({ message: 'Error en los datos de usuario' });
    }

    console.log('[Login] Contraseña ingresada:', contrasena);
    console.log('[Login] Contraseña almacenada (hashed):', usuario.contrasena);
    console.log('[Login] Tipo de contraseña almacenada:', typeof usuario.contrasena);
    console.log('[Login] Comparando contrasena...');

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    console.log('[Login] ¿Contraseña coincide?:', isMatch);

    if (!isMatch) {
      console.error('[Login] Contraseña incorrecta');
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    let roleNames = [];
    if (usuario.rol) {
      roleNames = [usuario.rol.nombre];
    } else if (usuario.roles && Array.isArray(usuario.roles)) {
      roleNames = usuario.roles.map(role => role.nombre);
    }

    const payload = {
      userId: usuario.id,
      username: usuario.username || usuario.nombre,
      roles: roleNames
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('[Login] Login exitoso. Usuario:', usuario.email, '| Roles:', roleNames);
    console.log('[Login] Token generado:', token);

    res.json({ token });
  } catch (err) {
    console.error('[Login] Error en el proceso:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

module.exports = {
  login
};
