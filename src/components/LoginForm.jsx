import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// Asks for an email and password, POSTs them to /api/auth/login,
// and hands the token it gets back up to App through onLogin.
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `The server answered ${res.status}`);
      }
      onLogin(data.token);
      setPassword("");
    } catch (err) {
      setMessage(`Could not log in: ${err.message}`);
    }
  }

  return (
    <>
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Log in</button>
      </form>
      {message && <p className="status error">{message}</p>}
    </>
  );
}

export default LoginForm;