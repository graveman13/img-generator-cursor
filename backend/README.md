# Img Generator Backend

Backend API для веб-застосунку генерації зображень з тексту.

## Технічний стек

- **Runtime:** Node.js
- **Framework:** Express.js
- **Мова:** TypeScript
- **Авторизація:** JWT
- **Хешування паролів:** bcryptjs
- **API для генерації зображень:** Replicate.com

## Встановлення

1. Встановіть залежності:
```bash
npm install
```

2. Створіть `.env` файл у корені backend папки:
```env
PORT=3001
JWT_SECRET=your-secret-key-here
REPLICATE_API_TOKEN=your-replicate-token-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

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