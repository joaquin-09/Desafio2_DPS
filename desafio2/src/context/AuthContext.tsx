import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  usuarioActual: string | null;
  iniciarSesion: (usuario: string) => void;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioActual, setUsuarioActual] = useState<string | null>(null);

  const iniciarSesion = (usuario: string): void => {
    setUsuarioActual(usuario);
  };

  const cerrarSesion = (): void => {
    setUsuarioActual(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioActual, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return contexto;
}