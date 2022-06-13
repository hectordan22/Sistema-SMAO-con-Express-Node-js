//const equipos = []
const fs = require("fs")

const { v4: uuidv4 } = require("uuid");

class Trabajo {
    constructor() {
        this.trabajos = []
    }

    mostrar_preventivos() {
        // Leo el Json y lo transformo en array para enviarlo a las vistas
        const data_trabajos = fs.readFileSync('controllers/trabajos.json', 'utf-8');
        let todos_trabajos = JSON.parse(data_trabajos);

        if (todos_trabajos.length == 0) {
            return  "No hay Trabajos Registrados"
        }else{
           // filtro 
          let solo_preventivos = todos_trabajos.filter(preventivo => preventivo.tipo_mantenimiento == "preventivo")

          if (solo_preventivos == 0) {
            return "No existen mantenimientos preventivos registrados"
          }else{
            return solo_preventivos
          }
          
        }

    }

     mostrar_correctivos() {
        // Leo el Json y lo transformo en array para enviarlo a las vistas
        const datoss_trabajos = fs.readFileSync('controllers/trabajos.json', 'utf-8');
        let trabajos_lista = JSON.parse(datoss_trabajos);

        if (trabajos_lista.length == 0) {
            return "No hay trabajos Registrados"
        }else{
             //filtro
           let solo_correctivos = trabajos_lista.filter(correctivo => correctivo.tipo_mantenimiento == "correctivo")

           if (solo_correctivos.length == 0) {
              return "No existen mantenimientos correctivos Registrados"
           } else {
               return solo_correctivos
           }
        }

    }

    mostrar_todos() {
        // Leo el Json y lo transformo en array para enviarlo a las vistas
        const data_trabajos = fs.readFileSync('controllers/trabajos.json', 'utf-8');
        let todos_trabajos = JSON.parse(data_trabajos);

        if (todos_trabajos.length == 0) {
            return "No existen Trabajos Registrados"
        }else{
            return todos_trabajos
        }

    }

    agregar_trabajo(trabajo) {

        const { id_equipo, fecha_planificada_mantenimiento, fecha_inicio_mantenimiento, fecha_final_mantenimiento, status_mantenimiento, tipo_mantenimiento } = trabajo

        let x = 1
        var falta = ""
        for (const key in trabajo) {

            const elementor = trabajo[key];
            if (elementor == "") {
                // Si algun dato enviado esta vacio pausa salta el recorrido del ciclo 
                falta = key
                x = 0;
                break
            } else {
                x = 1
            }
        }

        if (x == 0) {

            return "Todos los campos son obligatorios el registro no pudo realizarse porque falto ingresar " + falta

        } else {

            // En esta parte debo actualizar la ultima fecha de mantenimiento que se le aplico al equipo

            // leo  json de equipos y lo transformo en array para trabajarlo
            const equipos = fs.readFileSync('controllers/equipos.json', 'utf-8');
            let todos_equipos = JSON.parse(equipos);

            // recorro entre los equipos y valido si si existe un equipo con el id enviado
            var existente = 1
            for (let t = 0; t < todos_equipos.length; t++) {
                if (todos_equipos[t].id == id_equipo) {
                    existente = 1
                    // actualizo la fecha de ultimo mantenimiento
                    todos_equipos[t].ultima_fecha_de_mantenimiento = fecha_final_mantenimiento
                    // registro ese cambio en el JSON de equipos
                    const json_novedad = JSON.stringify(todos_equipos);
                    fs.writeFileSync('controllers/equipos.json', json_novedad, 'utf-8');
                } else {
                    existente = 0
                }

            }
            if (existente == 1) {
                // Quiere decir que si existe un equipo con ese id por lo tanto si puedo hacer el registro del trabajo
                // creo id unico en automatico

                let id_unique = uuidv4();
                // creo objetoa inserta  para indicarle su  id unico 
                let nuevo_trabajo = {
                    "id_trabajo":id_unique,
                    "id_equipo":id_equipo,
                    "fecha_planificada_mantenimiento":fecha_planificada_mantenimiento,
                    "fecha_inicio_mantenimiento":fecha_inicio_mantenimiento,
                    "fecha_final_mantenimiento":fecha_final_mantenimiento,
                    "status_mantenimiento":status_mantenimiento,
                    "tipo_mantenimiento":tipo_mantenimiento
                }
                // leo lo anterior del json  y lo transformo en array para trabajarlo
                const json_traba = fs.readFileSync('controllers/trabajos.json', 'utf-8');
                let trabaj = JSON.parse(json_traba);

                // una vez pasado a array igualo el array actual al anterior para que se actualice su estado 
                this.trabajos = trabaj
                // Finalmente pasamos el nuevo registro enviado al cuerpo de la peticion
                this.trabajos.push(nuevo_trabajo);

                // transformamos el array de objetos a String para registrar todo en el Json
                const json_trabajs = JSON.stringify(this.trabajos);
                fs.writeFileSync('controllers/trabajos.json', json_trabajs, 'utf-8');
                
                return "Trabajo Registrado Correctamente"
            }else{
                return "No puede Registrar el trabajo porque no existe un equipo con el id que has ingresado"
            }


            
        }

    }

    editar_trabajo(id_solicitado, cuerpo) {
        //leo el el json, lo convierto en array para buscar por id 
        const json_datos = fs.readFileSync('controllers/trabajos.json', 'utf-8');
        let array_datos = JSON.parse(json_datos);

         let arreglo = array_datos.filter(work => work.id_trabajo == id_solicitado)
            
            if (arreglo.length != 0) {
               
                // recorro las claves del cuerpo de peticion que fueron enviadas para saber que voy a actualizar
                for (const key in cuerpo) {
                    if (cuerpo[key] != "") {
                        arreglo[0][key] = cuerpo[key]

                    }else{
                        "La actualizacion de datos no fue posible debido a que Ningun campo que quiera actualizar no debe estar vacio"
                    }

                }


            } else {
                return "No existe ningun equipo con el id solicitado"
            }

        
        console.log(array_datos)
        // sobreescribo el archivo json con el nuevo array obtenido ya actualizado

        const json_renovado = JSON.stringify(array_datos);
        fs.writeFileSync('controllers/trabajos.json', json_renovado, 'utf-8');
        return "Trabajo Editado Correctamente"
    }

    borrar_trabajo(id_del_trabajo) {

        // Necesito leer el Json y transformarlo en array para trabajarlo
        const json_info = fs.readFileSync('controllers/trabajos.json', 'utf-8');
        let registros = JSON.parse(json_info);

        // Hago un ciclo for para asegurarme de que existe un equipo con ese id pasado
        let si_existe = 0
        for (let h = 0; h < registros.length; h++) {
            const individual = registros[h];
            if (individual.id_trabajo == id_del_trabajo) {
                si_existe = 1
                break
            } else {
                si_existe = 0
            }

        }
        // si el id existe 
        if (si_existe == 1) {
            // Aca excluyo aquel equipo que tenga el id que me estan enviando por la ruta
            let nuevo_array = registros.filter(equipe => equipe.id_trabajo != id_del_trabajo)

            // utilizo el nuevo array para sobresscribir el json
            const json_nuevo = JSON.stringify(nuevo_array);
            fs.writeFileSync('controllers/trabajos.json', json_nuevo, 'utf-8');
            return "Trabajo Eliminado Correctamente"
        } else {
            return "No se pudo eliminar El id que solicitaste no existe en nuestros registros"
        }

    }
}

module.exports.Trabajo = Trabajo