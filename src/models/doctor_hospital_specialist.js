"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Hospital_Specialist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Doctor_Hospital_Specialist.init(
    {
      doctorId: DataTypes.INTEGER,
      hospitalId: DataTypes.INTEGER,
      specialistId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctor_Hospital_Specialist",
    }
  );
  return Doctor_Hospital_Specialist;
};
