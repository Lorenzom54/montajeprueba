import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'http://192.168.0.150:54321'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
const supabase = createClient(supabaseUrl, supabaseKey)

// Obtener todas las obras
export async function fetchObras() {
  let { data: obras, error } = await supabase
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error al obtener obras:', error.message);
    return [];
  }
  return obras;
}

// Obtener una obra por ID
export async function fetchObraById(id) {
  let { data: obra, error } = await supabase
    .from('obras')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) {
    console.error('Error al obtener obra:', error.message);
    return null;
  }
  return obra;
}

// Crear nueva obra
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
    ])
    .select()

  if (error) {
    console.error('Error al insertar obra:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data[0] };
}

// Actualizar obra existente
export async function updateObra(id, updates) {
  const { data, error } = await supabase
    .from('obras')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error al actualizar obra:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data[0] };
}

// Eliminar obra
export async function deleteObra(id) {
  const { data, error } = await supabase
    .from('obras')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar obra:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// Buscar obras por filtros
export async function searchObras(filters = {}) {
  let query = supabase.from('obras').select('*');

  if (filters.estado) {
    query = query.eq('estado', filters.estado);
  }

  if (filters.nombre) {
    query = query.ilike('nombre', `%${filters.nombre}%`);
  }

  if (filters.responsable) {
    query = query.ilike('responsable', `%${filters.responsable}%`);
  }

  if (filters.fecha_inicio) {
    query = query.gte('fecha_inicio', filters.fecha_inicio);
  }

  if (filters.fecha_fin) {
    query = query.lte('fecha_fin', filters.fecha_fin);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error al buscar obras:', error.message);
    return [];
  }

  return data;
}