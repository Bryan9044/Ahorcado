import './App.css';
import { useState, useEffect } from 'react';

let pruebita = false;
function App() {
    const [ventanaAbierta, setVentanaEmergente] = useState(false);
    const [mostrarJuego, setMostrarJuego] = useState(false);
    const [jugadores, setJugadores] = useState([]);
    const [palabraAhorcado, setPalabraAhorcado] = useState("");
    const [contadorRondas, setContadorRondas] = useState(1);
    const [rondaActual, setRondaActual] = useState(1);
    const [LargoPalabra, setLargo] = useState(0);
    const [listaGuiones, setListaGuiones] = useState([])
    const [tiemposJugadores, setTiempoJugadores] = useState([0, 0])
    const [LetrasEscogidas, setLetrasEscogidas] = useState({});
    const [ganadoresPartida, setGanadoresPartida] = useState({});
    const [tiempoEmpieza, setTiempoEmpieza] = useState(false);
    const [empate, setEmpate] = useState(false);
    const [culmine, setCulmine] = useState(false);
    const [prueba, setPrueba] = useState(false);
    const [esGanador2, setEsGanador2] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);


    const [imagenAhorcado, setImagenAhorcado] = useState([{ jugador: 0, fallo: 0 }, { jugador: 1, fallo: 0 }]);
    const imagenes = [
        'public/ahorcado1.png',  // Fallo 1
        'public/ahorcado2.png',  // Fallo 2
        'public/ahorcado3.png',  // Fallo 3
        'public/ahorcado4.png',  // Fallo 4
        'public/ahorcado5.png',  // Fallo 5
        'public/ahorcado6.png',  // Fallo final
    ];
    const [intentos, setIntentos] = useState(6);


    const [jugadorActual, setJugadorActual] = useState(0);

    const AbrirVentanaEmergente = () => {
        setVentanaEmergente(true);
    };

    const CerrarVentanaEmergente = () => {
        setVentanaEmergente(false);
    };

    const abrirModalHistorial = () => setModalHistorialAbierto(true);
    const cerrarModalHistorial = () => setModalHistorialAbierto(false);


    //Aqui rellenamos al juego del jugador con una lista de guiones estos del largo de su palabra
    //De igual forma se realizan copias por eso los ... para evitar problemas con los estados y asi
    //Mantener los anteriores
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

    //Este es más que todo para ver como se comporta el array de los jugadores
    //Ademas nos sirve para observar que se ha completado y que no
    useEffect(() => {
        console.log("Estado actualizado de jugadores:", jugadores);
    }, [jugadores]);

    //Aqui hacemos que si estamos en la 2 ronda y enviamos un true en prueba que es la otra condicion
    //Para que asi funcione este efecto(si no da error) asi elegimos el ganador de la partida al puro final
    //Ademas enviamos las estadisticas de los jugadores y esto se actualiza en cada pase de ronda y con la prueba
    useEffect(() => {
        if (rondaActual === 2 && prueba === true) {
            console.log("Ronda 2 - Verificar ganador");
            const ganador = determinarGanadorFinal();
            setEsGanador2(ganador);  // Actualiza el estado de esGanador2
            console.log("Resultado final: ", ganador);
            envioEstadisticas(jugadores);
        }
    }, [rondaActual, prueba]);

    //Este efecto se utiliza para cuando el ganador ya se actualice correctamente en los estados por si el anterior no estaba actualizado
    //Este asegura que si funcione y por eso se activa cuando esGanador2 cambie de estado
    useEffect(() => {
        if (esGanador2 !== null) {
            envioEstadisticas(jugadores);
        } 
    }, [esGanador2]);  

    //Este efecto lo utilizamos solo para el tiempo de los jugadores, este empieza en la primer ronda cuando el primer jugador marque una letra
    //Ira de 1 segundo en 1 segundo por cada jugador y cada uno ira aumentando en su turno, por eso tenemos a que escuche a jugadorActual
    //Jugadores, tiempoEmpieza
    useEffect(() => {
        if (jugadores[0]?.nombre && jugadores[1]?.nombre && tiempoEmpieza == true) {  // Solo inicia si ambos jugadores tienen nombre
            let intervalo = setInterval(() => {
                setTiempoJugadores((prevTiempos) => {
                    const nuevosTiempos = [...prevTiempos];
                    nuevosTiempos[jugadorActual] += 1; // Sumar 1 segundo al jugador actual
                    return nuevosTiempos;
                });
            }, 1000);

            return () => clearInterval(intervalo); // Limpiar intervalo cuando cambie el efecto
        }
    }, [jugadorActual, jugadores, tiempoEmpieza]); // Se ejecuta cuando cambia el jugador o los nombres


    //Este efecto lo utilizamos para que despues de la primer ronda se inicie la segunda por eso aumentamos la ronda e iniciamos la ronda
    useEffect(() => {
        if (((jugadores[0]?.juego?.estadoJuego === true || jugadores[1]?.juego?.estadoJuego === true) || empate === true) && rondaActual < 2) {
            setMostrarJuego(false);
            setRondaActual((prevRonda) => prevRonda + 1);
            iniciarSegundaRonda();
        } 
    }, [jugadores, rondaActual, empate]);


    //Modificamos los guiones del jugador actual sin tocar los del otro jugador
    const actualizarListaGuionesJugador = (nuevoGuiones) => {
        setJugadores((prevJugadores) => {
            const jugadoresActualizados = [...prevJugadores];
            jugadoresActualizados[jugadorActual] = {
                ...jugadoresActualizados[jugadorActual], 
                juego: {
                    ...jugadoresActualizados[jugadorActual].juego, 
                    listaGuiones: nuevoGuiones 
                }
            };
            return jugadoresActualizados;
        });
    };

    //Le damos guiones a un jugador si no los tiene y sino le damos al juego una listaGuiones
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


    //Esta funcion evalua 4 casos posibles para abarcar todas las posibles opciones dentro del juego y asi si o si determinar un posible
    //ganador esto lo hace a traves del estadoJuego que tiene cada jugador que se marca como true si gano y false sino gano
    const determinarGanadorFinal = () => {
        // Caso 1: El jugador 0 ha ganado y el jugador 1 no
        if (jugadores[0].juego.estadoJuego === true && jugadores[1].juego.estadoJuego === false) {
            pruebita = jugadores[0].nombre
            return jugadores[0].nombre;
        }

        // Caso 2: Ambos jugadores terminaron y ganaron los 2 entonces compara el tiempo
        else if (jugadores[0].juego.estadoJuego === true && jugadores[1].juego.estadoJuego === true) {
            const tiempo1 = tiemposJugadores[0];  
            const tiempo2 = tiemposJugadores[1];  
            if (tiempo1 < tiempo2) {
                pruebita = jugadores[0].nombre
                return jugadores[0].nombre;
            } else if (tiempo2 < tiempo1) {
                pruebita = jugadores[1].nombre
                return jugadores[1].nombre;
            } else {
                return "Empate por tiempo";
            }
        }

        // Caso 3: Ningún jugador gano pero comparamos por tiempo para ver quien gana
        else if (jugadores[0].juego.estadoJuego === false && jugadores[1].juego.estadoJuego === false) {
            const tiempo1 = tiemposJugadores[0];  
            const tiempo2 = tiemposJugadores[1];  
            if (tiempo1 < tiempo2) {
                pruebita = jugadores[0].nombre
                return jugadores[0].nombre;

            } else if (tiempo2 < tiempo1) {
                pruebita = jugadores[1].nombre

                return jugadores[1].nombre;
            } else {
                return "Empate por tiempo";
            }
        }

        // Caso 4:si el jugador 0 perdio entonces gano el 1 por descarte de los otros casos
        else {
            pruebita = jugadores[1].nombre

            return jugadores[1].nombre;
        }
    };


    //Hacemos una llamada al API que tenemos en el backend pidiendo los datos del historial de los jugadores para asi mostrarlos
    // ademas de estos lo seteamos y comprobamos de que se haya terminado correctamente
    const obtenerHistorial = async () => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5100/api/estadistica/historial');

            if (!response.ok) {
                throw new Error("No se pudo obtener el historial.");
            }

            const data = await response.json();
            console.log("Historial recibido:", data);  // Esto te permite ver los datos recibidos del backend
            setHistorial(data);  // Guardamos los datos del historial en el estado
        } catch (error) {
            setError(error.message);  // Guardamos el mensaje de error en el estado
        } finally {
            setCargando(false);
        }
    };

    //Aqui hice esto porque ocupaba que se hicieran las 2 llamadas para que asi este el historial primero 
    //Y ya luego se pueda cargar sin problema
    const accionDobleHistorial = () => {
        abrirModalHistorial();
        obtenerHistorial();
    };

    //Esta funcion lo que hace es por medio del jugador y su fallo determina en que imagen esta y dependiendo de si coincide le aumneta
    //pero sin pasarse de las que se le asigno 
    const actualizarImagen = (jugador, fallo) => {
        setImagenAhorcado(imagenAnterior =>
            imagenAnterior.map(img =>
                img.jugador === jugador ? { ...img, fallo: Math.min(img.fallo + 1, imagenes.length - 1) } : img
            )
        );
    };

    //Esta parte se puede ver como el menú principal
    //donde estan los botones y la parte del html
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
                            <button id="botonesBonitos" onClick={accionDobleHistorial}>
                                <span aria-label="botonHistorial">Historial de partidas</span>
                            </button>
                        </li>
                    </ul>
                </ul>
            )}

            {/* si la condicion es verdadera actualizamos el componente */}
            {ventanaAbierta && (
                <NombresJugadores
                    setJugadores={setJugadores}
                    cerrarVentana={CerrarVentanaEmergente}
                    setMostrarJuego={setMostrarJuego}
                    setPalabraAhorcado={setPalabraAhorcado}
                    setLargo={setLargo}
                />
            )}

            {/* Si la condicion se cumple entonces mostramos el historial en un modal con sus respectivos datos */}
            {modalHistorialAbierto && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={cerrarModalHistorial}>&times;</span>
                        <h3>Historial de Partidas</h3>
                        {historial.length > 0 ? (
                            <ul>
                                {historial.map((partida, index) => (
                                    <li key={index}>
                                        Nombre: {partida.nombre} - Ganador juego: {partida.ganador}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay historial disponible.</p>
                        )}
                    </div>
                </div>
            )}
            {mostrarJuego && juegoAhorcado()}
        </div>
    );

    //Aqui iniciamos la segunda, pero primero le pedimos al backend una nueva palabra para asignarla a cada jugador respectivamente
    //De esta forma prevenimos fallos y reiniciamos los datos, además asignamos los guiones para la nueva palabra e igual imagenes,
    //Se puede ver como un reset general.
    async function iniciarSegundaRonda() {
        const nuevaPalabra = await obtenerNuevaPalabra();
        const nuevaPalabra2 = await obtenerNuevaPalabra();
        jugadores[0].juego.palabra = nuevaPalabra; // Asignar la nueva palabra al jugador
        jugadores[1].juego.palabra = nuevaPalabra2
        jugadores[0].juego.LetrasEscogidas = ({});
        jugadores[1].juego.LetrasEscogidas = ({});
        jugadores[0].juego.intentos = (5);
        jugadores[1].juego.intentos = (5);
        jugadores[0].juego.listaGuiones = nuevaPalabra.split('').map(() => '_');
        jugadores[1].juego.listaGuiones = nuevaPalabra2.split('').map(() => '_');
        setListaGuiones(jugadores[0].juego.listaGuiones);
        setListaGuiones(jugadores[1].juego.listaGuiones);
        setImagenAhorcado([{ jugador: 0, fallo: 0 }, { jugador: 1, fallo: 0 }]);
        jugadores[0].juego.completada = false;
        jugadores[1].juego.completada = false;
        setMostrarJuego(true);
        setCulmine(true);
    }

    //Le pedimos al backend por medio de la API que nos de una palabra para asi asignarla en la nueva ronda
    async function obtenerNuevaPalabra() {
        try {
            const response = await fetch('http://localhost:5100/api/palabra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log("Nueva palabra:", data.palabra);
            return data.palabra; // Retornamos la palabra para usarla en la siguiente ronda
        } catch (error) {
            console.error('Error al obtener la nueva palabra:', error);
        }
    }

    //Aqui tenemos el cuerpo de lo que es la ronda en general que lo que hacemos es por medio del alfabeto si el jugador selecciona una letra
    //compara eso con su palabra y de esta forma vemos si alguna letra coincide entonces lo va rellenando y marcando del color correspondiente si esta
    // fue respondida de forma correcta o incorrecta
    function juegoAhorcado() {
        console.log(jugadores);
        const IdentificadorLetra = (letra) => {
            // Llamamos a comprobarLetra para que actualice los guiones con la letra correcta
            const palabra = jugadores[jugadorActual].juego.palabra;
            comprobarLetra(letra, palabra); //ordenJugador(jugadores).jugador.juego.palabra);
        }

        const estiloBoton = (letra, jugadorActual) => {
            if (!jugadores[jugadorActual] || !jugadores[jugadorActual].juego || !jugadores[jugadorActual].juego.LetrasEscogidas) {
                return {}; // Retorna un objeto vacío en caso de que no esté definido
            }

            const letrasEscogidas = jugadores[jugadorActual]?.juego.LetrasEscogidas;
            console.log("Letras escogidas para el jugador actual:", letrasEscogidas);

            return {
                backgroundColor: jugadores[jugadorActual]?.juego.LetrasEscogidas[letra] === "correcta" ? "green" :
                    jugadores[jugadorActual]?.juego.LetrasEscogidas[letra] === "incorrecta" ? "red" : "white",
                color: "black",
            };
        };

        let palabraFormada = "";
        if (jugadores[jugadorActual] && jugadores[jugadorActual].juego && jugadores[jugadorActual].juego.listaGuiones) {
            palabraFormada = jugadores[jugadorActual].juego.listaGuiones.join('');
        }

        return (
            <div id="Alfabeto">
                <h3>
                    Es turno de {jugadores[jugadorActual].nombre}
                </h3>
                {esGanador2 !== null && (
                    <h2>{esGanador2} ha ganado la partida</h2>
                )}

                <p id="Guiones">{listaGuiones.join(" ")}</p>

                <img src={imagenes[imagenAhorcado.find(img => img.jugador === jugadorActual).fallo]} alt="Imagen del ahorcado" />
                <br />

                <button style={estiloBoton("A", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("A")}
                    disabled={LetrasEscogidas["A"] === "correcta" || LetrasEscogidas["A"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  A
                </button>
                <button style={estiloBoton("B", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("B")}
                    disabled={LetrasEscogidas["B"] === "correcta" || LetrasEscogidas["B"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  B
                </button>
                <button style={estiloBoton("C", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("C")}
                    disabled={LetrasEscogidas["C"] === "correcta" || LetrasEscogidas["C"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  C
                </button>
                <button style={estiloBoton("D", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("D")}
                    disabled={LetrasEscogidas["D"] === "correcta" || LetrasEscogidas["D"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  D
                </button>
                <button style={estiloBoton("E", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("E")}
                    disabled={LetrasEscogidas["E"] === "correcta" || LetrasEscogidas["E"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  E
                </button>
                <button style={estiloBoton("F", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("F")}
                    disabled={LetrasEscogidas["F"] === "correcta" || LetrasEscogidas["F"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  F
                </button>
                <button style={estiloBoton("G", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("G")}
                    disabled={LetrasEscogidas["G"] === "correcta" || LetrasEscogidas["G"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  G
                </button>
                <br />
                <button style={estiloBoton("H", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("H")}
                    disabled={LetrasEscogidas["H"] === "correcta" || LetrasEscogidas["H"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  H
                </button>
                <button style={estiloBoton("I", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("I")}
                    disabled={LetrasEscogidas["I"] === "correcta" || LetrasEscogidas["I"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  I
                </button>
                <button style={estiloBoton("J", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("J")}
                    disabled={LetrasEscogidas["J"] === "correcta" || LetrasEscogidas["J"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  J
                </button>
                <button style={estiloBoton("K", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("K")}
                    disabled={LetrasEscogidas["K"] === "correcta" || LetrasEscogidas["K"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  K
                </button>
                <button style={estiloBoton("L", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("L")}
                    disabled={LetrasEscogidas["L"] === "correcta" || LetrasEscogidas["L"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  L
                </button>
                <button style={estiloBoton("M", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("M")}
                    disabled={LetrasEscogidas["M"] === "correcta" || LetrasEscogidas["M"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  M
                </button>
                <button style={estiloBoton("N", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("N")}
                    disabled={LetrasEscogidas["N"] === "correcta" || LetrasEscogidas["N"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  N
                </button>
                <br />
                <button style={estiloBoton("O", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("O")}
                    disabled={LetrasEscogidas["O"] === "correcta" || LetrasEscogidas["O"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  O
                </button>
                <button style={estiloBoton("P", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("P")}
                    disabled={LetrasEscogidas["P"] === "correcta" || LetrasEscogidas["P"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  P
                </button>
                <button style={estiloBoton("Q", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("Q")}
                    disabled={LetrasEscogidas["Q"] === "correcta" || LetrasEscogidas["Q"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  Q
                </button>
                <button style={estiloBoton("R", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("R")}
                    disabled={LetrasEscogidas["R"] === "correcta" || LetrasEscogidas["R"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  R
                </button>
                <button style={estiloBoton("S", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("S")}
                    disabled={LetrasEscogidas["S"] === "correcta" || LetrasEscogidas["S"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  S
                </button>
                <button style={estiloBoton("T", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("T")}
                    disabled={LetrasEscogidas["T"] === "correcta" || LetrasEscogidas["T"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  T
                </button>
                <button style={estiloBoton("U", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("U")}
                    disabled={LetrasEscogidas["U"] === "correcta" || LetrasEscogidas["U"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  U
                </button>
                <br />
                <button style={estiloBoton("V", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("V")}
                    disabled={LetrasEscogidas["V"] === "correcta" || LetrasEscogidas["V"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  V
                </button>
                <button style={estiloBoton("W", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("W")}
                    disabled={LetrasEscogidas["W"] === "correcta" || LetrasEscogidas["W"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  W
                </button>
                <button style={estiloBoton("X", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("X")}
                    disabled={LetrasEscogidas["X"] === "correcta" || LetrasEscogidas["X"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  X
                </button>
                <button style={estiloBoton("Y", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("Y")}
                    disabled={LetrasEscogidas["Y"] === "correcta" || LetrasEscogidas["Y"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  Y
                </button>
                <button style={estiloBoton("Z", jugadorActual)} id="botonLetra" onClick={() => IdentificadorLetra("Z")}
                    disabled={LetrasEscogidas["Z"] === "correcta" || LetrasEscogidas["Z"] === "incorrecta" || jugadores[jugadorActual].juego.intentos === 0
                        || palabraFormada === jugadores[jugadorActual]?.juego?.palabra?.toUpperCase()}>  Z
                </button>
            </div>
        );
    }

    //Esta es para que cuando el backend me da los jugadores yo por medio de un random me diga quien va primero
    function ordenJugador(jugadores) {
        let ordenJuego;
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


    //Esta es para que comparemos la letra con la palabra si la letra coincide con alguna letra de la palabra la vamos rellenando e igual sus guiones
    // con la letra correspondiente, siempre realizamos copia a los guiones y tambien determinamos si después de X cantidad de intentos que ya se empato
    //o que si necesitamos jugar otra ronda o si ya se puede determinar un ganador por medio de la ronda actual y las condiciones, todo esto fue especialmente
    //Para determinar su ganador
    function comprobarLetra(letra, palabra) {
        setTiempoEmpieza(true);
        // Si el jugador ya adivinó la palabra, no continuamos
        if (jugadores[jugadorActual].juego.completada) {
            return;
        }

        let palabraCorrecta = false;
        const nuevaListaGuiones = [...jugadores[jugadorActual].juego.listaGuiones];
        let contador = 0;
        let fallo = false;

        // Recorremos la palabra y comparamos letra por letra
        while (contador < palabra.length) {

            if (letra.toLowerCase() === palabra[contador].toLowerCase()) {
                nuevaListaGuiones[contador] = letra;
                palabraCorrecta = true;
            }

            contador++;
        }

        // Actualizamos la lista de guiones si la letra es correcta
        if (palabraCorrecta) {
            actualizarListaGuionesJugador(nuevaListaGuiones);
        }

        // Actualizar las letras escogidas y rondas
        setJugadores((prevJugadores) => {
            const jugadoresActualizados = [...prevJugadores];
            jugadoresActualizados[jugadorActual] = {
                ...jugadoresActualizados[jugadorActual],
                juego: {
                    ...jugadoresActualizados[jugadorActual].juego,
                    LetrasEscogidas: {
                        ...jugadoresActualizados[jugadorActual].juego.LetrasEscogidas,
                        [letra]: palabraCorrecta ? "correcta" : "incorrecta",
                    },
                },
            };
            return jugadoresActualizados;
        });

        jugadores[jugadorActual].juego.rondas[contadorRondas] = palabraCorrecta;

        
        if (!palabraCorrecta) {
            fallo = true;
            jugadores[jugadorActual].juego.rondas[contadorRondas] = false;
        }
        // Reducimos los intentos
        if (fallo) {
            setJugadores((prevJugadores) => {
                const jugadoresActualizados = [...prevJugadores];
                jugadoresActualizados[jugadorActual] = {
                    ...jugadoresActualizados[jugadorActual],
                    juego: {
                        ...jugadoresActualizados[jugadorActual].juego,
                        intentos: Math.max(jugadoresActualizados[jugadorActual].juego.intentos - 1, 0),
                    },
                };
                return jugadoresActualizados;
            });

            actualizarImagen(jugadorActual, fallo);
            if (
                jugadores[0].juego.intentos === 1 &&
                jugadores[1].juego.intentos === 1
            ) {
                console.log("¡Nadie ganó, es un empate!");

                setTiempoEmpieza(false);
                setEmpate(true);
                if (rondaActual === 2) {
                    setPrueba(true);
                    const esGanador = determinarGanadorFinal()
                    return esGanador
                }

                return; 
            }

            // Si el jugador aún tiene intentos, cambiar turno
            if (jugadores[jugadorActual].juego.intentos > 0) {
                setJugadorActual(jugadorActual === 0 ? 1 : 0);
            }
        }


        // Actualizamos el estado del jugador a ganador
        const actualizarEstadoJuego = (jugadorActual) => {
            setJugadores((prevJugadores) => {
                const nuevosJugadores = [...prevJugadores];
                nuevosJugadores[jugadorActual] = {
                    ...nuevosJugadores[jugadorActual],
                    juego: {
                        ...nuevosJugadores[jugadorActual].juego,
                        estadoJuego: true
                    }
                };
                return nuevosJugadores;
            });
        };

        const cadena2 = nuevaListaGuiones.join('');
        const palabraJugadorP = jugadores[jugadorActual].juego.palabra.toUpperCase();

        // Si la palabra está terminada le quitamos los intentos y la marcamos
        if (palabraJugadorP === cadena2) {
            jugadores[jugadorActual].juego.intentos = 0; 
            jugadores[jugadorActual].juego.completada = true;

            // Actualizamos el jugador ganador
            setTiempoEmpieza(false);
            actualizarEstadoJuego(jugadorActual);

            if (rondaActual == 2) {

                pruebita = true;
                setPrueba(true);

            }
        }

        setContadorRondas(contadorRondas + 1);
    }


    
    //Revisamos si hay 2 jugadores, luego definimos el formato a enviar, esperamos la respuesta del API y le enviamos el archivo.
    //Una vez nos confirme que todo esta bien actualizamos el juego para que vuelva a su estado original despues de 5 segundos
    function envioEstadisticas(jugadores) {
        if (!jugadores || jugadores.length < 2) {
            return;
        }
        const enviarJugadores = async () => {
            if (esGanador2 !== null) {
                const datosJugadores = [
                    { Nombre: jugadores[0].nombre, Ganador: esGanador2 },
                    { Nombre: jugadores[1].nombre, Ganador: esGanador2 }
                ];

                try {
                    const response = await fetch('http://localhost:5100/api/estadistica', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(datosJugadores),
                    });

                    if (!response.ok) throw new Error("Error al enviar datos");

                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);

                } catch (error) {
                    console.error("Error al enviar estadísticas:", error);
                }
            } else {
                console.warn("No hay un ganador definido, no se enviarán estadísticas.");
            }
        };

        console.log("Llamando a enviarJugadores...");
        enviarJugadores();
    }


    //Lo que hacemos es enviar los datos al backend para que asi me devuelva estos jugadores con sus atributos y el juego
    function NombresJugadores({ setJugadores, cerrarVentana, setMostrarJuego, setPalabraAhorcado, setRondas, setLargo }) {
        const [jugador1, setJugador1] = useState("");
        const [jugador2, setJugador2] = useState("");

        //Estas funciones son hechas para que se actualicen con el valor del input para los nombres
        const Jugador1Cambio = (e) => setJugador1(e.target.value);
        const Jugador2Cambio = (e) => setJugador2(e.target.value);

        //Funcion para los nombres del backend
        const guardarNombres = async () => {
            const jugadores = [
                { Nombre: jugador1 },
                { Nombre: jugador2 }
            ];
            setJugadores(jugadores)

            try {
                const response = await fetch('http://localhost:5100/api/jugadores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(jugadores), // Convertimos el objeto de los jugadores a un string
                });

                if (response.ok) {
                    const jugadoresARecibir = await response.json();
                    console.log('Se envio el json:', jugadoresARecibir);
                    console.log('Respuesta del backend:', jugadoresARecibir);
                    setJugadores(jugadoresARecibir)
                    setPalabraAhorcado(jugadoresARecibir[0].juego.palabra)
                    setLargo(jugadoresARecibir[0].juego.tamanoPalabra)
                    setIntentos(jugadoresARecibir.map(jugador => jugador.juego.intentos)); //Asigno intentos a cada jugador
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
        //Modal para los inputs de los nombres
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
