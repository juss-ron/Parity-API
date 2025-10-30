const express = require('express');
const sequelize = require('./database');

const authRoutes = require('./routes/auth');
const clubRoutes = require('./routes/clubs');

const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/clubs', clubRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(3000, () => console.log('Server running at http://localhost:3000'));
});