function initDatabase() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
  }
  if (!localStorage.getItem("applications")) {
    localStorage.setItem("applications", JSON.stringify([]));
  }
  if (!localStorage.getItem("reviews")) {
    localStorage.setItem("reviews", JSON.stringify([]));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
}

function findUserByUsername(username) {
  const users = getUsers();
  return users.find((user) => user.username === username);
}

function getApplications() {
  return JSON.parse(localStorage.getItem("applications")) || [];
}

function saveApplication(application) {
  const applications = getApplications();
  applications.push(application);
  localStorage.setItem("applications", JSON.stringify(applications));
}

function updateApplicationStatus(applicationId, status) {
  const applications = getApplications();
  const application = applications.find((app) => app.id === applicationId);
  if (application) {
    application.status = status;
    localStorage.setItem("applications", JSON.stringify(applications));
    return true;
  }
  return false;
}

function getUserApplications(username) {
  const applications = getApplications();
  return applications.filter((app) => app.username === username);
}

function saveReview(review) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.push(review);
  localStorage.setItem("reviews", JSON.stringify(reviews));
}

function calculatePrice() {
  try {
    const courseSelect = document.getElementById("course-select");
    if (!courseSelect) return;

    const selectedOption = courseSelect.options[courseSelect.selectedIndex];
    const coursePrice =
      selectedOption && selectedOption.value
        ? parseInt(selectedOption.getAttribute("data-price") || 0)
        : 0;

    const planRadio = document.querySelector('input[name="plan"]:checked');
    const plan = planRadio ? planRadio.value : "Базовый";
    const planSurcharge = plan === "Профессиональный" ? 7000 : 0;
    const totalPrice = coursePrice + planSurcharge;

    const coursePriceElement = document.getElementById("course-price");
    const planSurchargeElement = document.getElementById("plan-surcharge");
    const totalPriceElement = document.getElementById("total-price");

    if (coursePriceElement)
      coursePriceElement.textContent =
        coursePrice.toLocaleString("ru-RU") + " ₽";
    if (planSurchargeElement)
      planSurchargeElement.textContent =
        planSurcharge.toLocaleString("ru-RU") + " ₽";
    if (totalPriceElement)
      totalPriceElement.textContent = totalPrice.toLocaleString("ru-RU") + " ₽";
  } catch (error) {
    console.error("Ошибка расчета стоимости:", error);
  }
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
  updateNavigation();

  if (window.innerWidth <= 768) {
    document.getElementById("nav-menu").classList.remove("show");
  }

  if (pageId === "applications-page") {
    loadUserApplications();
  } else if (pageId === "admin-page") {
    loadAdminApplications();
  } else if (pageId === "create-application-page") {
    setTimeout(initPriceCalculator, 100);
  }
}

function initPriceCalculator() {
  const courseSelect = document.getElementById("course-select");
  const planRadios = document.querySelectorAll('input[name="plan"]');

  if (courseSelect) {
    courseSelect.addEventListener("change", calculatePrice);
  }

  if (planRadios.length > 0) {
    planRadios.forEach((radio) => {
      radio.addEventListener("change", calculatePrice);
    });
  }

  calculatePrice();
}

function updateNavigation() {
  const navMenu = document.getElementById("nav-menu");
  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.username === "Admin";

  navMenu.innerHTML = "";

  if (currentUser) {
    if (isAdmin) {
      navMenu.innerHTML = `
                <li><a href="#" onclick="showPage('home-page')"><i class="fas fa-home"></i> Главная</a></li>
                <li><a href="#" onclick="showPage('courses-page')"><i class="fas fa-book"></i> Курсы</a></li>
                <li><a href="#" onclick="showPage('about-page')"><i class="fas fa-info-circle"></i> О нас</a></li>
                <li><a href="#" onclick="showPage('contacts-page')"><i class="fas fa-phone"></i> Контакты</a></li>
                <li><a href="#" onclick="showPage('admin-page')"><i class="fas fa-cog"></i> Панель администратора</a></li>
                <li><a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Выйти (${currentUser.username})</a></li>
            `;
    } else {
      navMenu.innerHTML = `
                <li><a href="#" onclick="showPage('home-page')"><i class="fas fa-home"></i> Главная</a></li>
                <li><a href="#" onclick="showPage('courses-page')"><i class="fas fa-book"></i> Курсы</a></li>
                <li><a href="#" onclick="showPage('about-page')"><i class="fas fa-info-circle"></i> О нас</a></li>
                <li><a href="#" onclick="showPage('contacts-page')"><i class="fas fa-phone"></i> Контакты</a></li>
                <li><a href="#" onclick="showPage('applications-page')"><i class="fas fa-list"></i> Мои заявки</a></li>
                <li><a href="#" onclick="showPage('create-application-page')"><i class="fas fa-plus"></i> Подать заявку</a></li>
                <li><a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Выйти (${currentUser.fio})</a></li>
            `;
    }
  } else {
    navMenu.innerHTML = `
            <li><a href="#" onclick="showPage('home-page')"><i class="fas fa-home"></i> Главная</a></li>
            <li><a href="#" onclick="showPage('courses-page')"><i class="fas fa-book"></i> Курсы</a></li>
            <li><a href="#" onclick="showPage('about-page')"><i class="fas fa-info-circle"></i> О нас</a></li>
            <li><a href="#" onclick="showPage('contacts-page')"><i class="fas fa-phone"></i> Контакты</a></li>
            <li><a href="#" onclick="showPage('login-page')"><i class="fas fa-sign-in-alt"></i> Вход</a></li>
            <li><a href="#" onclick="showPage('register-page')"><i class="fas fa-user-plus"></i> Регистрация</a></li>
        `;
  }
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
  updateNavigation();
}

function logout() {
  sessionStorage.removeItem("currentUser");
  showPage("home-page");
  updateNavigation();
}

function validateUsername(username) {
  const regex = /^[a-zA-Z0-9]{6,}$/;
  return regex.test(username);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateFIO(fio) {
  const regex = /^[а-яА-ЯёЁ\s]+$/;
  return regex.test(fio);
}

function validatePhone(phone) {
  const regex = /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
  return regex.test(phone);
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function loadUserApplications() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const applications = getUserApplications(currentUser.username);
  const container = document.getElementById("user-applications");

  if (applications.length === 0) {
    container.innerHTML = "<p>У вас пока нет заявок на обучение.</p>";
    return;
  }

  let html =
    "<table><tr><th>Курс</th><th>План</th><th>Стоимость</th><th>Дата начала</th><th>Способ оплаты</th><th>Статус</th><th>Действия</th></tr>";

  applications.forEach((app) => {
    let statusClass = "status-new";
    if (app.status === "Идет обучение") statusClass = "status-in-progress";
    if (app.status === "Обучение завершено") statusClass = "status-completed";

    html += `
            <tr>
                <td>${app.courseName}</td>
                <td>${app.plan}</td>
                <td>${app.totalPrice}</td>
                <td>${app.startDate}</td>
                <td>${app.paymentMethod}</td>
                <td><span class="${statusClass}">${app.status}</span></td>
                <td>
                    ${
                      app.status === "Обучение завершено"
                        ? `<button class="btn" onclick="showReviewModal('${app.id}')">Оставить отзыв</button>`
                        : "-"
                    }
                </td>
            </tr>
        `;
  });

  html += "</table>";
  container.innerHTML = html;
}

function loadAdminApplications() {
  const applications = getApplications();
  const container = document.getElementById("admin-applications");

  if (applications.length === 0) {
    container.innerHTML = "<p>Заявок пока нет.</p>";
    return;
  }

  let html =
    "<table><tr><th>Пользователь</th><th>Курс</th><th>План</th><th>Стоимость</th><th>Дата начала</th><th>Способ оплаты</th><th>Статус</th><th>Действия</th></tr>";

  applications.forEach((app) => {
    let statusClass = "status-new";
    if (app.status === "Идет обучение") statusClass = "status-in-progress";
    if (app.status === "Обучение завершено") statusClass = "status-completed";

    html += `
            <tr>
                <td>${app.fio} (${app.username})</td>
                <td>${app.courseName}</td>
                <td>${app.plan}</td>
                <td>${app.totalPrice}</td>
                <td>${app.startDate}</td>
                <td>${app.paymentMethod}</td>
                <td><span class="${statusClass}">${app.status}</span></td>
                <td>
                    <select onchange="updateApplicationStatus('${
                      app.id
                    }', this.value)">
                        <option value="Новая" ${
                          app.status === "Новая" ? "selected" : ""
                        }>Новая</option>
                        <option value="Идет обучение" ${
                          app.status === "Идет обучение" ? "selected" : ""
                        }>Идет обучение</option>
                        <option value="Обучение завершено" ${
                          app.status === "Обучение завершено" ? "selected" : ""
                        }>Обучение завершено</option>
                    </select>
                </td>
            </tr>
        `;
  });

  html += "</table>";
  container.innerHTML = html;
}

function updateApplicationStatus(applicationId, status) {
  if (updateApplicationStatus(applicationId, status)) {
    loadAdminApplications();
  }
}

function showReviewModal(applicationId) {
  const reviewText = prompt(
    "Пожалуйста, оставьте ваш отзыв о качестве образовательных услуг:"
  );
  if (reviewText && reviewText.trim() !== "") {
    const currentUser = getCurrentUser();
    saveReview({
      applicationId: applicationId,
      username: currentUser.username,
      review: reviewText,
      date: new Date().toISOString().split("T")[0],
    });
    alert("Спасибо за ваш отзыв!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initDatabase();
  updateNavigation();

  const currentUser = getCurrentUser();
  if (currentUser) {
    if (currentUser.username === "Admin") {
      showPage("admin-page");
    } else {
      showPage("applications-page");
    }
  }

  document.getElementById("navToggle").addEventListener("click", function () {
    document.getElementById("nav-menu").classList.toggle("show");
  });

  document
    .getElementById("register-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("reg-username").value;
      const password = document.getElementById("reg-password").value;
      const fio = document.getElementById("reg-fio").value;
      const phone = document.getElementById("reg-phone").value;
      const email = document.getElementById("reg-email").value;

      const errorDiv = document.getElementById("register-error");
      const successDiv = document.getElementById("register-success");

      if (!validateUsername(username)) {
        errorDiv.textContent =
          "Логин должен содержать только латиницу и цифры, не менее 6 символов";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
        return;
      }

      if (!validatePassword(password)) {
        errorDiv.textContent = "Пароль должен содержать не менее 8 символов";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
        return;
      }

      if (!validateFIO(fio)) {
        errorDiv.textContent =
          "ФИО должно содержать только кириллицу и пробелы";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
        return;
      }

      if (!validatePhone(phone)) {
        errorDiv.textContent = "Телефон должен быть в формате: 8(XXX)XXX-XX-XX";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
        return;
      }

      if (!validateEmail(email)) {
        errorDiv.textContent = "Введите корректный адрес электронной почты";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
        return;
      }

      if (findUserByUsername(username)) {
        errorDiv.textContent = "Пользователь с таким логином уже существует";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
        return;
      }

      saveUser({
        username: username,
        password: password,
        fio: fio,
        phone: phone,
        email: email,
      });

      errorDiv.style.display = "none";
      successDiv.textContent =
        "Пользователь успешно зарегистрирован! Теперь вы можете войти в систему.";
      successDiv.style.display = "block";

      document.getElementById("register-form").reset();
    });

  document
    .getElementById("login-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      const errorDiv = document.getElementById("login-error");

      if (username === "Admin" && password === "KorokNET") {
        setCurrentUser({
          username: "Admin",
          fio: "Администратор",
        });
        showPage("admin-page");
        errorDiv.style.display = "none";
        return;
      }

      const user = findUserByUsername(username);

      if (!user || user.password !== password) {
        errorDiv.textContent = "Неверный логин или пароль";
        errorDiv.style.display = "block";
        return;
      }

      setCurrentUser(user);
      showPage("applications-page");
      errorDiv.style.display = "none";
    });

  document
    .getElementById("application-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("Для подачи заявки необходимо войти в систему");
        showPage("login-page");
        return;
      }

      const courseSelect = document.getElementById("course-select");
      const courseName = courseSelect.value;
      const startDate = document.getElementById("start-date").value;
      const paymentMethod = document.querySelector(
        'input[name="payment"]:checked'
      ).value;
      const plan = document.querySelector('input[name="plan"]:checked').value;
      const totalPrice = document.getElementById("total-price").textContent;

      const errorDiv = document.getElementById("application-error");
      const successDiv = document.getElementById("application-success");

      if (!courseName || !startDate) {
        errorDiv.textContent = "Все поля обязательны для заполнения";
        errorDiv.style.display = "block";
        successDiv.style.display = "none";
        return;
      }

      saveApplication({
        id: Date.now().toString(),
        username: currentUser.username,
        fio: currentUser.fio,
        courseName: courseName,
        plan: plan,
        totalPrice: totalPrice,
        startDate: startDate,
        paymentMethod: paymentMethod,
        status: "Новая",
        date: new Date().toISOString().split("T")[0],
      });

      errorDiv.style.display = "none";
      successDiv.textContent = "Заявка успешно отправлена на рассмотрение!";
      successDiv.style.display = "block";

      document.getElementById("application-form").reset();
      setTimeout(calculatePrice, 100);
    });

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.");
      document.getElementById("contact-form").reset();
    });
});
