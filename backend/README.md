# Img Generator Backend

Backend API для веб-застосунку генерації зображень з тексту.

## Технічний стек

- **Runtime:** Node.js
- **Framework:** Express.js
- **Мова:** TypeScript
- **Авторизація:** JWT
- **Хешування паролів:** bcryptjs
- **API для генерації зображень:** Segmind API (основний), Hugging Face Inference API (резервний)

## Встановлення

1. Встановіть залежності:
```bash
npm install
```

2. Створіть `.env` файл у корені backend папки:
```env
PORT=8080
JWT_SECRET=your-secret-key-here
HUGGING_FACE_TOKEN=your-hugging-face-token-here
SEGMIND_API_KEY=your-segmind-api-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

3. **Отримайте API ключі:**

   **Segmind API ключ (основний):**
   - Перейдіть на https://segmind.com
   - Зареєструйте безкоштовний акаунт
   - Отримайте API ключ у розділі Dashboard
   - Додайте його у `.env` файл як `SEGMIND_API_KEY`
   - **Безкоштовний тарифний план:** 100 кредитів на початок

   **Hugging Face токен (резервний):**
   - Перейдіть на https://huggingface.co/settings/tokens
   - Створіть новий токен (виберіть тип "Read")
   - Скопіюйте токен у `.env` файл як `HUGGING_FACE_TOKEN`
   - **Це повністю безкоштовно!** Ліміт: 1000 запитів на місяць

## Запуск

### Режим розробки
```bash
npm run dev
```

### Продакшен
```bash
npm run build
npm start
```

## API Endpoints

### Авторизація
- `POST /api/auth/register` - Реєстрація користувача
- `POST /api/auth/login` - Авторизація користувача

### Зображення
- `POST /api/images/generate` - Генерація зображення (потребує авторизації)
- `POST /api/images/save` - Збереження зображення (потребує авторизації)
- `GET /api/images/user` - Отримання зображень користувача (потребує авторизації)

### Сервісні
- `GET /health` - Перевірка стану сервера

## Структура проекту

```
src/
├── controllers/     # HTTP контролери
├── middleware/      # Express middleware
├── models/         # TypeScript типи та інтерфейси
├── routes/         # API роути
├── services/       # Бізнес-логіка
├── utils/          # Утилітарні функції
├── app.ts          # Конфігурація Express
└── server.ts       # Точка входу
```

## Особливості реалізації

- Строга типізація TypeScript
- Чисті функції без побічних ефектів
- JWT авторизація з middleware
- Тимчасове сховище в пам'яті (для продакшену потрібна база даних)
- CORS налаштування для frontend
- Error handling та валідація

## Генерація зображень

**Використовується Hugging Face Inference API:**
- **Модель:** `runwayml/stable-diffusion-v1-5`
- **Повністю безкоштовно** з лімітом 1000 запитів/місяць
- **Час генерації:** 10-30 секунд (залежно від завантаження)
- **Формат результату:** Base64 data URL
- **Розмір:** 512x512 пікселів (за замовчуванням)

**Можливі помилки:**
- `503` - Модель завантажується (зачекайте 1-2 хвилини)
- `429` - Перевищено ліміт запитів
- `401` - Невалідний токен