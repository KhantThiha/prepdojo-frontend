// components/auth/login-form.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log(`=== Initiating ${provider} OAuth ===`);
    console.log('Redirect URL:', redirectTo);
    console.log('Current origin:', window.location.origin);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('OAuth initiation error:', error);
        alert(`Error: ${error.message}`);
      } else {
        console.log('OAuth initiated successfully');
        console.log('OAuth URL:', data.url);
        console.log('Provider:', data.provider);
        
        // The browser will automatically redirect to data.url
        // No manual redirect needed
      }
    } catch (err) {
      console.error('Unexpected error during OAuth:', err);
      alert('Unexpected error occurred');
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : 'Continue with Google'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : 'Continue with GitHub'}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          Check browser console for debugging information
        </div>
      </CardContent>
    </Card>
  );
}