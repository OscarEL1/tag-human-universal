# 🤝 Guía de Contribución

¡Bienvenido al equipo de desarrollo de Tag Human Universal! Sigue estas reglas para mantener el código limpio y ordenado.

## 🌳 Estrategia de Ramas (Gitflow Simplificado)

* `main`: **PRODUCCIÓN**. Intocable. Solo recibe cambios desde `develop` vía Pull Request.
* `develop`: **INTEGRACIÓN**. Aquí se une el trabajo de todos. Es la rama base para crear nuevas tareas.
* `feat/nombre-tarea`: Para nuevas funcionalidades (ej. `feat/login-screen`).
* `fix/nombre-bug`: Para corregir errores (ej. `fix/qr-validation`).

## 📝 Reglas de Commits
Usamos **Conventional Commits**. Tus mensajes deben seguir este formato:

* `feat: descripción` -> Para algo nuevo.
* `fix: descripción` -> Para arreglar un bug.
* `docs: descripción` -> Cambios en documentación.
* `chore: descripción` -> Configuración técnica (Docker, configs) sin cambios en código.

**Ejemplo correcto:**
> `feat: agregar validación de placas en el formulario`

## 🛡️ Proceso de Pull Request (PR)
1.  Nunca hagas push directo a `develop` o `main`.
2.  Crea un PR desde tu rama hacia `develop`.
3.  Asigna al **Tech Lead** como revisor (Reviewer).
4.  El código no se mezcla hasta tener **1 aprobación**.

commitlint
