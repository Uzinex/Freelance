import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      if (!res.ok) throw new Error("Ошибка авторизации");

      const data = await res.json();
      console.log("Ответ от API:", data);

      // сохраняем токен в localStorage (или cookie, позже уточним стратегию)
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      if (form.rememberMe) {
        localStorage.setItem("remember", "true");
      }
    } catch (err) {
      console.error(err);
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя или Email"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            <span className="text-sm">Запомнить меня</span>
          </label>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Войти
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Забыли пароль?{" "}
          <a href="/reset-password" className="text-indigo-600">
            Сбросить
          </a>
        </p>
      </div>
    </div>
  );
}
