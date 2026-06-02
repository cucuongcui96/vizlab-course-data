const topicsEl = document.getElementById("topics");
const coursesEl = document.getElementById("courses");

let currentCourses = [];

/* =========================
   KIỂM TRA DỮ LIỆU BAN ĐẦU
========================= */

function checkDataReady() {
  if (!topicsEl) {
    console.error("Không tìm thấy phần tử #topics trong index.html");
    return false;
  }

  if (!coursesEl) {
    console.error("Không tìm thấy phần tử #courses trong index.html");
    return false;
  }

  if (typeof topics === "undefined") {
    console.error("Lỗi: Chưa load được data/topics.js");
    coursesEl.innerHTML = `
      <p style="color:red; padding:16px;">
        Lỗi: Chưa load được file data/topics.js
      </p>
    `;
    return false;
  }

  if (typeof allCourses === "undefined") {
    console.error("Lỗi: Chưa load được data/all-courses.js");
    coursesEl.innerHTML = `
      <p style="color:red; padding:16px;">
        Lỗi: Chưa load được file data/all-courses.js
      </p>
    `;
    return false;
  }

  console.log("Số chủ đề:", topics.length);
  console.log("Tổng số khóa học:", allCourses.length);

  return true;
}

/* =========================
   HIỂN THỊ CHỦ ĐỀ
========================= */

function renderTopics() {
  topicsEl.innerHTML = `
    <button onclick="renderCourses(allCourses)" class="topic-btn" style="${topicButtonStyle()}">
      Tất cả (${allCourses.length})
    </button>

    ${topics.map(topic => {
      const count = allCourses.filter(course => course.topic === topic.slug).length;

      return `
        <button onclick="filterByTopic('${topic.slug}')" class="topic-btn" style="${topicButtonStyle()}">
          ${topic.name} (${count})
        </button>
      `;
    }).join("")}
  `;
}

/* =========================
   HIỂN THỊ KHÓA HỌC
========================= */

function renderCourses(courses) {
  currentCourses = courses || [];

  if (!currentCourses.length) {
    coursesEl.innerHTML = `
      <p style="padding:20px; color:#777;">
        Không tìm thấy khóa học phù hợp.
      </p>
    `;
    return;
  }

  coursesEl.innerHTML = currentCourses.map(course => `
    <div class="course-card" style="${courseCardStyle()}">
      <img 
        src="${course.image || ""}" 
        alt="${escapeHtml(course.title || "Khóa học")}" 
        loading="lazy"
        onerror="this.src='https://via.placeholder.com/320x180?text=No+Image'"
        style="${courseImageStyle()}"
      >

      <div style="flex:1;">
        <div style="${badgeStyle()}">
          ${course.topicName || getTopicName(course.topic)}
        </div>

        <h3 style="margin:4px 0 8px; font-size:18px; line-height:1.35;">
          ${course.title || "Chưa có tiêu đề"}
        </h3>

        <p style="margin:4px 0; color:#666;">
          Danh mục: ${course.categoryName || course.category || "Đang cập nhật"}
        </p>

        <p style="margin:4px 0; color:#666;">
          Trình độ: ${formatLevel(course.level)}
        </p>

        <p style="margin:4px 0; color:#666;">
          Đánh giá: ⭐ ${course.rating || "4.8"}
        </p>

        <p style="margin:8px 0;">
          <strong style="font-size:18px; color:#c0392b;">
            ${formatPrice(course.price)}
          </strong>

          ${
            course.originalPrice && course.originalPrice > course.price
              ? `<span style="margin-left:8px; color:#999; text-decoration:line-through;">
                  ${formatPrice(course.originalPrice)}
                </span>`
              : ""
          }
        </p>

        ${
          course.cc
            ? `<p style="margin:4px 0; color:#2d7a46; font-size:14px;">✓ Có phụ đề / hỗ trợ học</p>`
            : ""
        }

        <a 
          href="${course.href || "#"}" 
          target="_blank"
          rel="noopener noreferrer"
          style="${linkButtonStyle()}"
        >
          Xem khóa học
        </a>
      </div>
    </div>
  `).join("");
}

/* =========================
   LỌC THEO CHỦ ĐỀ
========================= */

function filterByTopic(topicSlug) {
  const filtered = allCourses.filter(course => course.topic === topicSlug);
  renderCourses(filtered);
}

/* =========================
   TÌM KIẾM KHÓA HỌC
========================= */

function searchCourses(keyword) {
  const value = (keyword || "").toLowerCase().trim();

  if (!value) {
    renderCourses(allCourses);
    return;
  }

  const filtered = allCourses.filter(course => {
    const title = (course.title || "").toLowerCase();
    const topic = (course.topic || "").toLowerCase();
    const topicName = (course.topicName || "").toLowerCase();
    const category = (course.category || "").toLowerCase();
    const categoryName = (course.categoryName || "").toLowerCase();
    const level = (course.level || "").toLowerCase();
    const tags = Array.isArray(course.tags) ? course.tags.join(" ").toLowerCase() : "";

    return (
      title.includes(value) ||
      topic.includes(value) ||
      topicName.includes(value) ||
      category.includes(value) ||
      categoryName.includes(value) ||
      level.includes(value) ||
      tags.includes(value)
    );
  });

  renderCourses(filtered);
}

/* =========================
   HÀM PHỤ
========================= */

function getTopicName(topicSlug) {
  const topic = topics.find(item => item.slug === topicSlug);
  return topic ? topic.name : topicSlug || "Chưa phân loại";
}

function formatLevel(level) {
  const levels = {
    beginner: "Người mới",
    intermediate: "Trung cấp",
    advanced: "Nâng cao"
  };

  return levels[level] || level || "Đang cập nhật";
}

function formatPrice(price) {
  if (price === 0) return "Miễn phí";
  if (!price && price !== 0) return "Liên hệ";
  return Number(price).toLocaleString("vi-VN") + "đ";
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   STYLE NHANH
========================= */

function topicButtonStyle() {
  return `
    padding:10px 14px;
    margin:6px 6px 6px 0;
    border:1px solid #ddd;
    border-radius:999px;
    background:#fff;
    cursor:pointer;
    font-size:14px;
  `;
}

function courseCardStyle() {
  return `
    border:1px solid #e5e5e5;
    border-radius:14px;
    padding:16px;
    margin:14px 0;
    display:flex;
    gap:16px;
    align-items:flex-start;
    background:#fff;
    box-shadow:0 4px 14px rgba(0,0,0,0.05);
  `;
}

function courseImageStyle() {
  return `
    width:180px;
    max-width:38%;
    aspect-ratio:16/9;
    object-fit:cover;
    border-radius:10px;
    background:#f2f2f2;
  `;
}

function badgeStyle() {
  return `
    display:inline-block;
    padding:4px 9px;
    border-radius:999px;
    background:#f4efe7;
    font-size:13px;
    margin-bottom:8px;
  `;
}

function linkButtonStyle() {
  return `
    display:inline-block;
    margin-top:8px;
    padding:9px 14px;
    border-radius:8px;
    background:#111;
    color:#fff;
    text-decoration:none;
    font-size:14px;
  `;
}

/* =========================
   KHỞI CHẠY WEBSITE
========================= */

if (checkDataReady()) {
  renderTopics();
  renderCourses(allCourses);
}