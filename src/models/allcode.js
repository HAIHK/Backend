"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Allcode.hasMany(models.User, {
        foreignKey: "qualificationId",
        as: "qualificationDt",
      });
      Allcode.hasMany(models.User, { foreignKey: "gender", as: "genderDt" });
      Allcode.hasMany(models.Calendar, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });

      Allcode.hasMany(models.Hospital_Info, {
        foreignKey: "priceId",
        as: "priceTypeData",
      });
      Allcode.hasMany(models.Hospital_Info, {
        foreignKey: "paymentId",
        as: "paymentTypeData",
      });
      Allcode.hasMany(models.Hospital_Info, {
        foreignKey: "provinceId",
        as: "provinceTypeData",
      });
      Allcode.hasMany(models.Book, {
        foreignKey: "timeType",
        as: "timeTypeDataExaminer",
      });
    }
  }
  Allcode.init(
    {
      keyWord: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      valueVi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcode",
    }
  );
  return Allcode;
};
