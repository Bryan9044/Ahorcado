import './App.css';
import { useState, useEffect } from 'react';

let adivinoLaPrimera = false;

function App() {
    const [ventanaAbierta, setVentanaEmergente] = useState(false);
    const [mostrarJuego, setMostrarJuego] = useState(false);
    const [jugadores, setJugadores] = useState([]);
    const [palabraAhorcado, setPalabraAhorcado] = useState("");
    const [rondas, setRondas] = useState(2);
    const [LargoPalabra, setLargo] = useState(0);
    const [listaGuiones, setListaGuiones] = useState([])

    const [LetrasEscogidas, setLetrasEscogidas] = useState({});
    const [imagenAhorcado, setImagenAhorcado] = useState([{ jugador: 0, fallo: 0 }, { jugador: 1, fallo: 0 }]);
    const imagenes = [
        'public/ahorcado1.png',  // Fallo 1
        'public/ahorcado2.png',  // Fallo 2
        'public/ahorcado3.png',  // Fallo 3
        'public/ahorcado4.png',  // Fallo 4
        'public/ahorcado5.png',  // Fallo 5
        'public/ahorcado6.png',  // Fallo final
    ];
    const [intentos, setIntentos] = useState(0);


    const [jugadorActual, setJugadorActual] = useState(0);

    const AbrirVentanaEmergente = () => {
        setVentanaEmergente(true);
    };

    const CerrarVentanaEmergente = () => {
        setVentanaEmergente(false);
    };
    const inicializarGuiones = () => {
        const palabra = jugadores[jugadorActual].juego.palabra;
        const nuevosGuiones = Array(palabra.length).fill("_");

        // Actualiza los guiones solo para el jugador actual
        setJugadores((prevJugadores) => {
            const jugadoresActualizados = [...prevJugadores];
            jugadoresActualizados[jugadorActual] = {
                ...jugadoresActualizados[jugadorActual],
                juego: {
                    ...jugadoresActualizados[jugadorActual].juego,
                    listaGuiones: nuevosGuiones,
                },
            };
            return jugadoresActualizados;
        });
        setListaGuiones(nuevosGuiones); // Localmente también
    };

    const 



    const actualizarListaGuionesJugador = (nuevoGuiones) => {
        setJugadores((prevJugadores) => {
            const jugadoresActualizados = [...prevJugadores];
            jugadoresActualizados[jugadorActual] = {
                ...jugadoresActualizados[jugadorActual], // Copiar al jugador actual
                juego: {
                    ...jugadoresActualizados[jugadorActual].juego, // Copiar el juego
                    listaGuiones: nuevoGuiones // Actualizar solo la lista de guiones
                }
            };
            return jugadoresActualizados;
        });
    };


    useEffect(() => {
        if (jugadores.length > 0 && jugadores[jugadorActual]?.juego?.palabra) {
            // Solo inicializa los guiones si no hay guiones previos
            if (!jugadores[jugadorActual].juego.listaGuiones) {
                inicializarGuiones();
            } else {
                setListaGuiones([...jugadores[jugadorActual].juego.listaGuiones]); // Para asegurar que se muestren correctamente
            }
        }
    }, [jugadores, jugadorActual]); // Se ejecuta solo cuando cambian los jugadores o el jugador actual






    const actualizarImagen = (jugador, fallo) => {
        setImagenAhorcado(imagenAnterior =>
            imagenAnterior.map(img =>
                img.jugador === jugador ? { ...img, fallo: Math.min(img.fallo + 1, imagenes.length - 1) } : img
            )
        );
    };




    return (
        <div id="botonesJugabilidad">
            {mostrarJuego !== true && (

                <ul>
                    <h1>Hola, esta es la primera tarea de Lenguajes</h1>
                    <p>Bienvenido a tu juego de Ahorcado.</p>
                    <ul>
                        <li>
                            <button id="botonesBonitos" onClick={AbrirVentanaEmergente}>
                                <span aria-label="botonJugar" id="botonJugar">Jugar ahorcado</span>
                            </button>
                        </li>
                        <br />
                        <li>
                            <button id="botonesBonitos" >
                                <span aria-label="botonHistorial">Historial de partidas</span>
                            </button>
                        </li>
                    </ul>
                </ul>
            )}

            {/* Mostrar el modal si ventanaAbierta es true */}
            {ventanaAbierta && (
                <NombresJugadores
                    setJugadores={setJugadores}
                    cerrarVentana={CerrarVentanaEmergente}
                    setMostrarJuego={setMostrarJuego}
                    setPalabraAhorcado={setPalabraAhorcado}
                    setRondas={setRondas}
                    setLargo={setLargo}
                />
            )}
            {mostrarJuego && juegoAhorcado()}

        </div>
    );




    function obtenerNuevaPalabra() {
        fetch('http://localhost:5100/api/palabra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Nueva palabra:", data.palabra);
                // Aquí puedes actualizar la interfaz con la nueva palabra.
                // Por ejemplo, mostrarla al jugador o iniciar la ronda siguiente.
            })
            .catch(error => console.error('Error al obtener la nueva palabra:', error));
    }



    function juegoAhorcado() {
        console.log(jugadores);

        const IdentificadorLetra = (letra) => {
            // Llamamos a comprobarLetra para que actualice los guiones con la letra correcta
            const palabra = jugadores[jugadorActual].juego.palabra;
            console.log("Estado letrasEscogidas", LetrasEscogidas)
            comprobarLetra(letra, palabra); //ordenJugador(jugadores).jugador.juego.palabra);
        }

 

        // Definir estiloBoton dentro de la función
        const estiloBoton = (letra) => {
            console.log("Estilo para la letra: ", letra);
            console.log("Valor de LetrasEscogidas[letra]: ", LetrasEscogidas[letra]);
            return {
                backgroundColor: LetrasEscogidas[letra] === "correcta" ? "green" :
                    LetrasEscogidas[letra] === "incorrecta" ? "red" : "white",
                color: "black",
            };
        };



        return (
            <div id="Alfabeto">
                <h3>
                    El primer jugador es {jugadorActual}
                </h3>
                <p id="Guiones">{listaGuiones.join(" ")}</p>

                <img src={imagenes[imagenAhorcado.find(img => img.jugador === jugadorActual).fallo]} alt="Imagen del ahorcado" />
                <br />
                <button style={estiloBoton("A")} id="botonLetra" onClick={() => IdentificadorLetra("A")}
                disabled={LetrasEscogidas["A"] === "correcta" || LetrasEscogidas["A"] === "incorrecta"}>  A
                </button>
                <button style={estiloBoton("B")} id="botonLetra" onClick={() => IdentificadorLetra("B")}
                    disabled={LetrasEscogidas["B"] === "correcta" || LetrasEscogidas["B"] === "incorrecta"}>  B
                </button>
                <button style={estiloBoton("C")} id="botonLetra" onClick={() => IdentificadorLetra("C")}
                    disabled={LetrasEscogidas["C"] === "correcta" || LetrasEscogidas["C"] === "incorrecta"}>  C
                </button>
                <button style={estiloBoton("D")} id="botonLetra" onClick={() => IdentificadorLetra("D")}
                    disabled={LetrasEscogidas["D"] === "correcta" || LetrasEscogidas["D"] === "incorrecta"}>  D
                </button>
                <button style={estiloBoton("E")} id="botonLetra" onClick={() => IdentificadorLetra("E")}
                    disabled={LetrasEscogidas["E"] === "correcta" || LetrasEscogidas["E"] === "incorrecta"}>  E
                </button>
                <button style={estiloBoton("F")} id="botonLetra" onClick={() => IdentificadorLetra("F")}
                    disabled={LetrasEscogidas["F"] === "correcta" || LetrasEscogidas["F"] === "incorrecta"}>  F
                </button>
                <button style={estiloBoton("G")} id="botonLetra" onClick={() => IdentificadorLetra("G")}
                    disabled={LetrasEscogidas["G"] === "correcta" || LetrasEscogidas["G"] === "incorrecta"}>  G
                </button>
                <br />
                <button style={estiloBoton("H")} id="botonLetra" onClick={() => IdentificadorLetra("H")}
                    disabled={LetrasEscogidas["H"] === "correcta" || LetrasEscogidas["H"] === "incorrecta"}>  H
                </button>
                <button style={estiloBoton("I")} id="botonLetra" onClick={() => IdentificadorLetra("I")}
                    disabled={LetrasEscogidas["I"] === "correcta" || LetrasEscogidas["I"] === "incorrecta"}>  I
                </button>
                <button style={estiloBoton("J")} id="botonLetra" onClick={() => IdentificadorLetra("J")}
                    disabled={LetrasEscogidas["J"] === "correcta" || LetrasEscogidas["J"] === "incorrecta"}>  J
                </button>
                <button style={estiloBoton("K")} id="botonLetra" onClick={() => IdentificadorLetra("K")}
                    disabled={LetrasEscogidas["K"] === "correcta" || LetrasEscogidas["K"] === "incorrecta"}>  K
                </button>
                <button style={estiloBoton("L")} id="botonLetra" onClick={() => IdentificadorLetra("L")}
                    disabled={LetrasEscogidas["L"] === "correcta" || LetrasEscogidas["L"] === "incorrecta"}>  L
                </button>
                <button style={estiloBoton("M")} id="botonLetra" onClick={() => IdentificadorLetra("M")}
                    disabled={LetrasEscogidas["M"] === "correcta" || LetrasEscogidas["M"] === "incorrecta"}>  M
                </button>
                <button style={estiloBoton("N")} id="botonLetra" onClick={() => IdentificadorLetra("N")}
                    disabled={LetrasEscogidas["N"] === "correcta" || LetrasEscogidas["N"] === "incorrecta"}>  N
                </button>
                <br />
                <button style={estiloBoton("O")} id="botonLetra" onClick={() => IdentificadorLetra("O")}
                    disabled={LetrasEscogidas["O"] === "correcta" || LetrasEscogidas["O"] === "incorrecta"}>  O
                </button>
                <button style={estiloBoton("P")} id="botonLetra" onClick={() => IdentificadorLetra("P")}
                    disabled={LetrasEscogidas["P"] === "correcta" || LetrasEscogidas["P"] === "incorrecta"}>  P
                </button>
                <button style={estiloBoton("Q")} id="botonLetra" onClick={() => IdentificadorLetra("Q")}
                    disabled={LetrasEscogidas["Q"] === "correcta" || LetrasEscogidas["Q"] === "incorrecta"}>  Q
                </button>
                <button style={estiloBoton("R")} id="botonLetra" onClick={() => IdentificadorLetra("R")}
                    disabled={LetrasEscogidas["R"] === "correcta" || LetrasEscogidas["R"] === "incorrecta"}>  R
                </button>
                <button style={estiloBoton("S")} id="botonLetra" onClick={() => IdentificadorLetra("S")}
                    disabled={LetrasEscogidas["S"] === "correcta" || LetrasEscogidas["S"] === "incorrecta"}>  S
                </button>
                <button style={estiloBoton("T")} id="botonLetra" onClick={() => IdentificadorLetra("T")}
                    disabled={LetrasEscogidas["T"] === "correcta" || LetrasEscogidas["T"] === "incorrecta"}>  T
                </button>
                <button style={estiloBoton("U")} id="botonLetra" onClick={() => IdentificadorLetra("U")}
                    disabled={LetrasEscogidas["U"] === "correcta" || LetrasEscogidas["U"] === "incorrecta"}>  U
                </button>
                <br />
                <button style={estiloBoton("V")} id="botonLetra" onClick={() => IdentificadorLetra("V")}
                    disabled={LetrasEscogidas["V"] === "correcta" || LetrasEscogidas["V"] === "incorrecta"}>  V
                </button>
                <button style={estiloBoton("W")} id="botonLetra" onClick={() => IdentificadorLetra("W")}
                    disabled={LetrasEscogidas["W"] === "correcta" || LetrasEscogidas["W"] === "incorrecta"}>  W
                </button>
                <button style={estiloBoton("X")} id="botonLetra" onClick={() => IdentificadorLetra("X")}
                    disabled={LetrasEscogidas["X"] === "correcta" || LetrasEscogidas["X"] === "incorrecta"}>  X
                </button>
                <button style={estiloBoton("Y")} id="botonLetra" onClick={() => IdentificadorLetra("Y")}
                    disabled={LetrasEscogidas["Y"] === "correcta" || LetrasEscogidas["Y"] === "incorrecta"}>  Y
                </button>
                <button style={estiloBoton("Z")} id="botonLetra" onClick={() => IdentificadorLetra("Z")}
                    disabled={LetrasEscogidas["Z"] === "correcta" || LetrasEscogidas["Z"] === "incorrecta"}>  Z
                </button>
            </div>
        );
    }



    function ordenJugador(jugadores) {
        let ordenJuego;
        console.log(jugadores);

        // Asegúrate de que las comparaciones son numéricas
        if (jugadores[0].orden < jugadores[1].orden) {
            jugadores[0].juego.turno = true;
            ordenJuego = jugadores[0];
            setJugadorActual(0)
        } else {
            jugadores[1].juego.turno = true;
            ordenJuego = jugadores[1];
            setJugadorActual(1)
        }

        return { mensaje: "El primer jugador es: ", jugador: ordenJuego };
    }




    function comprobarLetra(letra, palabra) {
        console.log("ENTRE");
        let palabraCorrecta = false;
        const nuevaListaGuiones = [...jugadores[jugadorActual].juego.listaGuiones];
        let contador = 0;
        let fallo = false;

        while (contador < palabra.length) {
            console.log("Letra actual:", letra);
            console.log("Comparando con:", palabra[contador]);

            if (letra.toLowerCase() === palabra[contador].toLowerCase()) {
                nuevaListaGuiones[contador] = letra;
                palabraCorrecta = true;
            }

            contador++;
        }
        if (!palabraCorrecta) {
            fallo = true;
        }

        if (fallo) {
            actualizarImagen(jugadorActual, fallo);
            if (jugadorActual == 0) {
                setJugadorActual(jugadorActual + 1);
            } else {
                setJugadorActual(jugadorActual - 1);
            }
        }

        // Actualizar la lista de guiones solo si la letra es correcta
        if (palabraCorrecta) {
            actualizarListaGuionesJugador(nuevaListaGuiones);
        }

        setLetrasEscogidas((estadoAnterior) => ({
            ...estadoAnterior,
            [letra]: palabraCorrecta ? "correcta" : "incorrecta"
        }));

        console.log("Esta fue la letra seleccionada:", letra);
        console.log("Guiones actuales:", nuevaListaGuiones);
    }








    function NombresJugadores({ setJugadores, cerrarVentana, setMostrarJuego, setPalabraAhorcado, setRondas, setLargo }) {
        // Iniciamos el nombre en blanco
        // De forma que siempre se devuelva en blanco
        const [jugador1, setJugador1] = useState("");
        const [jugador2, setJugador2] = useState("");

        // Es la funcion para setear el nuevo nombre del jugador que haya puesto en el input
        //La "e" es de evento
        const Jugador1Cambio = (e) => setJugador1(e.target.value);
        const Jugador2Cambio = (e) => setJugador2(e.target.value);

        //Esta vendría a ser la función para enviar los nombres al backend
        const guardarNombres = async () => {
            const jugadores = [
                { Nombre: jugador1 },
                { Nombre: jugador2 }
            ];
            setJugadores(jugadores)//Se hace un objeto de los jugadores

            // Enviar los datos al backend usando fetch
            try {
                const response = await fetch('http://localhost:5100/api/jugadores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Aqui decimos el tipo de contenido o sea un archivo json
                    },
                    body: JSON.stringify(jugadores), // Convertimos el objeto de los jugadores a un string
                });

                // Verificar si la respuesta fue exitosa
                if (response.ok) {
                    const jugadoresARecibir = await response.json();
                    console.log('Se envio el json:', jugadoresARecibir);
                    console.log('Respuesta del backend:', jugadoresARecibir);


                    setJugadores(jugadoresARecibir)
                    setPalabraAhorcado(jugadoresARecibir[0].juego.palabra)
                    setRondas(jugadoresARecibir[0].juego.intentos)
                    setLargo(jugadoresARecibir[0].juego.tamanoPalabra)
                    cerrarVentana();
                    setMostrarJuego(true);
                    ordenJugador(jugadoresARecibir);

                } else {
                    console.log('Error al enviar los datos');
                    console.log(jugadores);
                }
            } catch (error) {
                console.error('Error al enviar los datos:', error);
                console.log(jugadores);

            }
        };
        return (
            <div className="ModalJugadores">
                <h2>Ingrese el nombre del primer jugador</h2>
                <input
                    type="text"
                    value={jugador1}  // El valor del input se toma del estado

                    onChange={Jugador1Cambio}  // Cuando cambia el texto, actualizamos el estado
                />
                <br />
                <h2>Ingrese el nombre del otro jugador</h2>
                <input
                    type="text"
                    value={jugador2}  // El valor del input se toma del estado
                    onChange={Jugador2Cambio}  // Cuando cambia el texto, actualizamos el estado
                />
                <br />
                <br />
                <button id="botonesBonitos" onClick={guardarNombres}>Guardar</button>
            </div>
        );


    }

}
export default App;
