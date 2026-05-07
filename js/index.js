

// URL DE LA API
const url = 'http://localhost:3000/alumnos';

// creamos la funcion para crear alumnos

const form = document.getElementById('formAlumno');


//! METODO GET - READ
//* creamos la funcion para obtener los alumnos
async function obtenerAlumnos() {
  const response = await fetch(url); // espera la promesa de fetch de url y la guarda en response
  const alumnos = await response.json(); // response.json() convierte la respuesta en formato JSON a un objeto de JavaScript 
  const contenedor = document.getElementById("listaAlumnos");

  contenedor.innerHTML = "";

  alumnos.forEach(alumno => {
    contenedor.innerHTML += `
      <div>
        <h3>${alumno.nombre} ${alumno.apellido}</h3>
        <p>Edad: ${alumno.edad}</p>
        <p>Email: ${alumno.email}</p>
        <p>Comision: ${alumno.comision}</p> 
        <p>Estado: ${alumno.activo ? "Activo" : "Inactivo"}</p>

        <button onclick="eliminarAlumno('${alumno.id}')" class="btnEliminar">
        Eliminar
        </button>

        <button onclick="editarAlumno('${alumno.id}')" class="btnEditar">
        Editar
        </button>
      </div>
    `;
  });
}
obtenerAlumnos();

let editando = false;
let alumnoId = null;

//! METODO POST Y PUT - CREATE Y UPDATE
//* escuchamos el evento submit del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    //obtenemos los valores de los inputs
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = parseInt(document.getElementById('edad').value);
    const email = document.getElementById('email').value;
    const comision = document.getElementById('comision').value;

   //obtenemos todos los alumnos
    const response = await fetch(url);
    const alumnos = await response.json();

    //generamos el nuevo id
    const nuevoId = alumnos.length > 0
        ? parseInt(alumnos[alumnos.length - 1].id) + 1
        : 1;
    //creamos el objeto alumno
    const alumno = {

        id: editando ? alumnoId : nuevoId.toString(),

        nombre,
        apellido,
        edad,
        email,
        comision,

        activo: true
    };
    //! METODO PUT - UPDATE
    //* si editando es true entonces actualizamos un alumno
    if(editando){
        //el await espera a que se complete la promesa de fetch antes de continuar
        await fetch(`${url}/${alumnoId}`, {
            method: "PUT", //* el metodo PUT -> ACTUALIZA
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(alumno)
        });
        //volvemos editando a false
        editando = false;
        //reiniciamos el id
        alumnoId = null;
    }else{
        //! METODO POST - CREATE
        //* si editando es false entonces creamos un nuevo alumno
        //el await espera a que se complete la promesa de fetch antes de continuar
        await fetch(url, {
            method: "POST", //* el metodo POST -> CREA
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(alumno)
        });
    }
    //una vez creado o actualizado el alumno, volvemos a obtener la lista
    obtenerAlumnos();
    //reiniciamos el formulario
    form.reset();
});

//! METODO DELETE - DELETE
//*creamos una funcion async para eliminar un alumno, recibe el id del alumno a eliminar
async function eliminarAlumno(id) {

    //espera y trae la proemsa de fetch (url/id) y el metodo delete
  await fetch(`${url}/${id}`, {
    method: "DELETE"
  });

  //actualizamo aalumnos
  obtenerAlumnos();
}

//! METODO GET - READ
//*creamos una funcion async para editar un alumno, recibe el id del alumno a editar
async function editarAlumno(id){

    const response = await fetch(`${url}/${id}`);
    const alumno = await response.json();

    nombre.value = alumno.nombre;
    apellido.value = alumno.apellido;
    edad.value = alumno.edad;
    email.value = alumno.email;
    comision.value = alumno.comision;

    editando = true;
    alumnoId = id;
}