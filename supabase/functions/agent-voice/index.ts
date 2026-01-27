import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const DEFAULT_VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger - professional voice

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Text-to-Speech endpoint
    if (path === 'tts' && req.method === 'POST') {
      const { text, voice_id } = await req.json();

      if (!text) {
        return new Response(
          JSON.stringify({ error: 'Text is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const voiceId = voice_id || DEFAULT_VOICE_ID;

      console.log(`TTS request: "${text.substring(0, 50)}..." with voice ${voiceId}`);

      const ttsResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.5,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!ttsResponse.ok) {
        const errorText = await ttsResponse.text();
        console.error('ElevenLabs TTS error:', errorText);
        return new Response(
          JSON.stringify({ error: 'TTS generation failed', details: errorText }),
          { status: ttsResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const audioBuffer = await ttsResponse.arrayBuffer();
      console.log(`TTS successful, audio size: ${audioBuffer.byteLength} bytes`);

      return new Response(audioBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'audio/mpeg',
        },
      });
    }

    // Speech-to-Text endpoint
    if (path === 'stt' && req.method === 'POST') {
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File;

      if (!audioFile) {
        return new Response(
          JSON.stringify({ error: 'Audio file is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`STT request: file size ${audioFile.size} bytes, type: ${audioFile.type}`);

      const apiFormData = new FormData();
      apiFormData.append('file', audioFile);
      apiFormData.append('model_id', 'scribe_v2');
      apiFormData.append('language_code', 'spa'); // Spanish

      const sttResponse = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: apiFormData,
      });

      if (!sttResponse.ok) {
        const errorText = await sttResponse.text();
        console.error('ElevenLabs STT error:', errorText);
        return new Response(
          JSON.stringify({ error: 'STT transcription failed', details: errorText }),
          { status: sttResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const transcription = await sttResponse.json();
      console.log(`STT successful: "${transcription.text?.substring(0, 50)}..."`);

      return new Response(
        JSON.stringify({ text: transcription.text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint. Use /tts or /stt' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Agent voice error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
