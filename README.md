# SkyFish Optimizer (Hypixel SkyBlock Fishing Assistant)

Веб-застосунок для аналітики та оптимізації ігрового рибальського спорядження у режимі **Hypixel SkyBlock (Minecraft)** на базі **React 18** та **Vite**.

---

## 🗂 Структура проєкту (React + Vite)

```text
skyfish-optimizer/
├── docs/                               # Документація, звіт та мокапи
│   ├── REPORT.md                       # Готовий звіт для здачі
│   ├── TECHNICAL_SPECIFICATION.md      # Повне ТЗ v2.1
│   └── mockups/                        # Цифрові макети сторінок (Figma/UI)
│       ├── 01_profile_dashboard.jpg
│       ├── 02_optimizer.jpg
│       ├── 03_account_builds.jpg
│       └── 04_login_register.jpg
├── public/                             # Статичні файли (favicon, маніфест)
├── src/                                # Вихідний код клієнтського застосунку
│   ├── assets/                         # Зображення, іконки, глобальні стилі
│   ├── components/                     # Компоненти інтерфейсу
│   │   ├── layout/                     # Шапка (Header), Навігація, Футер
│   │   ├── profile/                    # Віджети пошуку, спорядження та статів
│   │   ├── optimizer/                  # Таблиця апгрейдів, фільтри, калькулятор бюджету
│   │   └── account/                    # Кабінет, менеджер білдів, порівняння Before/After
│   ├── data/                           # fishing-data.json (статичні характеристики гри)
│   ├── hooks/                          # Користувацькі React-хуки
│   ├── services/                       # Клієнти API (Hypixel, Coflnet, Bazaar)
│   ├── store/                          # Глобальний стан (Zustand)
│   └── utils/                          # Математичні розрахунки (Cost per Stat, Knapsack)
└── README.md                           # Загальний опис проєкту
```
