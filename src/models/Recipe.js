const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  sequelize.define('recipe', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    healthScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    steps: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    apiID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'LOCAL'
    }
  });
};
