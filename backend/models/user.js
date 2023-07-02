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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    department: DataTypes.STRING,
    designation: DataTypes.STRING,
    dateOfJoining: DataTypes.DATE,
    salary: DataTypes.STRING,
    date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: defaultAvatar,
    },
    userType: {
      type: DataTypes.ENUM,
      values: ['Admin', 'Manager', 'Employee'],
      defaultValue: 'Employee',
    },
    verificationToken: DataTypes.STRING,
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpire: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'User',
  }
);

module.exports = User;
