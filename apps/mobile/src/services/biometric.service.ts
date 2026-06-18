import * as LocalAuthentication from 'expo-local-authentication';
import { secureStorageService } from './secure-storage.service';

const BIOMETRIC_ENABLED_KEY = '@aquarela_biometric_enabled';

export const biometricService = {
  async isAvailable() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const level = await LocalAuthentication.getEnrolledLevelAsync();
    return hasHardware && enrolled && level === LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG;
  },

  async isEnabled() {
    return (await secureStorageService.getItem(BIOMETRIC_ENABLED_KEY)) === 'true';
  },

  async setEnabled(enabled: boolean) {
    if (enabled) {
      if (!(await this.isAvailable())) {
        throw new Error('Cadastre uma biometria forte nas configurações do aparelho antes de ativar este recurso.');
      }
      const authenticated = await this.authenticate();
      if (!authenticated) throw new Error('Não foi possível confirmar sua biometria.');
    }
    await secureStorageService.setItem(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false');
  },

  async getLabel() {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'rosto';
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return 'digital';
    return 'biometria';
  },

  async authenticate() {
    const available = await this.isAvailable();
    if (!available) return false;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Desbloquear Aquarela',
      cancelLabel: 'Usar senha',
      fallbackLabel: 'Usar senha',
      disableDeviceFallback: true,
      biometricsSecurityLevel: 'strong',
      requireConfirmation: true,
    });
    return result.success;
  },
};
