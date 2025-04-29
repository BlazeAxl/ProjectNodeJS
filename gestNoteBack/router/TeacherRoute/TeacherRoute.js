const express = require('express')
const router = express.Router();
const Teach_con = require('../../controller/TeacherController/TeacherController')
const  authenticateToken  = require('../../middleware/authTeacher');


router.post('/TeacherInscrire',Teach_con.InscriptionEnseigant)
router.post('/TeacherLogin',Teach_con.ConnexionTeacher)

router.get('/AllFiliere',authenticateToken,Teach_con.Get_All_filiere)
router.get('/CourFiliere/:id',authenticateToken,Teach_con.ListeCourParFiliere)
router.get('/EtudiantFiliere/:id',authenticateToken,Teach_con.ListerEtudiantParFiliere)
router.get('/ListeFiliere/:id',authenticateToken,Teach_con.Get_One_Filiere)
router.post('/AttribuerNote/:id',authenticateToken,Teach_con.AttribuerNote)

module.exports = router