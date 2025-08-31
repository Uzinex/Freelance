import { useState } from "react";

export default function ResetPasswordConfirm() {
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/auth/password-reset/confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code, new_password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Ошибка");

      setMessage("Пароль успешно изменён! Теперь можно войти.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage(String(err));
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Подтверждение сброса</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email или телефон"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <input
            type="text"
            placeholder="Код подтверждения"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Изменить пароль
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
