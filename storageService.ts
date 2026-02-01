
import { supabase } from "../supabaseClient";
import { Beat, User } from '../types';

const BEATS_TABLE = 'beats';
const PROFILES_TABLE = 'profiles';

export const registerUser = async (user: User): Promise<void> => {
  try {
    const { error } = await supabase
      .from(PROFILES_TABLE)
      .upsert({
        id: user.id,
        username: user.username,
        email: user.email.toLowerCase(),
        is_admin: user.isAdmin || false,
        created_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (error) throw error;
  } catch (err: any) {
    console.error("Supabase Registration Error:", err);
    throw new Error(err.message || "Failed to register profile.");
  }
};

export const getUser = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      isAdmin: data.is_admin
    };
  } catch (err) {
    return null;
  }
};

export const saveBeat = async (beat: Beat, audioBlob?: Blob, coverBlob?: Blob): Promise<string> => {
  let audioUrl = beat.audioUrl;
  let coverUrl = beat.coverUrl;
  const timestamp = Date.now();

  try {
    // 1. Upload Audio with Cache Control for faster production performance
    if (audioBlob) {
      const fileName = `audio_${beat.id}_${timestamp}.mp3`;
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, audioBlob, { 
          upsert: true,
          cacheControl: '3600',
          contentType: 'audio/mpeg'
        });
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrl } = supabase.storage.from('audio').getPublicUrl(fileName);
      audioUrl = publicUrl.publicUrl;
    }

    // 2. Upload Cover
    if (coverBlob) {
      const fileName = `cover_${beat.id}_${timestamp}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(fileName, coverBlob, { 
          upsert: true,
          cacheControl: '3600',
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from('covers').getPublicUrl(fileName);
      coverUrl = publicUrl.publicUrl;
    }

    // 3. Save Metadata to Supabase
    const { error: dbError } = await supabase
      .from(BEATS_TABLE)
      .insert([{
        id: beat.id,
        title: beat.title,
        producer: beat.producer,
        genre: beat.genre,
        bpm: beat.bpm,
        price: beat.price,
        audio_url: audioUrl,
        cover_url: coverUrl,
        mood: beat.mood,
        description: beat.description,
        is_hot: beat.isHot || false,
        is_trending: beat.isTrending || false,
        created_at: new Date().toISOString()
      }]);

    if (dbError) throw dbError;
    return beat.id;
  } catch (error: any) {
    console.error("Supabase Save Error:", error);
    throw new Error(error.message || "Cloud Sync Failed. Ensure Supabase storage buckets 'audio' and 'covers' exist and are PUBLIC.");
  }
};

export const subscribeToBeats = (callback: (beats: Beat[]) => void) => {
  getAllBeats().then(callback);

  const channel = supabase
    .channel('realtime_beats_changes')
    .on('postgres_changes', { event: '*', table: BEATS_TABLE }, () => {
      getAllBeats().then(callback);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getAllBeats = async (): Promise<Beat[]> => {
  try {
    const { data, error } = await supabase
      .from(BEATS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map(b => ({
      id: b.id,
      title: b.title,
      producer: b.producer,
      genre: b.genre,
      bpm: b.bpm,
      price: b.price,
      audioUrl: b.audio_url,
      coverUrl: b.cover_url,
      mood: b.mood || [],
      description: b.description,
      isHot: b.is_hot,
      isTrending: b.is_trending,
      key: 'C Minor'
    }));
  } catch (err) {
    return [];
  }
};

export const deleteBeat = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(BEATS_TABLE)
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
