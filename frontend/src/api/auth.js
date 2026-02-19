const API_URL = "http://localhost:5173/api"; // Ajusta a la IP de tu servidor Docker

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
    throw error;
  }
};