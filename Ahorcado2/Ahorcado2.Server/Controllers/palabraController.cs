using Microsoft.AspNetCore.Mvc;

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
                // Llamamos al método que obtiene una palabra aleatoria
                string nuevaPalabra = _juegoController.ObtenerPalabraAleatoria();
                return Ok(new { palabra = nuevaPalabra }); // Retornamos la palabra en formato JSON
            }
            catch (Exception ex)
            {
                // Si ocurre un error, lo capturamos y devolvemos un mensaje de error
                return BadRequest(new { mensaje = "Error al obtener nueva palabra", error = ex.Message });
            }
        }
    }
}
