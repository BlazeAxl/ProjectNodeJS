const express = require('express')
const router = express.Router();
const stud_con = require('../../controller/StudentController/StudentController')
const  authenticateToken  = require('../../middleware/authStudent');

router.post('/login',stud_con.ConnexionEtudiant)

router.post('/AllModule',authenticateToken,stud_con.ListeModule)
router.post('/Notif',authenticateToken,stud_con.Notifier)
router.get('/CourByModule/:id',authenticateToken,stud_con.ListeCourParModule)
router.get('ListModule',authenticateToken,stud_con.ListeModule)
router.post('/DepotRequette',authenticateToken,stud_con.Depot_Requette)

module.exports = router