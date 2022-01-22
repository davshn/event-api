const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "event",
    {
      id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      place: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
        chatBox: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      eventPic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      eventVid: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      availableStock: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },
    { timestamps: false }
  );
};
