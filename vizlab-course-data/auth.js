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

  // Gọi hàm filter để render lại giao diện thay vì truyền cứng ALL_COURSES
  if (typeof executeSearchAndFilter === "function") {
    executeSearchAndFilter();
  }

  return data.user;
}

async function signOut() {
  await supabaseClient.auth.signOut();

  currentUser = null;
  ownedCourseIds = [];

  updateAuthUI();

  if (typeof executeSearchAndFilter === "function") {
    executeSearchAndFilter();
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

  // 1. Ẩn chữ "Đang kiểm tra..." vì quá trình check Supabase đã xong
  authStatusEls.forEach(el => {
    el.style.display = "none";
  });

  // 2. Hiện Email nếu có user (sử dụng flex để giữ cấu trúc CSS)
  userEmailEls.forEach(el => {
    if (currentUser) {
      el.style.display = "flex";
      el.textContent = currentUser.email;
    } else {
      el.style.display = "none";
      el.textContent = "";
    }
  });

  // 3. Hiện nút Đăng Nhập nếu chưa có user
  loginLinks.forEach(el => {
    el.style.display = currentUser ? "none" : "flex";
  });

  // 4. Hiện nút Đăng Xuất nếu đã có user
  logoutButtons.forEach(el => {
    el.style.display = currentUser ? "flex" : "none";
  });
}

async function initAuth() {
  await getCurrentUser();

  if (currentUser) {
    await loadOwnedCourses();
  }

  updateAuthUI();

  // Gọi hàm filter để render lại UI khóa học (nhằm kích hoạt nút "Vào Học")
  if (typeof executeSearchAndFilter === "function") {
    executeSearchAndFilter();
  }
}

document.addEventListener("DOMContentLoaded", initAuth);
