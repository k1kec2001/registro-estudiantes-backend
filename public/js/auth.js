const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Error al iniciar sesión");
      return;
    }

    // Guardar token en el navegador
    localStorage.setItem("token", data.token);

    // Redirigir al dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    alert("Error de conexión con el servidor");
  }
});

