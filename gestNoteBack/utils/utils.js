const db = require('../config/bd')
const bcrypt = require('bcrypt')

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
async function GetUser(email) {
  const [data] = await db.query(`SELECT * FROM admin where email = ? `, [email])
  console.log(data)
  return data[0]
}

async function getSumCreditCourParModule(id){
  const [data] = await db.query(`SELECT COUNT(c.credit) FROM cour c inner join module m on c.id_module = m.id_mod where m.id_mod = ?`,[id])
  console.log(data)
  return data[0]
}

async function GetOneFiliere(nom) {
  const [data] = await db.query(`SELECT * FROM filiere where nom_fil = ?`, [nom])
  console.log(data)
  return data[0]
}
async function ExistClass(nom) {
  const [data] = await db.query(`SELECT * FROM classe Where label_class = ?`, [nom])
  console.log(data)
  return data[0]
}

async function ExistCourse(nom) {
  const [data] = await db.query(`SELECT * FROM cour Where label_cour = ?`, [nom])
  console.log(data)
  return data[0]
}

async function ExistTeacher(nom) {
  const [data] = await db.query(`SELECT * FROM enseignant Where nom = ?`, [nom])
  console.log(data)
  return data[0]
}

async function ExistTeacherByEmail(email) {
  const [data] = await db.query(`SELECT * FROM enseignant Where email = ?`, [email])
  console.log(data)
  return data[0]
}

async function ExistStudent(Mat, email) {
  const [data] = await db.query(`SELECT * FROM etudiant where matricule = ? and email = ?`, [Mat, email])
  console.log(data)
  return data[0]
}

async function ExistStudentByEmail(email) {
  const data = await db.query(`SELECT * FROM etudiant where email = ?`, [email])
  console.log(data)
  return data[0]
}

async function getStudentById(id) {
  const [data] = await db.query(`SELECT * FROM etudiant where id_etud = ?`, [id])
  console.log(data)
  return data[0]
}

async function getCourAssignToTeacherByFiliere(id_f,id_en,id_d){
  const [data] = await db.query(`SELECT c.* from cour c inner join filiere f on c.id_filiere = f.id_filiere inner join assignation s on s.id_cour = c.id_cour inner join enseignant e on e.id_enseignant = s.id_enseignant inner join departement d on d.id = e.id_departement where s.id_enseignant = ? and f.id_filiere = ? and d.id = ?`,[id_en,id_f,id_d])
  console.log(data)
  return data[0]
}

async function getModule(nom_mod) {
  const [data] = await db.query(`SELECT m.* FROM module m inner join filiere f on m.id_mod = f.id_filiere Where m.nom_module = ?`, [nom_mod])
  console.log(data)
  return data[0]
}

async function getDepartment(nom) {
  const [data] = await db.query(`SELECT * FROM departement where nom = ?`, [nom])
  console.log(data)
  return data[0]
}

async function getDepartmentById(id) {
  const [data] = await db.query(`SELECT * FROM departement where id = ?`, [id])
  console.log(data)
  return data[0]
}

async function getAllDepartment() {
  const data = await db.query(`SELECT * FROM departement`)
  console.log(data)
  return data[0]
}

async function getFiliereParDepartemnt(id) {
  const [data] = await db.query(`SELECT f.nom_fil FROM filiere f inner join departement d on f.id_departement = d.id where d.id = ?`,[id])
  console.log(data)
  return data[0]
}

async function getNombreFilierParDepartement(id){
  const data = await db.query(`SELECT COUNT(f.id_filiere) FROM filiere f inner join departement d on f.id_departement = d.id where id = ?`,
    [id]
  )
  console.log(data)
  return data[0]
}

async function ListeCourParFiliere(id){
  const [data] = await db.query(`SELECT c.* FROM cour c inner join filiere f on c.id_filiere = f.id_filiere where f.id_filiere = ?`,[id])
  console.log(data)
  return data[0]
}

async function ListeTypeEvaluation(){
  const [data] = await db.query(`SELECT * FROM type_evaluation`)
  console.log(data)
  return data[0]
}

async function getTypeEvaluationParNom(nom){
  const [data] = await db.query(`SELECT * FROM type_evaluation WHERE type = ?`,[nom])
  console.log(data)
  return data[0]
}

async function getCourParNom(label) {
  const [data] = await db.query(`SELECT * FROM cour WHERE label_cour = ?`,[label])
  console.log(data)
  return data[0]
}

function generateValidPassword() {
  const length = 8; // Longueur minimale du mot de passe
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specialChars = '@$!%*?&';

  // Assurez-vous d'inclure au moins un caractère de chaque type
  const passwordArray = [
    lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)],
    upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)],
    digits[Math.floor(Math.random() * digits.length)],
    specialChars[Math.floor(Math.random() * specialChars.length)]
  ];

  // Remplir le reste du mot de passe avec des caractères aléatoires
  const allChars = lowerCaseChars + upperCaseChars + digits + specialChars;
  for (let i = passwordArray.length; i < length; i++) {
    passwordArray.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Mélanger le mot de passe pour éviter un ordre prévisible
  const password = passwordArray.sort(() => Math.random() - 0.5).join('');
  return password;
}
const getToken = (req) => {
  console.log(req.header('Authorization'))
  const authHeader = req.header('Authorization')
  const token = authHeader.replace('Bearer ', '');
  if (token) {
    return token;
  }
  return null;
}
function drawTable(doc, table) {
  const tableTop = 150;
  const colWidths = [];
  const rowHeight = 30;
  const margin = 50;

  // Calcul des largeurs de colonnes
  table.headers.forEach((header, i) => {
    colWidths[i] = doc.widthOfString(header) + margin;
  });

  table.rows.forEach(row => {
    row.forEach((cell, i) => {
      const cellWidth = doc.widthOfString(String(cell)) + margin;
      if (cellWidth > colWidths[i]) {
        colWidths[i] = cellWidth;
      }
    });
  });

  // Dessiner les en-têtes
  let x = margin;
  table.headers.forEach((header, i) => {
    doc.font('Helvetica-Bold').text(header, x, tableTop, { width: colWidths[i], align: 'left' });
    x += colWidths[i];
  });

  // Dessiner les lignes de données
  let y = tableTop + rowHeight;
  table.rows.forEach((row, rowIndex) => {
    x = margin;
    row.forEach((cell, colIndex) => {
      doc.font('Helvetica').text(String(cell), x, y, { width: colWidths[colIndex], align: 'left' });
      x += colWidths[colIndex];
    });
    y += rowHeight;
  });
}
const ReturnEmail = async (req) => {
  const token = await getToken(req)
  const decoded_token = jwt.verify(token, process.env.KEY);
  return decoded_token.email;
}
module.exports = {
  hashPassword,
  verifyPassword,
  GetUser,
  GetOneFiliere,
  ExistClass,
  ExistStudent,
  getModule,
  ExistCourse,
  ExistTeacher,
  getStudentById,
  ExistStudentByEmail,
  generateValidPassword,
  ReturnEmail,
  ExistTeacherByEmail,
  getDepartment,
  getDepartmentById,
  getAllDepartment,
  getFiliereParDepartemnt,
  getNombreFilierParDepartement,
  ListeCourParFiliere,
  ListeTypeEvaluation,
  getTypeEvaluationParNom,
  getCourParNom,
  getCourAssignToTeacherByFiliere,
  getSumCreditCourParModule,
  drawTable
}