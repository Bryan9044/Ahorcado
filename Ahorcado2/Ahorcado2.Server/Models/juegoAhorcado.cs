using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace Ahorcado2.Server.Models
{
    public class JuegoAhorcado
    {
        public string Palabra { get; set; }
        public int Intentos { get; set; }
        public string LetrasAdivinadas { get; set; }

        public bool EstadoJuego { get; set; }

        public int TamanoPalabra { get; set; }
        public List<bool> Rondas { get; set; }
        public JuegoAhorcado()
        {
            LetrasAdivinadas = ("");
            Intentos = 5;
            EstadoJuego = false;
            Palabra = ("");
            TamanoPalabra = 0;
            Rondas = new List<bool>();
        }
    }

    public class Jugador
    {
        public string Nombre { get; set; }

        public JuegoAhorcado Juego { get; set; }

        public int Orden { get; set; }

        public bool turno { get; set; }
        public Jugador(string nombre, int orden)
        {
            Nombre = nombre;
            Juego = new JuegoAhorcado();
            Orden = orden;
            turno = false;
        }
    }

    public class Palabras
    {
        public List<string> listaPalabras { get; set; } = new List<string>();
    }

    public class EstadisticaPartida
    {
        public string Nombre { get; set; }
        public string Ganador { get; set; }

    }
}
