import useAuthStore from "../stores/useAuthStore";

export function getBearerToken() {
  const { token } = useAuthStore.getState();

  return { Authorization: `Bearer ${token}` };
}
