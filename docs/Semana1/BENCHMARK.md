
# 📊 Benchmark Competitivo: Tag Human Universal

Fecha: Enero 2026

Objetivo: Analizar la posición de Tag Human Universal frente a las soluciones líderes de administración de condominios en México.

## 1. El Panorama Actual (Los Gigantes)

En el mercado mexicano existen tres grandes jugadores ("The Big 3") que dominan el control de accesos. Sin embargo, todos comparten el mismo modelo mental: **"Centrado en el Residente"**.

1.  **Neivor:** El líder en administración financiera.1 Su fuerza es cobrar cuotas y reservar áreas comunes.2 El acceso es un módulo secundario basado en invitaciones.3
    
    +2
    
2.  **Parkimóvil:** Gigante en estacionamientos públicos y comerciales.4 Usan lectores de placas costosos y tótems físicos.
    
3.  **Munily / LobbyFix:** Enfocados en la "Experiencia de Visita". Excelentes para oficinas, pero requieren que el residente genere un QR por cada visita.
    

----------

## 2. Matriz Comparativa (Head-to-Head)

Aquí es donde **Tag Human Universal** brilla. Mientras los demás se enfocan en cobrar el mantenimiento, nosotros nos enfocamos en **la velocidad del acceso**.


| Característica | 🏢 Neivor / Munily | 🚗 Parkimóvil | ⚡ Tag Human (Nosotros) |
| :--- | :--- | :--- | :--- |
| **Modelo de Acceso** | **Basado en Eventos.** El residente _debe_ crear una invitación cada vez. | **Hardware.** Requiere barreras, lectores de placas o tótems propietarios. | **Basado en Identidad.** El repartidor trae su pase permanente. El residente no hace nada. |
| **Tecnología QR** | **Estático / Invitación.** Se puede tomar captura de pantalla y compartir (inseguro). | **Estático** (Pegado en la pluma) o RFID. | **Dinámico (TOTP).** Cambia cada 30s. Imposible de clonar con screenshots. |
| **Hardware Requerido** | Tablet + App de Guardia. | Plumas automatizadas, Cámaras LPR (Costo alto). | **Cualquier Celular/Tablet** con navegador Web (Costo $0). |
| **Fricción Repartidor** | Alta. Debe esperar a que el residente le mande el QR o registrarse manual. | Media. Debe descargar una app pesada para abrir la pluma. | **Nula.** PWA ligera. Se registra una vez y entra a todos lados. |
| **Privacidad** | Media. Los datos quedan en la administración del condominio. | Baja. Rastreo por placas en toda la ciudad. | **Alta.** Validación visual efímera (Solo se ve al escanear). |

----------

## 3. Análisis de Oportunidad ("El Océano Azul")

Los competidores están peleando por venderle software al **Administrador del Condominio** para gestionar finanzas.

-   _El problema:_ Ignoran al **Repartidor**, que es quien genera el 80% del tráfico en la caseta.
    

Nuestra Ventaja Injusta:

Mientras Neivor obliga al residente a decir: "¡Ah! Ya viene la pizza, deja genero un QR y se lo mando por WhatsApp al repartidor..." (Proceso lento y propenso a olvidos), Tag Human permite que el repartidor llegue y diga: "Ya tengo mi identidad verificada, escanéame".

> **Conclusión:** Somos la única solución **"Driver-First"** (Primero el Repartidor). Resolvemos el cuello de botella en la caseta, no la cobranza en la oficina.

----------

## 4. Análisis Técnico del Stack (Node vs. Competencia)

Muchos competidores usan tecnologías "Enterprise" antiguas (.NET, Java) o Apps Nativas pesadas que tardan meses en actualizarse.


| Factor | Competencia (Legacy) | Tag Human (Modern Stack) |
| :--- | :--- | :--- |
| **Actualizaciones** | **Lentas.** Esperar aprobación de App Store (2 días). | **Inmediatas.** Despliegue CI/CD en Web (2 minutos). |
| **Compatibilidad** | Limitada a iOS/Android recientes. | **Universal.** Funciona en el Alcatel de $500 pesos del guardia. |
| **Costos de Servidor** | Altos (Monolitos pesados). | **Bajos.** Microservicios Node.js ligeros en Docker. |

----------

### 🎥 Referencia Visual (Para entender a la competencia)

Para que entiendas cómo lo venden "los grandes" y notes la diferencia (ellos venden "comodidad para el residente", tú vendes "seguridad y velocidad"), revisa este video de Neivor. Fíjate cómo enfatizan que el residente tiene que **enviar** el QR.

[¿Cómo controlar quién entra a tu residencial? Seguridad en vivienda](https://www.youtube.com/watch?v=kMxbS4S9l20)

**Por qué es relevante:** Este video muestra el "status quo" que estamos desafiando. Ellos dependen de la acción del residente; tu sistema elimina ese paso usando identidad permanente.5