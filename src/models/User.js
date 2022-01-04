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
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false
    },
      dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
      },
      verifyProfile: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      interests: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },

      termsAndconditions: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
