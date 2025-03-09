using Ahorcado2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.IO;
using System.Collections.Generic;
//Esperamos la llamada vemos que nuevasEstadisticas no sea vacio o igual a 0, creamos el directorio si no esta,
//Leemos las estadisticas previas, agregamos las nuevas, serializamos las estadisticas y guardamos el archivo

namespace BackendAhorcado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadisticaController : ControllerBase
    {
        private readonly string directorio = "C:\\Users\\bryan\\source\\repos\\Ahorcado2\\Ahorcado2.Server\\wwwroot";
        private readonly string nombreArchivo = "estadisticas.json";

        [HttpPost]
        public IActionResult GuardarEstadisticas([FromBody] List<EstadisticaPartida> nuevasEstadisticas)
        {
            try
            {
                if (nuevasEstadisticas == null || nuevasEstadisticas.Count == 0)
                {
                    return BadRequest(new { mensaje = "Datos de estadística inválidos." });
                }

                if (!Directory.Exists(directorio))
                {
                    Directory.CreateDirectory(directorio);
                }

                string rutaArchivo = Path.Combine(directorio, nombreArchivo);
                List<EstadisticaPartida> estadisticasPrevias = new List<EstadisticaPartida>();

                if (System.IO.File.Exists(rutaArchivo))
                {
                    using (var reader = new StreamReader(rutaArchivo))
                    {
                        string jsonPrevio = reader.ReadToEnd();
                        if (!string.IsNullOrWhiteSpace(jsonPrevio))
                        {
                            estadisticasPrevias = JsonSerializer.Deserialize<List<EstadisticaPartida>>(jsonPrevio) ?? new List<EstadisticaPartida>();
                        }
                    }
                }

                estadisticasPrevias.AddRange(nuevasEstadisticas);
                string json = JsonSerializer.Serialize(estadisticasPrevias, new JsonSerializerOptions { WriteIndented = true });

                using (var writer = new StreamWriter(rutaArchivo))
                {
                    writer.Write(json);
                }

                return Ok(new { mensaje = "Estadísticas guardadas correctamente.", ruta = rutaArchivo });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al guardar estadísticas", error = ex.Message });
            }
        }

        //Aqui vemos si el archivo de estadisticas existe, si existe leemos y deserializamos el archivo
        // y devolvemos el archivo
        [HttpGet("historial")]
        public IActionResult ObtenerHistorial()
        {
            try
            {
                string rutaArchivo = Path.Combine(directorio, nombreArchivo);

                if (System.IO.File.Exists(rutaArchivo))
                {
                    using (var reader = new StreamReader(rutaArchivo))
                    {
                        string json = reader.ReadToEnd();
                        var historial = JsonSerializer.Deserialize<List<EstadisticaPartida>>(json);
                        return Ok(historial);
                    }
                }
                else
                {
                    return NotFound("No se encontró el historial.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al obtener historial", error = ex.Message });
            }
        }
    }
}

