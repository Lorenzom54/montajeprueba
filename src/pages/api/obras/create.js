import { addObra } from '../../../lib/obra_api';

export const prerender = false;

export async function POST({ request }) {
  try {
    const body = await request.json();

    const { nombre, estado, fecha_inicio, fecha_fin, ubicacion, responsable, descripcion } = body;

    // Validaciones básicas
    if (!nombre || !estado || !fecha_inicio) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Los campos nombre, estado, fecha de inicio' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await addObra({
      nombre,
      estado,
      fecha_inicio,
      fecha_fin,
      ubicacion,
      responsable,
      descripcion,
    });

    if (!result.success) {
      return new Response(JSON.stringify(result), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 201,
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