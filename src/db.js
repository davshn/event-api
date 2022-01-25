require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB } = process.env;

sequelize = new Sequelize(DB, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Event, User, Category, Ticket } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

// Relación entre usuarios y eventos 1:M
User.hasMany(Event);
Event.belongsTo(User);

// Relación entre eventos y categorias M:M
Event.belongsToMany(Category, { through: "eventcategory" });
Category.belongsToMany(Event, { through: "eventcategory" });

// Relación entre usuarios y categorias M:M
User.belongsToMany(Category, { through: "usercategory" });
Category.belongsToMany(User, { through: "usercategory" });

// Relación entre usuarios y tickets 1:M
User.hasMany(Ticket);
Ticket.belongsTo(User);

// Relación entre Ticket y Evento 1:M
Event.hasMany(Ticket);
Ticket.belongsTo(Event);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
