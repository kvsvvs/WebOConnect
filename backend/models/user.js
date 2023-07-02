const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  }
);
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

const defaultAvatar = `${process.env.SERVER_URL}/uploads/defaultAvatar.svg`;

class User extends Model {
  static async findAndValidate(email, password) {
    const foundUser = await this.findOne({ where: { email } });

    if (!foundUser) {
      return false;
    }

    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
  }

  async getResetPasswordToken() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    await this.save();

    return resetToken;
  }

  async saveWithHashedPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    await this.save();
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Active', 'Deactivated'),
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    profile_pic: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: false, // Disable timestamp fields (createdAt and updatedAt)
  }
);

module.exports = User;
