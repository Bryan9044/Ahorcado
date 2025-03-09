using Microsoft.AspNetCore.Mvc;
using Ahorcado2.Server.Models;
using Newtonsoft.Json;

namespace BackendAhorcado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JugadoresController : ControllerBase
    {

        // Recibimos los datos del frontend por eso el post
        [HttpPost]
        //Recibimos una lista de objetos de tipo Jugador del front
        //Generamos un numero aleatorio entre el 1 y 2 para asignar el orden de los jugadores
        //Creamos una instancia y pedimos una palabra aleatoria
        //Ademas asignamos ciertos datos al jugador y devolvemos la lista de jugadores actualizados con un json
        public IActionResult CrearJugador([FromBody] List<Jugador> jugadores)
        {
            Random orden = new Random(); //Generamos un random
            int jugadorAleatorio = orden.Next(1,3); // Creamos que solo pueda elegir el aleatorio entre 1 y 2



            JuegoController juegoController = new JuegoController(); //Creo un objeto de juego
            string palabra = juegoController.ObtenerPalabraAleatoria();
            int tamañoPalabra = palabra.Length;

            foreach (var jugador in jugadores) //Utiliza una variable llamada jugador y con ella acedere a cada uno de ellos
            {
                jugador.Juego.Palabra = juegoController.ObtenerPalabraAleatoria(); //Acá uso mi variable del jugador para acceder al juego y su palabra asignando así por
                jugador.Orden = jugadorAleatorio; // Asignamos el aleatorio y al siguiente se le suma si es 1 para que sea el 2 jugador sino decrementamos
                jugador.Juego.TamanoPalabra = jugador.Juego.Palabra.Length; //Obtenemos el largo de la palabra y lo guardamos en juego
                if (jugadorAleatorio == 1)
                {
                    jugadorAleatorio++;
                } else
                {
                    jugadorAleatorio--;
                }
                //medio de la clase una palabra aleatoria
            }


            return Ok(jugadores);  // Esto devolverá los jugadores en formato JSON como respuesta
        }
    }




    public class JuegoController
    {
        private List<string> listaPalabras; 
        private readonly string archivoPalabras = "wwwroot/Palabras.json"; // Ruta de las palabras
        public JuegoController()
        {
            // Leemos las palabras solo una vez cuando se instancia el controlador
            listaPalabras = LeerPalabras();
        }
        //Vemos si existe el archivo
        //Leemos y deserealizamos en un diccionario
        //Verificamos si esta Palabras y si tiene algo
        //Imprimos en consola y retornamos
        public List<string> LeerPalabras()
        {
            if (!File.Exists(archivoPalabras))
            {
                throw new FileNotFoundException("El archivo de palabras no fue encontrado.");
            }

            var json = File.ReadAllText(archivoPalabras); 
            var palabras = JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(json); 

            if (palabras == null || !palabras.ContainsKey("Palabras") || palabras["Palabras"].Count == 0)
            {
                throw new InvalidOperationException("El archivo de palabras está vacío o mal formado.");
            }

            Console.WriteLine("Palabras leídas: " + string.Join(", ", palabras["Palabras"]));  
            return palabras["Palabras"];
        }

        //Lee las palabras desde el archivo, vemos si esta vacia, hacemos un numero aleatorio y retornamos la palabra de manera aleatoria
        public string ObtenerPalabraAleatoria()
        {
            List<string> listaPalabras = LeerPalabras();
            if (listaPalabras.Count == 0) //si la lista es igual a 0 enviamos una excepcion
            {
                throw new InvalidOperationException("La lista de palabras está vacía.");

            }
            Random palabraAleatoria = new Random(); 
            int numPalabra = palabraAleatoria.Next(listaPalabras.Count);
            return listaPalabras[numPalabra]; 
        }
    }
}