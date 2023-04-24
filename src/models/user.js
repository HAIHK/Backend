"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, {
        foreignKey: "qualificationId",
        targetKey: "keyWord",
        as: "qualificationDt",
      });
      User.belongsTo(models.Allcode, {
        foreignKey: "gender",
        targetKey: "keyWord",
        as: "genderDt",
      });
      User.hasMany(models.Calendar, {
        foreignKey: "id",
        targetKey: "doctorId",
        as: "doctorData",
      });
      User.hasMany(models.Book, {
        foreignKey: "examinerId",
        as: "examinerDt",
      });
      User.hasOne(models.Markdown, { foreignKey: "doctorId" });
      User.hasOne(models.Hospital_Info, { foreignKey: "doctorId" });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phonenumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.STRING,
      positionId: DataTypes.STRING,
      qualificationId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
