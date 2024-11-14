const { Sequelize, DataTypes } = require("sequelize");

/**
 * 
 * @param {Sequelize} sequelize 
 * @param {DataTypes} DataTypes 
 * @returns 
 */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User',{
        id:{ type: DataTypes.STRING, primaryKey: true, unique: true},
        language: {
            type: DataTypes.STRING,
            default: "en",
            allowNull: false
        }
      });

}