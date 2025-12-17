// Security Incident Management System - Online Demo
const SecurityIncidentApp = {
    // Конфигурация
    config: {
        apiUrl: window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api' 
            : '/api',
        demoMode: true
    },

    // Состояние приложения
    state: {
        user: null,
        token: null,
        incidents: [],
        auditLog: [],
        stats: {},
        currentView: 'login',
        isLoading: false
    },

    // Демо данные
    demoData: {
        incidents: [
            {
                id: 1,
                title: "Фишинговая атака на сотрудников",
                description: "Обнаружены фишинговые письма, маскирующиеся под внутренние уведомления HR отдела. Письма содержат ссылки на поддельные страницы ввода учетных данных.",
                severity: 3,
                status: "open",
                category: "phishing",
                createdBy: "Иван Петров",
                createdAt: "2024-01-15T10:30:00",
                updatedAt: "2024-01-16T14:20:00",
                vectors: ["phishing", "social-engineering"],
                confidential: false,
                affectedUsers: 5
            },
            {
                id: 2,
                title: "Подозрение на утечку данных клиентов",
                description: "Обнаружена подозрительная активность в базе данных клиентов. Возможен несанкционированный доступ к персональным данным 150+ клиентов.",
                severity: 5,
                status: "in-progress",
                category: "data-breach",
                createdBy: "Анна Сидорова",
                createdAt: "2024-01-14T09:15:00",
                updatedAt: "2024-01-16T09:45:00",
                vectors: ["sql-injection", "insider-threat"],
                confidential: true,
                affectedUsers: 150
            },
            {
                id: 3,
                title: "DDoS атака на корпоративный портал",
                description: "Зафиксирована распределенная атака на отказ в обслуживании корпоративного портала. Время простоя - 45 минут.",
                severity: 4,
                status: "resolved",
                category: "ddos",
                createdBy: "Сергей Иванов",
                createdAt: "2024-01-13T16:45:00",
                updatedAt: "2024-01-14T10:30:00",
                vectors: ["ddos"],
                confidential: false,
                affectedUsers: 0
            },
            {
                id: 4,
                title: "Обнаружение вредоносного ПО на рабочих станциях",
                description: "Антивирусное ПО обнаружило троянскую програму на 3 рабочих станциях отдела разработки.",
                severity: 4,
                status: "in-progress",
                category: "malware",
                createdBy: "Мария Козлова",
                createdAt: "2024-01-12T11:20:00",
                updatedAt: "2024-01-15T16:10:00",
                vectors: ["malware"],
                confidential: false,
                affectedUsers: 3
            },
            {
                id: 5,
                title: "Попытка несанкционированного доступа к серверу",
                description: "Зафиксированы множественные попытки подбора паролей к серверу приложений.",
                severity: 3,
                status: "open",
                category: "unauthorized-access",
                createdBy: "Алексей Смирнов",
                createdAt: "2024-01-11T08:30:00",
                updatedAt: "2024-01-11T08:30:00",
                vectors: ["brute-force"],
                confidential: false,
                affectedUsers: 0
            }
        ],
        
        users: [
            { id: 1, username: "admin", name: "Администратор Системы", role: "admin" },
            { id: 2, username: "analyst", name: "Анна Сидорова", role: "analyst" },
            { id: 3, username: "manager", name: "Сергей Иванов", role: "manager" },
            { id: 4, username: "viewer", name: "Мария Козлова", role: "viewer" }
        ],
        
        auditLog: [
            { id: 1, user: "admin", action: "login", timestamp: "2024-01-16 09:15", ip: "192.168.1.100" },
            { id: 2, user: "analyst", action: "create_incident", details: "Создан инцидент #2", timestamp: "2024-01-16 09:30", ip: "192.168.1.101" },
            { id: 3, user: "admin", action: "update_incident", details: "Обновлен инцидент #1", timestamp: "2024-01-16 10:15", ip: "192.168.1.100" },
            { id: 4, user: "viewer", action: "view_incident", details: "Просмотр инцидента #3", timestamp: "2024-01-16 11:20", ip: "192.168.1.102" },
            { id: 5, user: "manager", action: "generate_report", details: "Сформирован отчет", timestamp: "2024-01-16 14:45", ip: "192.168.1.103" }
        ]
    },

    // Инициализация
    init() {
        this.loadState();
        this.render();
        this.setupEventListeners();
    },

    // Загрузка состояния
    loadState() {
        const savedUser = localStorage.getItem('security_user');
        const savedToken = localStorage.getItem('security_token');
        
        if (savedUser && savedToken) {
            this.state.user = JSON.parse(savedUser);
            this.state.token = savedToken;
            this.state.currentView = 'dashboard';
            this.loadDashboardData();
        }
        
        // Загрузка демо данных
        this.state.incidents = this.demoData.incidents;
        this.state.auditLog = this.demoData.auditLog;
        this.calculateStats();
    },

    // Сохранение состояния
    saveState() {
        if (this.state.user) {
            localStorage.setItem('security_user', JSON.stringify(this.state.user));
            localStorage.setItem('security_token', this.state.token || 'demo-token');
        }
    },

    // Расчет статистики
    calculateStats() {
        const incidents = this.state.incidents;
        this.state.stats = {
            total: incidents.length,
            open: incidents.filter(i => i.status === 'open').length,
            inProgress: incidents.filter(i => i.status === 'in-progress').length,
            resolved: incidents.filter(i => i.status === 'resolved').length,
            highSeverity: incidents.filter(i => i.severity >= 4).length,
            confidential: incidents.filter(i => i.confidential).length
        };
    },

    // Основной рендер
    render() {
        const app = document.getElementById('app');
        
        switch(this.state.currentView) {
            case 'login':
                app.innerHTML = this.renderLoginPage();
                break;
            case 'dashboard':
                app.innerHTML = this.renderDashboard();
                this.renderCharts();
                break;
            case 'incidents':
                app.innerHTML = this.renderIncidentsPage();
                this.initDataTable();
                break;
            case 'new-incident':
                app.innerHTML = this.renderNewIncidentForm();
                break;
            case 'audit':
                app.innerHTML = this.renderAuditPage();
                break;
            case 'reports':
                app.innerHTML = this.renderReportsPage();
                break;
            default:
                app.innerHTML = this.renderLoginPage();
        }
    },

    // Рендер страницы входа
    renderLoginPage() {
        return `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-6 col-lg-5">
                        <div class="glass-card login-container">
                            <div class="text-center mb-5">
                                <div class="mb-4">
                                    <i class="bi bi-shield-check display-1" style="color: #0d6efd;"></i>
                                </div>
                                <h1 class="h3 mb-3">Security Incident System</h1>
                                <p class="text-muted">Онлайн демо-версия</p>
                            </div>
                            
                            <div class="mb-4">
                                <h5 class="mb-3">Выберите роль для демонстрации:</h5>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <button class="btn btn-outline-primary w-100" onclick="SecurityIncidentApp.demoLogin('admin')">
                                            <i class="bi bi-crown"></i> Администратор
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-outline-info w-100" onclick="SecurityIncidentApp.demoLogin('analyst')">
                                            <i class="bi bi-search"></i> Аналитик
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-outline-success w-100" onclick="SecurityIncidentApp.demoLogin('manager')">
                                            <i class="bi bi-graph-up"></i> Менеджер
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-outline-secondary w-100" onclick="SecurityIncidentApp.demoLogin('viewer')">
                                            <i class="bi bi-eye"></i> Наблюдатель
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <form id="loginForm" onsubmit="return SecurityIncidentApp.handleLogin(event)">
                                <div class="mb-3">
                                    <label class="form-label">Имя пользователя</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                                        <input type="text" class="form-control" id="username" 
                                               placeholder="admin" required>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Пароль</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-key"></i></span>
                                        <input type="password" class="form-control" id="password" 
                                               placeholder="Admin123!" required>
                                        <button class="btn btn-outline-secondary" type="button" 
                                                onclick="SecurityIncidentApp.togglePassword()">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn btn-primary btn-lg">
                                        <i class="bi bi-box-arrow-in-right"></i> Войти в систему
                                    </button>
                                </div>
                            </form>
                            
                            <div class="mt-4 text-center">
                                <p class="small text-muted">
                                    <strong>Демо-доступ:</strong><br>
                                    Администратор: admin / Admin123!<br>
                                    Аналитик: analyst / Analyst123!<br>
                                    Менеджер: manager / Manager123!<br>
                                    Наблюдатель: viewer / Viewer123!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Быстрый вход для демо
    demoLogin(role) {
        const credentials = {
            'admin': { username: 'admin', password: 'Admin123!' },
            'analyst': { username: 'analyst', password: 'Analyst123!' },
            'manager': { username: 'manager', password: 'Manager123!' },
            'viewer': { username: 'viewer', password: 'Viewer123!' }
        };
        
        document.getElementById('username').value = credentials[role].username;
        document.getElementById('password').value = credentials[role].password;
        this.handleLogin(new Event('submit'));
    },

    // Обработка входа
    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Демо-проверка
        const validUsers = {
            'admin': 'Admin123!',
            'analyst': 'Analyst123!',
            'manager': 'Manager123!',
            'viewer': 'Viewer123!'
        };
        
        if (validUsers[username] && password === validUsers[username]) {
            this.state.user = {
                username: username,
                name: this.getUserName(username),
                role: username
            };
            this.state.token = 'demo-jwt-token-' + username;
            this.state.currentView = 'dashboard';
            
            this.saveState();
            this.loadDashboardData();
            this.render();
            
            this.showToast('Успешный вход!', `Добро пожаловать, ${this.state.user.name}!`, 'success');
        } else {
            this.showToast('Ошибка входа', 'Неверное имя пользователя или пароль', 'danger');
        }
    },

    // Получение имени пользователя
    getUserName(username) {
        const names = {
            'admin': 'Администратор Системы',
            'analyst': 'Анна Сидорова',
            'manager': 'Сергей Иванов',
            'viewer': 'Мария Козлова'
        };
        return names[username] || username;
    },

    // Рендер дашборда
    renderDashboard() {
        const stats = this.state.stats;
        
        return `
            <div class="container-fluid">
                <!-- Sidebar -->
                <nav class="sidebar glass-card">
                    <div class="mb-4">
                        <h5 class="text-primary">
                            <i class="bi bi-shield-check"></i> Security System
                        </h5>
                        <p class="small text-muted mb-0">Демо-версия</p>
                    </div>
                    
                    <div class="mb-4">
                        <div class="d-flex align-items-center mb-3">
                            <div class="me-2">
                                <i class="bi bi-person-circle fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">${this.state.user.name}</h6>
                                <small class="text-muted">${this.state.user.role}</small>
                            </div>
                        </div>
                    </div>
                    
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link active" href="#" onclick="SecurityIncidentApp.changeView('dashboard')">
                                <i class="bi bi-speedometer2"></i> Дашборд
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="SecurityIncidentApp.changeView('incidents')">
                                <i class="bi bi-exclamation-triangle"></i> Инциденты
                            </a>
                        </li>
                        ${this.state.user.role === 'admin' || this.state.user.role === 'analyst' ? `
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="SecurityIncidentApp.changeView('new-incident')">
                                <i class="bi bi-plus-circle"></i> Новый инцидент
                            </a>
                        </li>
                        ` : ''}
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="SecurityIncidentApp.changeView('audit')">
                                <i class="bi bi-clipboard-check"></i> Аудит
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="SecurityIncidentApp.changeView('reports')">
                                <i class="bi bi-bar-chart"></i> Отчеты
                            </a>
                        </li>
                        <li class="nav-item mt-4">
                            <button class="btn btn-outline-danger w-100" onclick="SecurityIncidentApp.logout()">
                                <i class="bi bi-box-arrow-left"></i> Выйти
                            </button>
                        </li>
                    </ul>
                </nav>
                
                <!-- Main Content -->
                <div class="main-content">
                    <!-- Header -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h3 class="mb-1">
                                <i class="bi bi-speedometer2"></i> Дашборд мониторинга
                            </h3>
                            <p class="text-muted mb-0">Обзор инцидентов и статистика безопасности</p>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-primary">Онлайн демо</span>
                        </div>
                    </div>
                    
                    <!-- Stats Cards -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-3">
                            <div class="glass-card metric-card">
                                <div class="mb-2">
                                    <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
                                </div>
                                <h2 class="mb-1">${stats.total}</h2>
                                <p class="small mb-0">Всего инцидентов</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="glass-card metric-card">
                                <div class="mb-2">
                                    <i class="bi bi-clock fs-1 text-info"></i>
                                </div>
                                <h2 class="mb-1">${stats.open}</h2>
                                <p class="small mb-0">Открытых</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="glass-card metric-card">
                                <div class="mb-2">
                                    <i class="bi bi-shield-exclamation fs-1 text-danger"></i>
                                </div>
                                <h2 class="mb-1">${stats.highSeverity}</h2>
                                <p class="small mb-0">Высокой важности</p>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="glass-card metric-card">
                                <div class="mb-2">
                                    <i class="bi bi-lock fs-1 text-success"></i>
                                </div>
                                <h2 class="mb-1">${stats.confidential}</h2>
                                <p class="small mb-0">Конфиденциальных</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Charts -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-8">
                            <div class="glass-card p-4">
                                <h5 class="mb-3">Распределение инцидентов по статусам</h5>
                                <div style="height: 300px;">
                                    <canvas id="statusChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="glass-card p-4">
                                <h5 class="mb-3">По категориям</h5>
                                <div style="height: 300px;">
                                    <canvas id="categoryChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recent Incidents -->
                    <div class="glass-card p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0">Последние инциденты</h5>
                            <a href="#" class="btn btn-sm btn-outline-primary" 
                               onclick="SecurityIncidentApp.changeView('incidents')">
                                Все инциденты <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                        
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Название</th>
                                        <th>Важность</th>
                                        <th>Статус</th>
                                        <th>Дата</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.state.incidents.slice(0, 5).map(incident => `
                                        <tr>
                                            <td><strong>#${incident.id}</strong></td>
                                            <td>${incident.title}</td>
                                            <td>
                                                <span class="severity-badge severity-${incident.severity}">
                                                    Уровень ${incident.severity}
                                                </span>
                                            </td>
                                            <td>
                                                <span class="status-badge status-${incident.status}">
                                                    ${this.getStatusText(incident.status)}
                                                </span>
                                            </td>
                                            <td>${this.formatDate(incident.createdAt)}</td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-info" 
                                                        onclick="SecurityIncidentApp.viewIncident(${incident.id})">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Инициализация графиков
    renderCharts() {
        // График по статусам
        const statusCtx = document.getElementById('statusChart');
        if (statusCtx) {
            const statusData = {
                labels: ['Открытые', 'В работе', 'Решены', 'Закрыты'],
                datasets: [{
                    data: [
                        this.state.incidents.filter(i => i.status === 'open').length,
                        this.state.incidents.filter(i => i.status === 'in-progress').length,
                        this.state.incidents.filter(i => i.status === 'resolved').length,
                        0 // Для демо
                    ],
                    backgroundColor: [
                        'rgba(13, 110, 253, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(25, 135, 84, 0.7)',
                        'rgba(108, 117, 125, 0.7)'
                    ]
                }]
            };
            
            new Chart(statusCtx, {
                type: 'doughnut',
                data: statusData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
        
        // График по категориям
        const categoryCtx = document.getElementById('categoryChart');
        if (categoryCtx) {
            new Chart(categoryCtx, {
                type: 'bar',
                data: {
                    labels: ['Фишинг', 'Утечка', 'DDoS', 'Вредоносное ПО'],
                    datasets: [{
                        label: 'Количество',
                        data: [2, 1, 1, 1],
                        backgroundColor: 'rgba(13, 110, 253, 0.7)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    },

    // Рендер страницы инцидентов
    renderIncidentsPage() {
        return `
            <div class="container-fluid">
                <nav class="sidebar glass-card">
                    <!-- Sidebar content same as dashboard -->
                    ${this.renderSidebar()}
                </nav>
                
                <div class="main-content">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h3 class="mb-1">
                                <i class="bi bi-exclamation-triangle"></i> Управление инцидентами
                            </h3>
                            <p class="text-muted mb-0">Просмотр и управление инцидентами ИБ</p>
                        </div>
                        <div>
                            ${this.state.user.role === 'admin' || this.state.user.role === 'analyst' ? `
                                <button class="btn btn-primary" onclick="SecurityIncidentApp.changeView('new-incident')">
                                    <i class="bi bi-plus-circle"></i> Новый инцидент
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Filters -->
                    <div class="glass-card p-3 mb-4">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <select class="form-select" onchange="SecurityIncidentApp.filterIncidents()" id="filterStatus">
                                    <option value="">Все статусы</option>
                                    <option value="open">Открытые</option>
                                    <option value="in-progress">В работе</option>
                                    <option value="resolved">Решены</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <select class="form-select" onchange="SecurityIncidentApp.filterIncidents()" id="filterSeverity">
                                    <option value="">Все уровни</option>
                                    <option value="1">Низкий (1)</option>
                                    <option value="2">Средний (2)</option>
                                    <option value="3">Высокий (3)</option>
                                    <option value="4">Критический (4)</option>
                                    <option value="5">Чрезвычайный (5)</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Поиск по названию..." 
                                           id="searchIncidents" onkeyup="SecurityIncidentApp.searchIncidents()">
                                    <button class="btn btn-outline-secondary" type="button">
                                        <i class="bi bi-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Incidents Table -->
                    <div class="glass-card p-4">
                        <table class="table table-hover" id="incidentsTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Категория</th>
                                    <th>Важность</th>
                                    <th>Статус</th>
                                    <th>Создан</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.state.incidents.map(incident => `
                                    <tr>
                                        <td><strong>#${incident.id}</strong></td>
                                        <td>
                                            ${incident.title}
                                            ${incident.confidential ? 
                                                ' <i class="bi bi-lock text-warning" title="Конфиденциально"></i>' : ''}
                                        </td>
                                        <td>${this.getCategoryText(incident.category)}</td>
                                        <td>
                                            <span class="severity-badge severity-${incident.severity}">
                                                Уровень ${incident.severity}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="status-badge status-${incident.status}">
                                                ${this.getStatusText(incident.status)}
                                            </span>
                                        </td>
                                        <td>${this.formatDate(incident.createdAt)}</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-info me-1" 
                                                    onclick="SecurityIncidentApp.viewIncident(${incident.id})">
                                                <i class="bi bi-eye"></i>
                                            </button>
                                            ${(this.state.user.role === 'admin' || this.state.user.role === 'analyst') ? `
                                            <button class="btn btn-sm btn-outline-warning me-1" 
                                                    onclick="SecurityIncidentApp.editIncident(${incident.id})">
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            ` : ''}
                                            ${this.state.user.role === 'admin' ? `
                                            <button class="btn btn-sm btn-outline-danger" 
                                                    onclick="SecurityIncidentApp.deleteIncident(${incident.id})">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    // Вспомогательные функции
    getStatusText(status) {
        const statuses = {
            'open': 'Открыт',
            'in-progress': 'В работе',
            'resolved': 'Решен',
            'closed': 'Закрыт'
        };
        return statuses[status] || status;
    },

    getCategoryText(category) {
        const categories = {
            'phishing': 'Фишинг',
            'data-breach': 'Утечка данных',
            'ddos': 'DDoS атака',
            'malware': 'Вредоносное ПО',
            'unauthorized-access': 'Несанкционированный доступ'
        };
        return categories[category] || category;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    // Смена представления
    changeView(view) {
        this.state.currentView = view;
        this.render();
        return false;
    },

    // Выход из системы
    logout() {
        localStorage.removeItem('security_user');
        localStorage.removeItem('security_token');
        this.state.user = null;
        this.state.token = null;
        this.state.currentView = 'login';
        this.render();
        this.showToast('Выход выполнен', 'Вы успешно вышли из системы', 'info');
    },

    // Показ уведомлений
    showToast(title, message, type = 'info') {
        // Создаем toast элемент
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0`;
        toast.id = toastId;
        toast.setAttribute('role', 'alert');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}</strong><br>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                        data-bs-dismiss="toast"></button>
            </div>
        `;
        
        // Добавляем в документ
        document.body.appendChild(toast);
        
        // Инициализируем и показываем
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
        
        // Удаляем после скрытия
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    },

    // Инициализация DataTable
    initDataTable() {
        setTimeout(() => {
            const table = document.getElementById('incidentsTable');
            if (table) {
                new DataTable(table, {
                    pageLength: 10,
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/ru.json'
                    }
                });
            }
        }, 100);
    },

    // Просмотр инцидента
    viewIncident(id) {
        const incident = this.state.incidents.find(i => i.id === id);
        if (!incident) return;
        
        // Для демо покажем модальное окно
        const modal = new bootstrap.Modal(document.createElement('div'));
        const modalElement = document.createElement('div');
        modalElement.className = 'modal fade';
        modalElement.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content glass-card">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-exclamation-triangle"></i> Инцидент #${incident.id}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-md-8">
                                <h4>${incident.title}</h4>
                                <p class="text-muted">${incident.description}</p>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <strong>Статус:</strong><br>
                                    <span class="status-badge status-${incident.status}">
                                        ${this.getStatusText(incident.status)}
                                    </span>
                                </div>
                                <div class="mb-3">
                                    <strong>Важность:</strong><br>
                                    <span class="severity-badge severity-${incident.severity}">
                                        Уровень ${incident.severity}
                                    </span>
                                </div>
                                <div class="mb-3">
                                    <strong>Категория:</strong><br>
                                    ${this.getCategoryText(incident.category)}
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h6><i class="bi bi-info-circle"></i> Детали</h6>
                                <ul class="list-unstyled">
                                    <li><strong>Создал:</strong> ${incident.createdBy}</li>
                                    <li><strong>Дата создания:</strong> ${this.formatDate(incident.createdAt)}</li>
                                    <li><strong>Обновлен:</strong> ${this.formatDate(incident.updatedAt)}</li>
                                    <li><strong>Затронуто пользователей:</strong> ${incident.affectedUsers}</li>
                                    <li><strong>Конфиденциальность:</strong> 
                                        ${incident.confidential ? 'Да <i class="bi bi-lock text-warning"></i>' : 'Нет'}
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6><i class="bi bi-shield-exclamation"></i> Векторы атак</h6>
                                <div class="mb-2">
                                    ${(incident.vectors || []).map(vector => `
                                        <span class="badge bg-secondary me-1">${vector}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        ${(this.state.user.role === 'admin' || this.state.user.role === 'analyst') ? `
                        <button type="button" class="btn btn-primary" 
                                onclick="SecurityIncidentApp.editIncident(${incident.id})">
                            <i class="bi bi-pencil"></i> Редактировать
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalElement);
        modal._element = modalElement;
        modal.show();
        
        // Удаляем модальное окно после закрытия
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    },

    // Другие методы (editIncident, deleteIncident, etc.)
    editIncident(id) {
        this.showToast('Редактирование', `Редактирование инцидента #${id} (демо-режим)`, 'info');
    },

    deleteIncident(id) {
        if (confirm(`Удалить инцидент #${id}?`)) {
            this.state.incidents = this.state.incidents.filter(i => i.id !== id);
            this.calculateStats();
            this.render();
            this.showToast('Удалено', `Инцидент #${id} удален`, 'success');
        }
    },

    // Загрузка данных дашборда
    loadDashboardData() {
        // В демо-режиме данные уже загружены
        this.calculateStats();
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Общие обработчики
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                const action = e.target.getAttribute('data-action');
                if (this[action]) {
                    this[action]();
                }
            }
        });
    }
};

// Делаем доступным глобально
window.SecurityIncidentApp = SecurityIncidentApp;