var express = require('express');
var router = express.Router();

// LLamo el controlador para los trabajos
var controlador_trabajos = require("../controllers/trabajos")


// Ruta para mostrar todos los trabajos
router.get("/mostrar_todos_trabajos", function (req, res) {
    const nueva_vista = new controlador_trabajos.Trabajo()
    let respuesta = nueva_vista.mostrar_todos()

    if ( typeof respuesta == "string") {
        res.send(respuesta)
    } else {
        res.render('todos_trabajos', {todos : respuesta });
    }
    
})


// Ruta para mostrar los tipos de trabajos  preventivos
router.get("/trabajos_preventivos", function (req, res) {
    const nuevo_preventivo = new controlador_trabajos.Trabajo()
    let respuesta = nuevo_preventivo.mostrar_preventivos()

    if ( typeof respuesta == "string") {
        res.send(respuesta)
    }else{
       res.render('preventivos', {todos: respuesta });
    }
    

})


// Ruta para mostrar los tipos de trabajos correctivos
router.get("/trabajos_correctivos", function (req, res) {
    const nuevo_correctivo = new controlador_trabajos.Trabajo()
    
    let respuesta = nuevo_correctivo.mostrar_correctivos()
    if ( typeof respuesta ==  "string") {
        res.send(respuesta)
    }else{
      res.render('correctivos', {todos :respuesta });
    }
    

})

// Agregar un nuevo trabajo
router.post('/registrar_trabajo', function (req, res) {
    const registrar = new controlador_trabajos.Trabajo()
    let resultado = registrar.agregar_trabajo(req.body)

    res.send(resultado)
})


// Editar un Trabajo existente
router.put('/editar_trabajo/:id_trabajo', function (req, res) {
    const editar = new controlador_trabajos.Trabajo()
    let obtenido = editar.editar_trabajo(req.params.id_trabajo,req.body)

    res.send(obtenido)

})

//Eliminar un equipo existente
router.delete('/eliminar_trabajo/:id_trabajo', function (req, res) {
    const eliminar = new controlador_trabajos.Trabajo()
    let mensaje = eliminar.borrar_trabajo(req.params.id_trabajo)

    res.send(mensaje)

})

module.exports = router;