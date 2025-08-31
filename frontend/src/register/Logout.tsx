import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }).finally(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("remember");
        window.location.href = "/login";
      });
    } else {
      window.location.href = "/login";
    }
  }, []);

  return <p>Выход...</p>;
}
