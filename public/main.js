const API_BASE = "http://localhost:4000";

// ===== Elementos del DOM =====
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const btnLogout = document.getElementById("btnLogout");

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

// Formularios y tablas
const studentForm = document.getElementById("studentForm");
const studentsTableBody = document.getElementById("studentsTableBody");
const btnReloadStudents = document.getElementById("btnReloadStudents");

const courseForm = document.getElementById("courseForm");
const coursesTableBody = document.getElementById("coursesTableBody");
const btnReloadCourses = document.getElementById("btnReloadCourses");

const enrollmentForm = document.getElementById("enrollmentForm");
const enrollmentStudent = document.getElementById("enrollmentStudent");
const enrollmentCourse = document.getElementById("enrollmentCourse");
const enrollmentsTableBody = document.getElementById("enrollmentsTableBody");
const btnReloadEnrollments = document.getElementById("btnReloadEnrollments");

// ===== Helpers =====
const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// 🔥 NUEVA normalizeArray — compatible con "items"
function normalizeArray(data, mainKey) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;   // ← tu backend usa esto
  if (data && Array.isArray(data[mainKey])) return data[mainKey];
  if (data && Array.isArray(data.docs)) return data.docs;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

// ===== Tabs =====
document.querySelectorAll("#mainTabs .nav-link").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("#mainTabs .nav-link")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.dataset.section;
    document
      .querySelectorAll("#dashboardSection > section")
      .forEach((sec) => sec.classList.add("d-none"));
    document.getElementById(target).classList.remove("d-none");
  });
});

// ===== Mostrar login / dashboard =====
function updateUI() {
  const hasToken = !!getToken();
  if (hasToken) {
    loginSection.classList.add("d-none");
    dashboardSection.classList.remove("d-none");
    btnLogout.classList.remove("d-none");
    loadStudents();
    loadCourses();
    loadEnrollments();
  } else {
    loginSection.classList.remove("d-none");
    dashboardSection.classList.add("d-none");
    btnLogout.classList.add("d-none");
  }
}

// ===== LOGIN =====
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.classList.add("d-none");

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      loginError.textContent = "Credenciales inválidas";
      loginError.classList.remove("d-none");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    updateUI();
  } catch (err) {
    loginError.textContent = "Error de conexión con el servidor";
    loginError.classList.remove("d-none");
  }
});

// ===== LOGOUT =====
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  updateUI();
});

// ===== ESTUDIANTES =====
async function loadStudents() {
  try {
    const res = await fetch(`${API_BASE}/api/students`);
    const data = await res.json();

    const students = normalizeArray(data, "students");

    studentsTableBody.innerHTML = students
      .map(
        (s) => `
        <tr>
          <td>${s.firstName} ${s.lastName}</td>
          <td>${s.email}</td>
          <td>${s.documentId}</td>
        </tr>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error cargando estudiantes", err);
  }
}

studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    documentId: document.getElementById("documentId").value,
  };

  try {
    const res = await fetch(`${API_BASE}/api/students`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Error creando estudiante (revisa el token o los datos)");
      return;
    }

    studentForm.reset();
    await loadStudents();
    await loadStudentsForEnrollment();
  } catch (err) {
    console.error("Error creando estudiante", err);
  }
});

btnReloadStudents.addEventListener("click", loadStudents);

// ===== CURSOS =====
async function loadCourses() {
  try {
    const res = await fetch(`${API_BASE}/api/courses`);
    const data = await res.json();

    const courses = normalizeArray(data, "courses");

    coursesTableBody.innerHTML = courses
      .map(
        (c) => `
        <tr>
          <td>${c.code}</td>
          <td>${c.name}</td>
          <td>${c.credits}</td>
        </tr>
      `
      )
      .join("");

    await loadCoursesForEnrollment();
  } catch (err) {
    console.error("Error cargando cursos", err);
  }
}

// Crear curso
courseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    code: document.getElementById("code").value,
    name: document.getElementById("name").value,
    credits: Number(document.getElementById("credits").value || 0),
  };

  try {
    const res = await fetch(`${API_BASE}/api/courses`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Error creando curso (revisa token o datos)");
      return;
    }

    courseForm.reset();
    await loadCourses();
    await loadCoursesForEnrollment();
  } catch (err) {
    console.error("Error creando curso", err);
  }
});

btnReloadCourses.addEventListener("click", loadCourses);

// ===== MATRÍCULAS: selects =====
async function loadStudentsForEnrollment() {
  try {
    const res = await fetch(`${API_BASE}/api/students`);
    const data = await res.json();

    const students = normalizeArray(data, "students");

    enrollmentStudent.innerHTML = students
      .map(
        (s) =>
          `<option value="${s._id}">${s.firstName} ${s.lastName}</option>`
      )
      .join("");
  } catch (err) {
    console.error("Error cargando estudiantes para matrícula", err);
  }
}

async function loadCoursesForEnrollment() {
  try {
    const res = await fetch(`${API_BASE}/api/courses`);
    const data = await res.json();

    const courses = normalizeArray(data, "courses");

    enrollmentCourse.innerHTML = courses
      .map(
        (c) => `
        <option value="${c._id}">
          ${c.code} - ${c.name}
        </option>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error cargando cursos para matrícula", err);
  }
}

// ===== MATRÍCULAS: listado =====
async function loadEnrollments() {
  try {
    const res = await fetch(`${API_BASE}/api/enrollments`);
    const data = await res.json();

    const enrollments = normalizeArray(data, "enrollments");

    enrollmentsTableBody.innerHTML = enrollments
      .map(
        (e) => `
        <tr>
          <td>${e.student?.firstName || ""} ${e.student?.lastName || ""}</td>
          <td>${e.course?.code || ""} - ${e.course?.name || ""}</td>
        </tr>
      `
      )
      .join("");

    await loadStudentsForEnrollment();
    await loadCoursesForEnrollment();
  } catch (err) {
    console.error("Error cargando matrículas", err);
  }
}

enrollmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    studentId: enrollmentStudent.value,
    courseId: enrollmentCourse.value,
  };

  try {
    const res = await fetch(`${API_BASE}/api/enrollments`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Error creando matrícula (revisa token o datos)");
      return;
    }

    enrollmentForm.reset();
    await loadEnrollments();
  } catch (err) {
    console.error("Error creando matrícula", err);
  }
});

btnReloadEnrollments.addEventListener("click", loadEnrollments);

// ===== Inicializar =====
updateUI();
