const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      profilePic: {
        type: DataTypes.BLOB,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
        allowNull: false,
        unique:true,
      },
      verifyProfile: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      interests: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },

      termsAndconditions: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { timestamps: false }
  );
};
