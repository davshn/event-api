const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "user",
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

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
        allowNull: false,
        unique: true,
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
      verificationCode : {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    { timestamps: false }
  );
};
