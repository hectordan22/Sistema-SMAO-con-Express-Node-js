//const equipos = []
const fs = require("fs")

const { v4: uuidv4 } = require("uuid");


class Equipo {
  constructor() {
    this.equipos = []
  }

  detalles_equipo(id_unico) {

    //leo el el json, lo convierto en array para buscar por id 
    const json_registros = fs.readFileSync('controllers/equipos.json', 'utf-8');
    let arreglo_datos = JSON.parse(json_registros);

    let z = 1;

    for (let x = 0; x < arreglo_datos.length; x++) {
      const elem = arreglo_datos[x];
      if (elem.id == id_unico) {
        z = 1
        return elem
      } else {
        z = 0
      }

    }
    if (z == 0) {
      return "No se encuentra registrado ningun equipo para el id que ha solicitado"
    }
  }

  mostrar_todos() {
    // Leo el Json y lo transformo en array para enviarlo a las vistas
    const data_equipos = fs.readFileSync('controllers/equipos.json', 'utf-8');
    let todos_equipos = JSON.parse(data_equipos);

    if (todos_equipos.length == 0) {
       return "No hay equipos registrados"
    }else{
       return todos_equipos
    }

    
  }

  agregar(equipo) {

    const { nombre, descripcion, serial, fecha_inicial_marcha, ultima_fecha_marcha, ultima_fecha_mantenimiento, id_ultimo_trabajo } = equipo

    let x = 1
    var falta = ""
    for (const key in equipo) {

      const elementor = equipo[key];
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
      // creo id unico en automatico
      let id_unique = uuidv4();
      // creo objetoa inserta  para indicarle su  id unico 
      let nuevo_equipo = {
        "id": id_unique,
        "nombre": nombre,
        "descripcion": descripcion,
        "serial": serial,
        "fecha_inicial_de_puesta_en_marcha": fecha_inicial_marcha,
        "ultima_fecha_de_puesta_en_marcha": ultima_fecha_marcha,
        "ultima_fecha_de_mantenimiento": ultima_fecha_mantenimiento,
        "id_ultimo_trabajo_de_mantenimiento": id_ultimo_trabajo
      }
      // leo lo anterior del json  y lo transformo en array para trabajarlo
      const json_equi = fs.readFileSync('controllers/equipos.json', 'utf-8');
      let equip = JSON.parse(json_equi);

      // una vez pasado a array igualo el array actual al anterior para que se actualice su estado 
      this.equipos = equip
      // Finalmente pasamos el nuevo registro enviado al cuerpo de la peticion
      this.equipos.push(nuevo_equipo);

      // transformamos el array de objetos a String para registrar todo en el Json
      const json_equipos = JSON.stringify(this.equipos);
      fs.writeFileSync('controllers/equipos.json', json_equipos, 'utf-8');

      return "Equipo Registrado Correctamente"
    }

  }

  editar_equipo(id_solicitado, cuerpo) {
    //leo el el json, lo convierto en array para buscar por id 
    const json_datos = fs.readFileSync('controllers/equipos.json', 'utf-8');
    let array_datos = JSON.parse(json_datos);

    let arreglo = array_datos.filter(work => work.id == id_solicitado)
            
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
    fs.writeFileSync('controllers/equipos.json', json_renovado, 'utf-8');
    return "Equipo actualizado Correctamente"
  }

  borrar_equipo(id_del_equipo) {

    // Necesito leer el Json y transformarlo en array para trabajarlo
    const json_info = fs.readFileSync('controllers/equipos.json', 'utf-8');
    let registros = JSON.parse(json_info);

    // Hago un ciclo for para asegurarme de que existe un equipo con ese id pasado
    let si_existe = 0
    for (let h = 0; h < registros.length; h++) {
      const individual = registros[h];
      if (individual.id == id_del_equipo) {
        si_existe = 1
        break
      } else {
        si_existe = 0
      }

    }
    // si el id existe 
    if (si_existe == 1) {
      // Aca excluyo aquel equipo que tenga el id que me estan enviando por la ruta
      let nuevo_array = registros.filter(equipe => equipe.id != id_del_equipo)

      // utilizo el nuevo array para sobresscribir el json
      const json_nuevo = JSON.stringify(nuevo_array);
      fs.writeFileSync('controllers/equipos.json', json_nuevo, 'utf-8');
      return "Equipo Eliminado Correctamente"
    }else{
       return "El id que solicitaste no existe en nuestros registros" 
    }

  }
}

module.exports.Equipo = Equipo