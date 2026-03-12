const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Manejo de errores de red/credenciales (Resiliencia)
      throw new Error(data.msg || 'Error al conectar con el servidor');
    }

    return data; // Contiene token y user {id, nombre, role}
  } catch (error) {
    console.error('Error crítico en loginUser API:', error);

    // Si el error ya es una instancia de Error, lo propagamos con su mensaje original
    // Si es un error de red o fetch (TypeError), mostramos un mensaje amigable
    throw new Error(
      error.message || 'Error de conexión de red o el servidor no responde'
    );
  }
};