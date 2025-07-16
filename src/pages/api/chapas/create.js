import { addChapa } from '../../../lib/chapa_api';

export const prerender = false;

export async function POST({ request }) {
  try {
    const body = await request.json();

    const { codigo, colada, espesor, dimensiones, tipo_acero } = body;

    // Validaciones básicas
    if (!codigo || !tipo_acero) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Los campos código y tipo de acero son obligatorios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await addChapa({
      codigo,
      colada,
      espesor,
      dimensiones,
      tipo_acero,
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
    console.error('Error en /api/chapas/create:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error al crear la chapa' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}