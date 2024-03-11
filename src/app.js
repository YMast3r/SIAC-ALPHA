const express= require('express');
const { engine } = require('express-handlebars');
const myconnection =require('express-myconnection');
const mysql= require('mysql');
const session=require('express-session');
const bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');
const  loginRouter = require('./router/control');

const app = express();
app.set('port', 1000);

app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));

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
    console.log('Puerto', app.get('port'));
});

app.use('/', loginRouter);


app.get('/', (req, res) => {
	if (req.session.loggedin) {
		let name = req.session.name;
		let tipo = req.session.tipo;
 		res.render('principal', { name, tipo });
	} else {
		res.redirect('/principal');
	}
});

  