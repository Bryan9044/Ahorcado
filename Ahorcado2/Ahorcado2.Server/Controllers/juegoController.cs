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
        private List<string> listaPalabras; // Variable para almacenar las palabras leídas
        private readonly string archivoPalabras = "wwwroot/Palabras.json"; // Ruta de donde tenemos el json
        public JuegoController()
        {
            // Leemos las palabras solo una vez cuando se instancia el controlador
            listaPalabras = LeerPalabras();
        }
        public List<string> LeerPalabras()
        {
            if (!File.Exists(archivoPalabras))
            {
                throw new FileNotFoundException("El archivo de palabras no fue encontrado.");
            }

            var json = File.ReadAllText(archivoPalabras); // Leemos el contenido del archivo JSON
            var palabras = JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(json); // Deserializamos a un Diccionario

            // Verificamos si la clave "Palabras" existe y contiene alguna palabra
            if (palabras == null || !palabras.ContainsKey("Palabras") || palabras["Palabras"].Count == 0)
            {
                throw new InvalidOperationException("El archivo de palabras está vacío o mal formado.");
            }

            Console.WriteLine("Palabras leídas: " + string.Join(", ", palabras["Palabras"]));  // Imprime las palabras leídas
            return palabras["Palabras"]; // Retorna la lista de palabras
        }


        public string ObtenerPalabraAleatoria()
        {
            List<string> listaPalabras = LeerPalabras();//Aqui decimos que esa listaPalabras lea el archivo
            if (listaPalabras.Count == 0) //si la lista es igual a 0 enviamos una excepcion
            {
                throw new InvalidOperationException("La lista de palabras está vacía.");

            }
            Random palabraAleatoria = new Random(); //Creamos un random
            int numPalabra = palabraAleatoria.Next(listaPalabras.Count);//Sacamos un número aleatorio
            return listaPalabras[numPalabra]; //Retornamos la lista de palabras con el número aleatorio ahora si sacando la palabra
        }
    }
}