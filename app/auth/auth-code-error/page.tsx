// app/auth/auth-code-error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthCodeError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'no_code':
        return 'No authorization code received from Google.';
      case 'no_session':
        return 'Failed to create session after authentication.';
      case 'unexpected_error':
        return 'An unexpected error occurred during authentication.';
      default:
        return error || 'An unknown error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">
                Try Again
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                Go Home
              </Link>
            </Button>
          </div>
          
          {error && (
            <details className="mt-4">
              <summary className="text-xs text-gray-500 cursor-pointer">
                Technical Details
              </summary>
              <pre className="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded">
                Error: {error}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}