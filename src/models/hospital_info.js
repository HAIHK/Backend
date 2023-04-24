"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hospital_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hospital_Info.belongsTo(models.User, {
        foreignKey: "doctorId",
      });

      Hospital_Info.belongsTo(models.Allcode, {
        foreignKey: "priceId",
        targetKey: "keyWord",
        as: "priceTypeData",
      });
      Hospital_Info.belongsTo(models.Allcode, {
        foreignKey: "paymentId",
        targetKey: "keyWord",
        as: "paymentTypeData",
      });
      Hospital_Info.belongsTo(models.Allcode, {
        foreignKey: "provinceId",
        targetKey: "keyWord",
        as: "provinceTypeData",
      });
    }
  }
  Hospital_Info.init(
    {
      doctorId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressHospital: DataTypes.STRING,
      nameHospital: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Hospital_Info",
      freezeTableName: true,
    }
  );
  return Hospital_Info;
};
