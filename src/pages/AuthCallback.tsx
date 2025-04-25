import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Checking URL parameters...');
        
        // Get the hash parameters from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (!accessToken) {
          setError('No access token found in URL');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        setStatus('Setting session...');
        
        // Set the session
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          setError('Error setting session: ' + sessionError.message);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (session) {
          setStatus('Creating user profile...');
          
          // Create or update user in our users table
          const { error: upsertError } = await supabase
            .from('users')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || null,
              avatar_url: session.user.user_metadata?.avatar_url || null,
            });

          if (upsertError) {
            console.error('Error upserting user:', upsertError);
          }

          setStatus('Cleaning up...');
          
          // Clear the URL hash
          window.history.replaceState({}, document.title, window.location.pathname);

          setStatus('Redirecting to dashboard...');
          
          // Redirect to dashboard
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        } else {
          setError('No session found');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        setError('Error in auth callback: ' + (error instanceof Error ? error.message : String(error)));
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <p className="text-center text-gray-700">{status}</p>
      </div>
    </div>
  );
}; 