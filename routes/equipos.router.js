var express = require('express');
var router = express.Router();


// LLamo el controlador para equipos 
var controlador_equipos = require("../controllers/equipos")


/* Mostrar detalles de un Equipo*/

router.get('/detallar_equipo/:id_equipo', function(req, res) {


  const detalles = new controlador_equipos.Equipo()
  let result = detalles.detalles_equipo(req.params.id_equipo)

  
  if (typeof result == "string") {
    res.send(result)
  }else{
    res.render('detalle_equipo', {detalle :result});
  }

  
});



// Mostrar todos los equipos
router.get('/mostrar_todos_equipos', function(req, res) {
  const nueva_vista = new controlador_equipos.Equipo()
  let resultado = nueva_vista.mostrar_todos()

  if ( typeof resultado == "string") {
     res.send(resultado)
  } else {
     res.render('todos_equipos', {todos : resultado});
  }
 
 
});



// Agregar un nuevo equipo
router.post('/agregar_equipo',function(req,res) {
   const registrar = new controlador_equipos.Equipo()
  let resultado =  registrar.agregar(req.body)

    res.send(resultado)
})


// Editar un equipo existente
router.put('/editar_equipo/:id_equipo',function(req,res) {
  const editar = new controlador_equipos.Equipo()
  let obtenido = editar.editar_equipo(req.params.id_equipo,req.body)

  res.send(obtenido)
  
})

//Eliminar un equipo existente
router.delete('/eliminar_equipo/:id_equipo',function(req,res) {
  const eliminar = new controlador_equipos.Equipo()
  let mensaje = eliminar.borrar_equipo(req.params.id_equipo)

  res.send(mensaje)
  
})

module.exports = router;
