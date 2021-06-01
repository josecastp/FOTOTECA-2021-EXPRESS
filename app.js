const imagenes=[];

const { clear } = require('console');
const express = require('express') //requerimos el módulo de terceros express

const path = require('path') //Requerimos el modulo path

const app = express();  // tenemos que ejecutar la función importada para obtener un objeto del tipo Express

app.set('view engine', 'ejs') //hace que por defecto todas las extensiones sea ejs(nos ahorramos poer la extension al archivo .ejs)


// Queremos que express nos informe de los datos pasados mediante POST en el cuerpo del mensaje.
//Es un middleware
//Es un requerimiento  por lo que se lo debemos indicar así:
app.use(express.urlencoded({ extended: false}))

// damos accesp a la carpeta 'public' para que cualquier cliente pueda hacer un GET a cualquier recurso que se ubique en ella (hojas de estilo CSS, imágenes, documentos PDF...)
app.use(express.static('public'));

// Vamos a crear un endpoint, que cuando nos hagan un GET al directorio raiz de nuestra aplicación; mostramos la HOME PAGE.
app.get('/',(req,res)=>{
    res.render('index',{
        totalImagenes: imagenes.length,
        todasLasImagenes:imagenes
       
    });
   
})

//Mostramos archivo de formulario
app.get('/anadir', (req, res) => {  
    // Si la imagen está repetida, informar al usuario
    // una técnica seria renderizar la misma vista del formulario, pero con un mensaje error
    res.render('nuevaImagen', {
    error: false
    })
    
})

//Mostramos archivo para ver todas las Imagenes
app.get('/mostrar', (req, res) => {  //
    res.render('index',{
        totalImagenes: imagenes.length,
        todasLasImagenes:imagenes
    });
})
 
//Enviamos peticion al servidor
 app.post('/anadir', (req, res)=>{
     const titulo = req.body.titulo.toUpperCase(); //obtenemos el campo 'titulo' del formulario y lo pasamos a mayusculas.
     const url = req.body.url;       //obtenemos el campo 'url' del formulario 
     const fecha = req.body.fecha;   //obtenemos el campo 'fecha' del formulario

     //Comprobamos que esta URL no esté repetida en el array:
    var urlRepetida= false;
    for(let i=0;i< imagenes.length;i++){
        if(imagenes[i].url==url){
            urlRepetida=true;
        }
    }
    console.log("urlRepetida??:", urlRepetida);
     if(!urlRepetida){
        imagenes.push({
            titulo:titulo,
            url: url, 
            fecha: fecha
        });    
    }else{
    // Si la imagen está repetida, informar al usuario
    // una técnica seria renderizar la misma vista del formulario, pero con un mensaje error
    res.render('nuevaImagen', {
        error: true,
        url:url
    })
}

     res.redirect('/mostrar'); // hacemos una petición GET a '/mostrar' para volver a ésta 
       
})

app.listen(3000);