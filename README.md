# 2026_TPIN2_G01 - Pio Chat

Aplicación de chat en tiempo real (tipo WhatsApp) hecha con **Next.js**, **Node.js**, **MySQL** y **Socket.IO**.
Permite registrarse, iniciar sesión, ver los chats propios (individuales y grupales), crear chats nuevos a partir del mail de otro usuario, crear grupos con varios mails, ver el historial de cada chat y chatear en tiempo real. Los mensajes se guardan en la base de datos.

## Usuario de ejemplo

| Mail | Contraseña |
|------|------------|
| admin@gmail.com | admin |


## Estructura

- `frontend/` - Next.js (puerto 3000 / 3001)
- `backend/` - Node.js + Express + Socket.IO (puerto 4000)
- `docs/` - `script.sql` (tablas + datos de ejemplo) y el DER

## Cómo correrlo

1. **Base de datos:** ejecutar `docs/script.sql` en la base del grupo (borra y recrea las tablas).
2. **Backend:** copiar `backend/env.example` como `backend/.pio.env` (o `.home.env`) y completar los datos de MySQL. Después:
   ```bash
   cd backend
   npm install
   npm run pio      # o: npm run home
   ```
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev      
   ```

