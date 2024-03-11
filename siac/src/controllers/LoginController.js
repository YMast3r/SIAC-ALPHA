const bcrypt = require('bcrypt');

function login(req, res) {
  if (!req.session.loggedin) {
    res.render('login/index');
  } else {
    res.redirect('/');
  }
}

function index(req, res) {
  if (req.session.loggedin) {
    res.redirect('/');
  } else {
    res.render('login/index');
  }
}

function storeUser(req, res) {
  const data = req.body;
  if (data.password !== data.confirmPassword) {
      return res.render('login/register', { error: 'Error: La contraseña y la confirmación no coinciden' });
  }

  req.getConnection((err, conn) => {
      if (err) {
          console.error('Error al obtener la conexión:', err);
          return res.status(500).send('Error interno del servidor');
      }

      conn.query('SELECT * FROM usuario WHERE email = ?', [data.email], (err, userdata) => {
          if (err) {
              console.error('Error al ejecutar la consulta SELECT:', err);
              return res.status(500).send('Error interno del servidor');
          }

          if (userdata.length > 0) {
            console.log(userdata.length);
            return res.render('login/register', { error: 'Error: el usuario ya existe!' });
          }
          bcrypt.hash(data.password, 12).then(hash => {
              data.password = hash;
              conn.query('INSERT INTO usuario (nombre, email, password, telefono, id_tipo_usuario, id_propiedad, id_status) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.nombre, data.email, data.password, data.telefono, 3, 1, 4], (err, rows) => {
                  if (err) {
                      console.error('Error al insertar:', err);
                      return res.render('login/register', { error: 'Error: al ingresar los datos!' });
                  }
                  // Redirige al usuario a la página pendiente
                  res.redirect('/pendiente');
              });
          }).catch(err => {
              console.error('Error al encriptar la contraseña:', err);
              res.status(500).send('Error interno del servidor');
          });
      });
  });
}


function auth(req, res) {
  const data = req.body;
 
  req.getConnection((err, conn) => {
     if (err) {
       console.error('Error al obtener la conexión:', err);
       return res.status(500).send('Error interno del servidor');
     }
 
     conn.query('SELECT * FROM usuario WHERE email = ?', [data.email], (err, userdata) => {
       if (err) {
         console.error('Error al ejecutar la consulta SELECT:', err);
         return res.status(500).send('Error interno del servidor');
       }
 
       if (userdata.length > 0) {
         const user = userdata[0];
 
         bcrypt.compare(data.password, user.password, (err, isMatch) => {
           if (err) {
             console.error('Error al comparar contraseñas:', err);
             return res.status(500).send('Error interno del servidor');
           }
 
           if (isMatch) {
             // La estructura de control switch y case es utilizada en muchos lenguajes de programación para simplificar la escritura de código en situaciones donde se tienen múltiples opciones o casos a evaluar.
             if (user.id_status == 1) {
               req.session.loggedin = true;
               req.session.name = user.nombre;
               switch (user.id_tipo_usuario) {
                 case 1:
                  req.session.tipo = 'Super Administrador';
                  break;
                 case 2:
                  req.session.tipo = 'Administrador';
                  break;
                 case 3:
                  req.session.tipo = 'Condomino';
                  break;
                 default:
                  req.session.tipo = 'Indefinido';
               }
               res.redirect('/');
            } else {
               res.redirect('/pendiente');
            }
          } else {
            console.log('Contraseña incorrecta:', data.password);
            res.render('login/index', { error: 'Error: contraseña incorrecta!' });
          }
        });
      } else {
        console.log('Usuario no encontrado:', data.email);
        res.render('login/index', { error: 'Error: usuario no existe' });
      }
    });
 });
}
 

function register(req, res) {
  if (req.session.loggedin) {
    res.redirect('/');
  } else {
    res.render('login/register');
  }
}

function pendiente(req, res){
  if (req.session.loggedin) {
      return res.render('pendiente');
  } else {
      res.redirect('/');
  }
}

function logout(req, res) {
  if (req.session.loggedin) {
    req.session.destroy();
  }
  res.redirect('/');
}

function home(req, res) {
  if (!req.session.loggedin) {
    res.render('home');
  } else {
    res.redirect('/');
  }
}


module.exports = {
  index,
  login,
  register,
  storeUser,
  auth,
  logout,
  home,
  pendiente
};