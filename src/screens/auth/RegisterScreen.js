import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();

  // Clean way to update one field without touching others
  // JS concept: spread operator + computed property name
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert('Missing fields', 'Name, email and password are required.');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register(
      form.name.trim(),
      form.email.trim().toLowerCase(),
      form.password,
      form.phone.trim()
    );
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration failed', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brand}>voyara</Text>
            <Text style={styles.tagline}>travel, simplified.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join thousands of travellers</Text>

            {/* Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Charles Orukpe"
                placeholderTextColor="#BBBBBB"
                value={form.name}
                onChangeText={(v) => updateField('name', v)}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#BBBBBB"
                value={form.email}
                onChangeText={(v) => updateField('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Phone */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="08012345678"
                placeholderTextColor="#BBBBBB"
                value={form.phone}
                onChangeText={(v) => updateField('phone', v)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#BBBBBB"
                  value={form.password}
                  onChangeText={(v) => updateField('password', v)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.showBtn}
                >
                  <Text style={styles.showText}>
                    {showPassword ? 'hide' : 'show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
  },
  brand: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: '#8A8A8A',
    marginTop: 4,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8A8A',
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A2E',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  showText: {
    fontSize: 12,
    color: '#E94560',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1A1A2E',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  link: {
    fontSize: 13,
    color: '#E94560',
    fontWeight: '600',
  },
});