import axios from "axios";

export async function getCsrfToken() {
  const response = await axios.get("http://localhost:5000/api/csrf-token", { withCredentials: true });
  console.log("CSRF-Token erhalten:", response.data.csrfToken); // Überprüfe das Token in der Konsole
  return response.data.csrfToken;
}
