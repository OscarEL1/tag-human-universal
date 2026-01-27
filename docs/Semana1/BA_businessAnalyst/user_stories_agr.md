

{/** Historias de Usuario – Tag Human Universal

(Versión Business Analyst – Estudiante)**/}


{/** HU-01 Registro de Repartidor
DESCRIPCIÓN

Como repartidor
Puedo registrar mis datos personales, placas y subir mis fotos (perfil e identificación)
Para crear una identidad digital que me permita acceder a los fraccionamientos de forma segura

CRITERIOS DE ACEPTACIÓN

Debe de permitir ingresar un número telefónico, placas y subir dos imágenes

Dado que el repartidor se encuentra en la pantalla de registro
Cuando ingresa correctamente todos sus datos y fotos
Entonces el sistema debe crear la cuenta y mostrar un mensaje de registro exitoso **/}


{/** HU-02 Generación de Código QR Dinámico
DESCRIPCIÓN

Como repartidor
Puedo visualizar un código QR dinámico en mi pantalla principal
Para mostrarlo al guardia y poder ingresar sin necesidad de portar una credencial física

CRITERIOS DE ACEPTACIÓN

Debe de regenerar el código QR automáticamente cada 30 segundos

Dado que el repartidor ya inició sesión en la aplicación
Cuando transcurren 30 segundos desde la generación del QR
Entonces el sistema debe generar un nuevo código QR automáticamente **/}


{/** HU-03 Validación de Acceso por Guardia
DESCRIPCIÓN

Como guardia de seguridad
Puedo escanear el código QR del repartidor
Para validar su identidad y autorizar o rechazar su acceso

CRITERIOS DE ACEPTACIÓN

Debe de mostrar los datos del repartidor al escanear un QR válido

Dado que el guardia se encuentra en el módulo de escaneo
Cuando escanea un código QR válido
Entonces el sistema debe mostrar la información del repartidor y permitir autorizar el acceso **/}


{/** HU-04 Registro de Salida
DESCRIPCIÓN

Como guardia de seguridad
Puedo registrar la salida de un repartidor
Para llevar un control del flujo de entradas y salidas

CRITERIOS DE ACEPTACIÓN

Debe de permitir registrar una salida aunque no exista un registro previo de entrada

Dado que el repartidor solicita registrar su salida
Cuando el sistema no encuentra una entrada previa
Entonces el sistema debe permitir registrar la salida para no afectar la operación **/}


{/** HU-05 Solicitud de Acceso para Visitante (Residente)
DESCRIPCIÓN

Como residente
Puedo generar una solicitud de acceso para mis visitantes
Para autorizar su entrada al fraccionamiento de forma anticipada

CRITERIOS DE ACEPTACIÓN

Debe de permitir generar un código QR temporal para visitantes

Dado que el residente se encuentra dentro de su perfil
Cuando registra los datos del visitante
Entonces el sistema debe generar un código QR válido para el acceso **/}


{/** HU-06 Historial de Accesos del Residente
DESCRIPCIÓN

Como residente
Puedo consultar el historial de accesos de mis visitantes
Para tener un control de quién ha ingresado a mi domicilio

CRITERIOS DE ACEPTACIÓN

Debe de mostrar una lista con fecha y hora de cada acceso

Dado que el residente ha tenido visitantes registrados
Cuando accede al módulo de historial
Entonces el sistema debe mostrar los accesos realizados **/}


{/** HU-07 Cancelación de Acceso
DESCRIPCIÓN

Como residente
Puedo cancelar un acceso previamente autorizado
Para evitar que un visitante ingrese si ya no es necesario

CRITERIOS DE ACEPTACIÓN

Debe de invalidar el código QR del visitante

Dado que el residente ya generó un acceso
Cuando selecciona la opción de cancelar
Entonces el sistema debe marcar el QR como inválido **/}


