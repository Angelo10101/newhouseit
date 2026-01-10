// AuthScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const router = useRouter();

  const [request, response, promptAsync] = Platform.OS === 'web'
    ? [null, null, null]
    : Google.useIdTokenAuthRequest({
        iosClientId: '178886195513-oc848g8b5akchj95bmgjg3al8aiii9rd.apps.googleusercontent.com',
        webClientId: '178886195513-tsd7olkbl12cp85m7c5n7rg16tpas4dc.apps.googleusercontent.com',
      });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { idToken, accessToken } = response.authentication || {};
      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        signInWithCredential(auth, credential)
          .then(() => {
            Alert.alert('Success', 'Signed in with Google successfully!', [
              { text: 'OK', onPress: () => router.push('/(tabs)/profile') }
            ]);
          })
          .catch((error) => {
            Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
          });
      }
    } else if (response?.type === 'error') {
      Alert.alert('Authentication Error', 'Failed to sign in with Google. Please try again.');
    } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
      Alert.alert('Cancelled', 'Google sign-in was cancelled.');
    }
  }, [response]);

  const handleSubmit = async () => {
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.push('/(tabs)/profile') }
        ]);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Success', 'Logged in successfully!', [
          { text: 'OK', onPress: () => router.push('/') }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (Platform.OS === 'web') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        Alert.alert('Success', 'Signed in with Google successfully!', [
          { text: 'OK', onPress: () => router.push('/(tabs)/profile') }
        ]);
      } else {
        if (request) {
          await promptAsync();
        } else {
          Alert.alert('Error', 'Google Sign-In is not ready yet. Please try again in a moment.');
        }
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        Alert.alert('Cancelled', 'Google sign-in was cancelled.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        Alert.alert('Cancelled', 'Google sign-in was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        Alert.alert('Popup Blocked', 'Please allow popups for this site to sign in with Google.');
      } else {
        Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
      }
    }
  };

  const goBackHome = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBackHome} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back to Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'signup' ? 'Sign up to get started' : 'Sign in to your account'}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#7F8C8D"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#7F8C8D"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {mode === 'signup' ? 'Sign Up' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setMode(mode === 'signup' ? 'login' : 'signup')}
        >
          <Text style={styles.switchButtonText}>
            {mode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  submitButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  switchButton: {
    paddingVertical: 12,
  },
  switchButtonText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#999999',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});