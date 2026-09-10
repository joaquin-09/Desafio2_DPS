import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

// Usuario y contraseña definidos en variables locales
const USUARIOS_VALIDOS = [
  { usuario: 'cliente', password: '1234' },
  { usuario: 'admin', password: 'admin123' },
];

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const iniciarSesion = () => {
    if (!usuario.trim() || !password.trim()) {
      setError('Ingresa tu usuario y contraseña.');
      return;
    }

    const encontrado = USUARIOS_VALIDOS.find(
      (u) => u.usuario === usuario.trim() && u.password === password
    );

    if (!encontrado) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    setError('');
    router.replace('/main/catalogo');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.emoji}>🌮</Text>
        <Text style={styles.titulo}>El Buen Sabor</Text>
        <Text style={styles.subtitulo}>Comida mexicana a tu mesa</Text>

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="cliente"
          value={usuario}
          onChangeText={(v) => {
            setUsuario(v);
            setError('');
          }}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setError('');
          }}
          secureTextEntry
        />

        {error !== '' && <Text style={styles.errorText}>⚠ {error}</Text>}

        <TouchableOpacity style={styles.btnPrimario} onPress={iniciarSesion}>
          <Text style={styles.btnPrimarioText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.ayuda}>Usuario de prueba: cliente / 1234</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff4e6', justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  emoji: { fontSize: 40, textAlign: 'center', marginBottom: 4 },
  titulo: { fontSize: 26, fontWeight: '800', color: '#7a2e0e', textAlign: 'center' },
  subtitulo: { fontSize: 13, color: '#8a6a5a', textAlign: 'center', marginBottom: 24 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8a6a5a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff4e6',
    borderWidth: 1.5,
    borderColor: '#f0d9c4',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 6,
  },
  errorText: { color: '#c0392b', fontSize: 13, marginTop: 6 },
  btnPrimario: {
    backgroundColor: '#e85d2c',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  btnPrimarioText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  ayuda: { textAlign: 'center', color: '#8a6a5a', fontSize: 11, marginTop: 14 },
});