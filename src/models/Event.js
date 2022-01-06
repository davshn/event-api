const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "event",
    {
      id: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      creators: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 5.0,
      },
      category: {
        type: DataTypes.ARRAY(DataTypes.STRING),
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
    },
    { timestamps: false }
  );
};
