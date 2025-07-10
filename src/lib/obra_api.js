import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'http://192.168.0.150:54321'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
const supabase = createClient(supabaseUrl, supabaseKey)


export async function fetchObras() {
  let { data: obras, error } = await supabase
    .from('obras')
    .select('*')
    if (error){
      return [];
    }
    return obras;
}

export async function addObra({ nombre, estado, fecha_inicio, fecha_fin, ubicacion, responsable, descripcion }) {
  const { data, error } = await supabase
    .from('obras')
    .insert([
      {
        nombre,
        estado,
        fecha_inicio,
        fecha_fin,
        ubicacion,
        responsable,
        descripcion
      }
    ]);

  if (error) {
    console.error('Error al insertar obra:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}


//TODO Agregar todos las necesitdades de Obrazs