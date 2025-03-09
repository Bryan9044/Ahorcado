using Microsoft.AspNetCore.Mvc;
//Aqui lo que hacemos es esperar que nos llame el front para poder enviar una nueva palabra, lo unico que hacemos es reutilizar la funcion de palabra
// y se la enviamos en un json
namespace BackendAhorcado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PalabraController : ControllerBase
    {
        private readonly JuegoController _juegoController;

        public PalabraController()
        {
            _juegoController = new JuegoController(); // Instanciamos el controlador de juego
        }

        [HttpPost]
        public IActionResult ObtenerNuevaPalabra()
        {
            try
            {

                string nuevaPalabra = _juegoController.ObtenerPalabraAleatoria();
                return Ok(new { palabra = nuevaPalabra }); 
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al obtener nueva palabra", error = ex.Message });
            }
        }
    }
}
