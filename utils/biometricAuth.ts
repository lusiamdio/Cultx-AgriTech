/**
 * CULTx Biometric Authentication Layer
 * Powered by browser Credential Management API (WebAuthn / PublicKeyCredential)
 * Provides sovereign security for farmers and agribusiness owners to protect
 * sensitive financial balances, cadastral land deeds, and off-take contracts.
 */

export interface BiometricCredential {
  id: string;
  rawId?: string;
  type: string;
  createdAt: string;
  deviceName: string;
  userName: string;
}

export interface BiometricAuthResult {
  success: boolean;
  message: string;
  method: "webauthn_hardware" | "credential_management" | "secure_fallback";
  error?: string;
}

/**
 * Checks whether the browser and hardware support Credential Management and WebAuthn
 */
export async function checkBiometricSupport(): Promise<{
  supported: boolean;
  platformAuthenticator: boolean;
}> {
  if (typeof window === "undefined" || !navigator.credentials) {
    return { supported: false, platformAuthenticator: false };
  }

  let platformAuthenticator = false;
  if (
    typeof window.PublicKeyCredential !== "undefined" &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
  ) {
    try {
      platformAuthenticator = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      platformAuthenticator = false;
    }
  }

  return {
    supported: !!navigator.credentials,
    platformAuthenticator,
  };
}

/**
 * Registers / Enrolls a new Biometric Credential via navigator.credentials.create
 */
export async function enrollBiometricPasskey(
  userName: string = "farmer@cultx.africa",
  displayName: string = "African Agribusiness Owner"
): Promise<BiometricAuthResult> {
  if (typeof window === "undefined" || !navigator.credentials) {
    return {
      success: false,
      message: "Credential Management API not available in this browser environment.",
      method: "secure_fallback",
    };
  }

  // Attempt standard WebAuthn registration
  if (typeof window.PublicKeyCredential !== "undefined") {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "CULTx Pan-African Agricultural OS",
            id: window.location.hostname || "cultx.africa",
          },
          user: {
            id: userId,
            name: userName,
            displayName: displayName,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // FaceID, TouchID, Fingerprint, Windows Hello
            userVerification: "preferred",
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: "none",
        },
      })) as PublicKeyCredential | null;

      if (credential) {
        return {
          success: false,
          message: "Passkey enrollment requires server-side credential registration before it can be enabled.",
          method: "webauthn_hardware",
        };
      }
    } catch (err: any) {
      console.warn("Hardware WebAuthn enrollment failed:", err?.message || err);
      return { success: false, message: "Biometric enrollment was not completed.", method: "webauthn_hardware" };
    }
  }

  return { success: false, message: "This browser does not support WebAuthn.", method: "webauthn_hardware" };
}

/**
 * Authenticates user via navigator.credentials.get (Fingerprint / FaceID / Passkey)
 */
export async function verifyBiometricAuth(): Promise<BiometricAuthResult> {
  if (typeof window === "undefined" || !navigator.credentials) {
    return {
      success: false,
      message: "Credential Management API unavailable.",
      method: "secure_fallback",
    };
  }

  if (typeof window.PublicKeyCredential !== "undefined") {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const assertion = (await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "preferred",
          rpId: window.location.hostname || "cultx.africa",
        },
      })) as PublicKeyCredential | null;

      if (assertion) {
        return {
          success: false,
          message: "Passkey assertions require server-side verification before access can be granted.",
          method: "webauthn_hardware",
        };
      }
    } catch (err: any) {
      console.warn("Hardware WebAuthn verification failed:", err?.message || err);
      return { success: false, message: "Biometric verification was not completed.", method: "webauthn_hardware" };
    }
  }

  // No local fallback is permitted for an authentication decision.
  return {
    success: false,
    message: "No biometric credential was returned by the authenticator.",
    method: "webauthn_hardware",
  };
}
