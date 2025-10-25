import { useState } from "react";
import "./Login.css"; // estilos locales de esta vista (opcionales)

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: aquí conectas con tu backend (fetch/axios) y navegas a /home
    console.log({ user, pass, remember });
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <header className="auth__header">
          <h1>Inicia sesión</h1>
          <p className="muted">Accede con tus credenciales corporativas</p>
        </header>

        <form onSubmit={onSubmit} className="auth__form">
          <label className="label" htmlFor="user">Usuario</label>
          <input
            id="user"
            className="input"
            placeholder="tu@empresa.com"
            autoComplete="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <label className="label mt" htmlFor="pass">Contraseña</label>
          <input
            id="pass"
            type="password"
            className="input"
            placeholder="********"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <div className="auth__row">
            <label className="check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Recordarme</span>
            </label>
            <a className="link" href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn btn--primary mt">
            Ingresar
          </button>
        </form>

        <footer className="auth__footer">
          <small className="muted">© {new Date().getFullYear()} Gate Group</small>
        </footer>
      </div>
    </div>
  );
}
