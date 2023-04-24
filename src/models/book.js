"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.User, {
        foreignKey: "examinerId",
        targetKey: "id",
        as: "examinerDt",
      });
      Book.belongsTo(models.Allcode, {
        foreignKey: "timeType",
        targetKey: "keyWord",
        as: "timeTypeDataExaminer",
      });
    }
  }
  Book.init(
    {
      StatusId: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
      examinerId: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Book",
      freezeTableName: true,
    }
  );
  return Book;
};
