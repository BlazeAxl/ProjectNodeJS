const db = require("../config/bd");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

async function hashPassword(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  
  async function verifyPassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  }
  
  async function GetUser(email){
    const [data] = await db.query(`SELECT * FROM civil where email_civil = ?`,[email])
    console.log(data)
    return data[0]
  }

  async function GetUsr(email) {
    const [data] = await db.query(`SELECT * from utilisateur where email = ?`,[email])
    return data[0]
  }

  async function GetUsrByPassword(pwd) {
    const [data] = await db.query(`SELECT * from utilisateur where email = ?`,[email])
    return data[0]
  }

  async function estUsr(nom,email,verified){
    const [rows] = await db.query(`SELECT * FROM utilisateur where nom = ? and email = ? and password = ?`,[nom,email,verified])
    return rows.length > 0;
  }
  
   async function estUser(email,verified,NumeroIdentite) {
    const [rows] =  await db.query(
      `SELECT * FROM civil WHERE email_civil = ? and password = ? and NumeroIdentite = ?`,
      [email, verified, NumeroIdentite]
    );
  
    return rows.length > 0
  }



  module.exports = {
    hashPassword,
    verifyPassword,
    GetUser,
    estUser,
    GetUsr,
    estUsr,
    GetUsrByPassword,
  }