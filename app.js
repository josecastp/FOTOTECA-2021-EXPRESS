//Array de objetos con un par añadidos, despues se irán añadiendo el usuario y son mostrados por pantall:
const imagenes=[{
    id:1,
    titulo:"SIMPSON",
    url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3ydxTUshNh4_K9AqluYUrd0yF28sBMsTdFS-ASKykjeDTKgRQJrolBqc8j3ra6lQ6uUk&usqp=CAU ",
    fecha:"2019-06-05",
    color:[68, 140, 214]
}];

//const { clear } = require('console');
const express = require('express') //requerimos el módulo de terceros express.Tendremos acceso a sus funciones.

const path = require('path') //Requerimos el modulo path

const app = express();  // tenemos que ejecutar la función importada para obtener un objeto del tipo Express


//Instalación del paquete(antes):   npm i color-thief-node
const { getColorFromURL } = require('color-thief-node');//Requerimos módulo para COLOR predominante


//EJS nos permite teneter codigo javascript incrustado en archivos html etc..
app.set('view engine', 'ejs') //Para poder usar archivos ejs,(PERQUÈ FUNCIONI AIXÒ S'HA DINSTALAR ejs amb npm i ejs)


//Queremos que express nos informe de los datos pasados mediante metodo POST en el cuerpo del mensaje.
//Es un middleware que nos da acceso a los datos de 'POST?
//Es un requerimiento  por lo que se lo debemos indicar así:
app.use(express.urlencoded({ extended: false}));

// Damos acceso a la carpeta 'public' para que cualquier cliente pueda hacer un GET
// a cualquier recurso que se ubique en ella (hojas de estilo CSS, imágenes, documentos PDF...)
app.use(express.static('public'));

//Vamos a crear un endpoint, que cuando nos hagan un GET al directorio raiz de nuestra aplicación;
//mostramos la HOME PAGE(que es la vista de imágenes);
app.get('/',(req,res)=>{
    res.status(200).render('index',{
        totalImagenes: imagenes.length,
        todasLasImagenes:imagenes
       
    });
   
});

//Mostramos archivo de formulario 'nuevaImagen' para añadir imágenes.
app.get('/anadir', (req, res) => {  
    // Si la imagen está repetida, informar al usuario
    // una técnica seria renderizar la misma vista del formulario, pero con un mensaje error
    res.render('nuevaImagen', {
    error: false
    });
    
});

//Mostramos archivo 'index.ejs' para ver todas las Imagenes
app.get('/mostrar', (req, res) => {  //

    //Ordenamos el  array por fecha:
    imagenes.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.fecha) - new Date(a.fecha);
      });
    
    //renderizamos index.ejs para mostrar la imagenes:
    res.render('index',{
        totalImagenes: imagenes.length,
        todasLasImagenes:imagenes
    });
});
 
//Enviamos peticion al servidor cuando nos rellenan todo el formulario. <form action="/anadir" method="POST">
 
app.post('/anadir', async (req, res)=>{ //Función asincrona; debe esperar la resolución de COLOR(async- await)
     const titulo = req.body.titulo.toUpperCase(); //obtenemos el campo 'titulo' del formulario y lo pasamos a mayusculas.
     const url = req.body.url;       //obtenemos el campo 'url' del formulario 
     const fecha = req.body.fecha;   //
     const dominantColor = await getColorFromURL(url); //Así conseguimos paleta de colores. La función del modulo de terceros se encarga de todo!!
    
     console.log("El color predominante es: ",dominantColor);//El color predominante es: [ 68, 140, 214 ]

    //Comprobamos que esta URL no esté repetida en el array:
    var urlRepetida= false;
    for(let i=0;i< imagenes.length;i++){
        if(imagenes[i].url==url){
            urlRepetida=true;
        }
    }
    //Si no esta repetida la añadimos al array en última posición
     if(!urlRepetida){
        imagenes.push({
            id:imagenes.length+1,
            fecha: fecha,
            titulo:titulo,
            url: url,
            color:dominantColor  
        });    
    }else{
    // Si la imagen está repetida, informamos al usuario...renderizamos la misma vista del formulario,
    // pero con mensaje de error. Pasamos variables(error=true y url))
    //La tratamos en el formulario con un 'if'para que muestre la url repetida en un mensaje de error.
    //A continuación, terminamos la funcion con un return.
    res.render('nuevaImagen', {
        error: true,
        url:url
    });
    return;  //Acabamos la función para que no nos redireccione a la vista de imágenes.
    }
    //Si la url NO estaba repetida, hacemos una petición GET a '/mostrar'(index.ejs)para volver a ésta y ver todas las imágenes:
    res.redirect('/mostrar'); 
       
});
    //Tratamos errores 404, app.use recupera cualquier petición o  endpoint), por lo que todo lo que llegue hasta será tratado en esta función:
    app.use((req, res)=>{ 
       // res.status(404).send("<h1>Error 404: Esta página no existe</h1>");
        res.status(404).sendFile(__dirname + "/404.html")
    })

    app.listen(3000);