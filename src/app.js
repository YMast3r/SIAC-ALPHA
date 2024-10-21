//definir los modulos necesarios
const express= require('express');
const { engine } = require('express-handlebars');
const myconnection =require('express-myconnection');
const mysql= require('mysql');
const session=require('express-session');
const bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');
///////////////////////////////////////////////////////////
/*                         Rutas                         */
//////////////////////////////////////////////////////////
const loginRouter = require('./router/loginR');
const superAdmCotroller = require('./router/superAdmR');
const manCondominoCotroller = require('./router/administrador/condomino/manCondominoR');
const manPago = require('./router/administrador/condomino/manPagoR');
const manIncidencia = require('./router/administrador/condomino/manIncidenciaR');
const manSeguimiento = require('./router/administrador/condomino/manSeguimientoR');
const manPropiedad = require('./router/administrador/manPropiedadR');
const manTipo = require('./router/administrador/manTipoR');
const manHistorial = require('./router/administrador/manHistorialR');
const manAltaEmpleado = require('./router/administrador/manAltaEmpleadoR')

const app = express();

//configurar el puerto para el navegador
const PORT = 1000
app.set('port', PORT);

const Handlebars=require('handlebars');
Handlebars.registerHelper('isEqual', function(value1,value2,options) {
    return value1 == value2 ? options.fn(this) : options.inverse(this);
});

// Sirviendo jQuery y Select2 desde node_modules
app.use('/jquery', express.static((__dirname, 'node_modules/jquery/dist')));
app.use('/select2', express.static((__dirname, 'node_modules/select2/dist')));

//configuraciones para los archivos
app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));


app.use(express.static('funciones'))
app.use(express.static(__dirname + '/funciones'));

app.set('views',__dirname + '/views' );
app.engine('.hbs', engine({
    extname: '.hbs',
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'siac'
   }, 'single'));

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized: true
}))

app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// rutas del login 
app.use('/', loginRouter);

// rutas del super administrador 
app.use('/', superAdmCotroller);

// rutas del manipula condomino
app.use('/', manCondominoCotroller);

// rutas del manipula pago
app.use('/', manPago);

//rutas del manipula insidencia
app.use('/', manIncidencia);

//rutas de seguimiento
app.use('/', manSeguimiento);

//rutas de propiedad
app.use('/', manPropiedad);

//rutas de tipo pago
app.use('/', manTipo);

//ruta de historial
app.use('/', manHistorial);

// ruta de alta de
app.use('/', manAltaEmpleado);

app.get('/', (req, res) => {
	if (req.session.loggedin) {
		let name = req.session.name;
        let tipoUsuario = req.session.tipoUsuario;
        let id = req.session.idUser;
        /* 
            1 =  Super Administrador    
            2 =  Administrador    
            3 =  Condomino    
            4 =  Vigilante   
        */
 		res.render('principal', { name, tipoUsuario, id});
	} else {
		res.render('principal', { acceder: false });
	}
});
