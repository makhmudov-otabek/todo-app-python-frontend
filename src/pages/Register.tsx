import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/todo/register/", {
        username,
        password,
      });

      navigate("/login");
    } catch {
      setError("Ro‘yxatdan o‘tishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Register</h1>

        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>

        <p>
          Account bormi? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
