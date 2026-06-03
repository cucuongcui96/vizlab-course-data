let currentUser = null;
let ownedCourseIds = [];

async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    currentUser = null;
    return null;
  }

  currentUser = data.user || null;
  return currentUser;
}

async function signUp(email, password, fullName = "") {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Đăng ký lỗi: " + error.message);
    return null;
  }

  if (data.user) {
    await supabaseClient.from("profiles").insert({
      id: data.user.id,
      email: email,
      full_name: fullName
    });
  }

  alert("Đăng ký thành công. Nếu Supabase yêu cầu xác nhận email, bạn hãy kiểm tra hộp thư.");
  return data.user;
}

async function signIn(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Đăng nhập lỗi: " + error.message);
    return null;
  }

  currentUser = data.user;
  await loadOwnedCourses();
  updateAuthUI();

  if (typeof renderCourses === "function") {
    renderCourses(typeof currentCourses !== "undefined" ? currentCourses : allCourses);
  }

  return data.user;
}

async function signOut() {
  await supabaseClient.auth.signOut();

  currentUser = null;
  ownedCourseIds = [];

  updateAuthUI();

  if (typeof renderCourses === "function") {
    renderCourses(typeof currentCourses !== "undefined" ? currentCourses : allCourses);
  }
}

async function loadOwnedCourses() {
  ownedCourseIds = [];

  if (!currentUser) return [];

  const { data, error } = await supabaseClient
    .from("enrollments")
    .select("course_id")
    .eq("user_id", currentUser.id);

  if (error) {
    console.error("Lỗi tải khóa đã mua:", error.message);
    return [];
  }

  ownedCourseIds = data.map(item => item.course_id);
  return ownedCourseIds;
}

function userOwnsCourse(courseId) {
  return ownedCourseIds.includes(courseId);
}

function updateAuthUI() {
  const authStatusEls = document.querySelectorAll("[data-auth-status]");
  const userEmailEls = document.querySelectorAll("[data-user-email]");
  const loginLinks = document.querySelectorAll("[data-login-link]");
  const logoutButtons = document.querySelectorAll("[data-logout-button]");

  authStatusEls.forEach(el => {
    el.textContent = currentUser ? "Đã đăng nhập" : "Chưa đăng nhập";
  });

  userEmailEls.forEach(el => {
    el.textContent = currentUser ? currentUser.email : "";
  });

  loginLinks.forEach(el => {
    el.style.display = currentUser ? "none" : "inline-block";
  });

  logoutButtons.forEach(el => {
    el.style.display = currentUser ? "inline-block" : "none";
  });
}

async function initAuth() {
  await getCurrentUser();

  if (currentUser) {
    await loadOwnedCourses();
  }

  updateAuthUI();

  if (typeof renderCourses === "function") {
    renderCourses(typeof currentCourses !== "undefined" ? currentCourses : allCourses);
  }
}

document.addEventListener("DOMContentLoaded", initAuth);