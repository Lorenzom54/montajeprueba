import { addObra } from '../../../lib/obra_api';

export const prerender = false;

export async function POST({ request }) {
  try {
    const body = await request.json();

    const { nombre, estado, fecha_inicio, fecha_fin, ubicacion, responsable, descripcion } = body;

    const data = await addObra({
      nombre,
      estado,
      fecha_inicio,
      fecha_fin,
      ubicacion,
      responsable,
      descripcion
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error en /api/obras/create:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error al crear la obra' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
