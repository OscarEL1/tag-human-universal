# USER STORIES – TAG HUMAN UNIVERSAL (AGR)

## 🧍‍♂️ REPARTIDOR

---

## HU-R01 Registro de Repartidor

### DESCRIPCIÓN  
**Como** repartidor  
**Puedo** registrar mis datos personales, placas y subir mis fotos (perfil e INE)  
**Para** crear una identidad digital que me permita acceder a fraccionamientos de forma segura  

### CRITERIOS DE ACEPTACIÓN  

**Debe de** validar que el número telefónico tenga exactamente 10 dígitos  
**Debe de** validar que las placas tengan entre 5 y 8 caracteres alfanuméricos  
**Debe de** validar que las imágenes no estén borrosas y sean legibles  

**Dado que** el repartidor se encuentra en la pantalla de registro  
**Cuando** ingresa un teléfono válido, placas correctas y sube ambas imágenes legibles  
**Entonces** el sistema debe crear la cuenta y mostrar el mensaje "Registro exitoso"  

**Dado que** el repartidor sube una imagen borrosa o ilegible  
**Cuando** intenta continuar con el registro  
**Entonces** el sistema debe mostrar el mensaje "La imagen no es válida, por favor vuelva a tomarla"  

---

## HU-R02 Generación de Código QR

### DESCRIPCIÓN  
**Como** repartidor  
**Puedo** visualizar un código QR dinámico en mi pantalla principal  
**Para** mostrarlo al guardia y poder ingresar sin usar una credencial física  

### CRITERIOS DE ACEPTACIÓN  

**Debe de** generar un QR con tiempo de expiración de 30 segundos  
**Debe de** regenerar automáticamente el QR al expirar  
**Debe de** permitir generar el QR aunque no haya conexión a internet  

**Dado que** el repartidor inició sesión correctamente  
**Cuando** accede a la pantalla principal  
**Entonces** el sistema debe mostrar un QR válido con un contador de 30 segundos  

**Dado que** el dispositivo pierde conexión a internet  
**Cuando** el QR expira  
**Entonces** el sistema debe generar un nuevo QR usando la hora del dispositivo  

---

## 🛡️ GUARDIA DE SEGURIDAD

---

## HU-G01 Validación de Acceso

### DESCRIPCIÓN  
**Como** guardia de seguridad  
**Puedo** escanear el código QR del repartidor  
**Para** validar su identidad y autorizar o rechazar el acceso  

### CRITERIOS DE ACEPTACIÓN  

**Debe de** mostrar la foto y datos del repartidor al escanear un QR válido  
**Debe de** mostrar mensaje de error si el QR está vencido  
**Debe de** mostrar mensaje de error si el usuario no existe  

**Dado que** el guardia se encuentra en el módulo de escaneo  
**Cuando** escanea un QR válido  
**Entonces** el sistema debe mostrar la foto del repartidor y el botón "Autorizar acceso"  

**Dado que** el guardia escanea un QR vencido  
**Cuando** el sistema lo valida  
**Entonces** debe mostrar el mensaje "QR vencido"  

**Dado que** el guardia escanea un QR que no existe en el sistema  
**Cuando** se intenta validar  
**Entonces** debe mostrar el mensaje "Usuario no encontrado"  

---

## 🏠 RESIDENTE

---

## HU-RES01 Generar Acceso a Visitante

### DESCRIPCIÓN  
**Como** residente  
**Puedo** generar un acceso para un visitante  
**Para** autorizar su entrada al fraccionamiento  

### CRITERIOS DE ACEPTACIÓN  

**Debe de** permitir generar un QR con fecha y hora de expiración  
**Debe de** invalidar el QR una vez que se haya utilizado  

**Dado que** el residente se encuentra en su perfil  
**Cuando** registra los datos del visitante  
**Entonces** el sistema debe generar un QR válido temporal  



