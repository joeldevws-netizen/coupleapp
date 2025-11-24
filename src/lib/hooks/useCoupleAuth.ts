import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface CoupleAuth {
  coupleId: string | null;
  coupleCode: string | null;
  partnerName: string | null;
  isAuthenticated: boolean;
  anniversaryDate: string | null;
}

const STORAGE_KEYS = {
  COUPLE_ID: 'couple-id',
  COUPLE_CODE: 'couple-code',
  PARTNER_NAME: 'partner-name',
};

export function useCoupleAuth() {
  const [auth, setAuth] = useState<CoupleAuth>({
    coupleId: null,
    coupleCode: null,
    partnerName: null,
    isAuthenticated: false,
    anniversaryDate: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const coupleId = localStorage.getItem(STORAGE_KEYS.COUPLE_ID);
    const coupleCode = localStorage.getItem(STORAGE_KEYS.COUPLE_CODE);
    const partnerName = localStorage.getItem(STORAGE_KEYS.PARTNER_NAME);

    if (coupleId && coupleCode && partnerName) {
      // Verify couple still exists in database
      verifyCouple(coupleId, coupleCode, partnerName);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyCouple = async (id: string, code: string, name: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('couples')
        .select('*')
        .eq('id', id)
        .eq('couple_code', code)
        .single();

      if (error || !data) {
        logout();
        return;
      }

      setAuth({
        coupleId: id,
        coupleCode: code,
        partnerName: name,
        isAuthenticated: true,
        anniversaryDate: data.anniversary_date,
      });
    } catch (error) {
      console.error('Error verifying couple:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const createCouple = async (partnerName: string, anniversaryDate: string) => {
    try {
      setLoading(true);

      // Generate unique code
      const { data: codeData, error: codeError } = await (supabase as any)
        .rpc('generate_couple_code');

      if (codeError) throw codeError;

      const coupleCode = codeData as string;

      // Create couple
      const { data, error } = await (supabase as any)
        .from('couples')
        .insert([
          {
            couple_code: coupleCode,
            partner1_name: partnerName,
            anniversary_date: anniversaryDate,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.COUPLE_ID, data.id);
      localStorage.setItem(STORAGE_KEYS.COUPLE_CODE, coupleCode);
      localStorage.setItem(STORAGE_KEYS.PARTNER_NAME, partnerName);
      
      // Migrate localStorage date to Supabase
      const oldAnniversary = localStorage.getItem('couple-app-anniversary');
      if (oldAnniversary && oldAnniversary !== anniversaryDate) {
        await (supabase as any)
          .from('couples')
          .update({ anniversary_date: oldAnniversary })
          .eq('id', data.id);
      }

      setAuth({
        coupleId: data.id,
        coupleCode,
        partnerName,
        isAuthenticated: true,
        anniversaryDate: data.anniversary_date,
      });

      return { success: true, coupleCode };
    } catch (error: any) {
      console.error('Error creating couple:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const joinCouple = async (coupleCode: string, partnerName: string) => {
    try {
      setLoading(true);

      // Validate input
      const trimmedCode = coupleCode.toUpperCase().trim();
      const trimmedName = partnerName.trim();

      if (trimmedCode.length !== 6) {
        return { success: false, error: 'El código debe tener 6 caracteres' };
      }

      if (!trimmedName) {
        return { success: false, error: 'Por favor ingresa tu nombre' };
      }

      // Find couple by code
      console.log('Buscando pareja con código:', trimmedCode);
      const { data, error } = await (supabase as any)
        .from('couples')
        .select('*')
        .eq('couple_code', trimmedCode)
        .single();

      console.log('Resultado de búsqueda:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Código de pareja no encontrado. Verifica que sea correcto.' };
        }
        console.error('Error de Supabase al buscar pareja:', error);
        return { success: false, error: 'Error de conexión. Verifica tu configuración de Supabase.' };
      }

      if (!data) {
        return { success: false, error: 'Código de pareja no encontrado' };
      }

      // Check if already a member
      if (data.partner1_name === trimmedName || data.partner2_name === trimmedName) {
        console.log('Usuario ya es miembro de esta pareja');
      }

      // Update partner2 name if not set
      if (!data.partner2_name) {
        console.log('Actualizando nombre del segundo miembro...');
        const { error: updateError } = await (supabase as any)
          .from('couples')
          .update({ partner2_name: trimmedName })
          .eq('id', data.id);
        
        if (updateError) {
          console.error('Error actualizando partner2:', updateError);
        }
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.COUPLE_ID, data.id);
      localStorage.setItem(STORAGE_KEYS.COUPLE_CODE, trimmedCode);
      localStorage.setItem(STORAGE_KEYS.PARTNER_NAME, trimmedName);

      setAuth({
        coupleId: data.id,
        coupleCode: trimmedCode,
        partnerName: trimmedName,
        isAuthenticated: true,
        anniversaryDate: data.anniversary_date,
      });

      console.log('✅ Unión exitosa a la pareja');
      return { success: true };
    } catch (error: any) {
      console.error('Error inesperado al unirse a pareja:', error);
      return { success: false, error: 'Error inesperado: ' + error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.COUPLE_ID);
    localStorage.removeItem(STORAGE_KEYS.COUPLE_CODE);
    localStorage.removeItem(STORAGE_KEYS.PARTNER_NAME);
    setAuth({
      coupleId: null,
      coupleCode: null,
      partnerName: null,
      isAuthenticated: false,
      anniversaryDate: null,
    });
  };

  return {
    ...auth,
    loading,
    createCouple,
    joinCouple,
    logout,
  };
}
