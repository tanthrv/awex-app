import { useState } from 'react';
import { ClientLoginForm } from '../components/auth/ClientLoginForm';
import { GuideLoginForm } from '../components/auth/GuideLoginForm';

export function LoginScreen() {
  const [mode, setMode] = useState<'client' | 'guide'>('client');

  return (
    <div className="screen-login">
      <div className="login-logo">
        AW<span>Ex</span>App
      </div>
      <div className="login-tagline">Awareness · Wonder · Embodied Alignment</div>

      {mode === 'client' ? <ClientLoginForm /> : <GuideLoginForm />}

      <div
        className="login-toggle"
        onClick={() => setMode(m => m === 'client' ? 'guide' : 'client')}
      >
        {mode === 'guide' ? (
          <>Back to <span>client login</span></>
        ) : (
          <>Are you a guide? <span>Sign in here</span></>
        )}
      </div>
    </div>
  );
}
