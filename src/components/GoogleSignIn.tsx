import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        }
      }
    }
  }
}

interface GoogleSignInProps {
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin' | 'signup' | 'continue';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  width?: string;
}

export default function GoogleSignIn({ 
  text = 'continue_with', 
  theme = 'outline', 
  size = 'large',
  shape = 'rectangular',
  width = '100%'
}: GoogleSignInProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { loginWithGoogle, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && buttonRef.current) {
        setIsGoogleLoaded(true);
        
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Clear any existing content
        buttonRef.current.innerHTML = '';
        
        window.google.accounts.id.renderButton(buttonRef.current, {
          text,
          theme,
          size,
          shape,
          width,
        });
      } else {
        // If Google not loaded yet, try again after a short delay
        setTimeout(initializeGoogle, 100);
      }
    };

    initializeGoogle();
  }, [text, theme, size, shape, width]);

  const handleCredentialResponse = async (response: any) => {
    try {
      await loginWithGoogle(response.credential);
      
      // Get redirect URL from query params or default to dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      const action = searchParams.get('action');
      
      toast.success('Successfully signed in with Google!');
      
      // If there's a specific action, append it to the redirect
      if (action) {
        navigate(`${redirectTo}?action=${action}`, { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div 
        ref={buttonRef} 
        className={`google-signin-button ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        style={{ width }}
      />
      {!isGoogleLoaded && (
        <div className="w-full h-10 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-gray-500 text-sm">
          Loading Google Sign-In...
        </div>
      )}
    </div>
  );
}