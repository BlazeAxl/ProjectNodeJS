const express = require('express')
const router = express.Router();
const admin_con = require('../../controller/AdminController/adminController')
const  authenticateToken  = require('../../middleware/auth');


//ROUTE PROTEJER
router.post('/Filiere_add',authenticateToken,admin_con.Ajout_filiere)
router.get('/GetOneFiliere/:id',authenticateToken,admin_con.Get_One_Filiere)
router.get('/GetAllFiliere',authenticateToken,admin_con.Get_All_filiere)
router.put('/UpdateFiliere/:id',authenticateToken,admin_con.Modif_Filiere)
router.delete('/DeleteFiliere/:id',authenticateToken,admin_con.DeleteFiliere)

//ROUTE CLASS PROTEJER
router.post('/CreateClass',authenticateToken,admin_con.CreateClass)
router.delete('/DeleteClass/:id',authenticateToken,admin_con.Delete_Class)


//ROUTE STUDENT PROTEJER && REQUETTE
router.post('/CreateStudent',authenticateToken,admin_con.CreateEtudiant)
router.delete('/DeleteStudent/:id',authenticateToken,admin_con.DeleteEtudiant)
router.post('/SendPasswordByMail/:id',authenticateToken,admin_con.EnvoiMail)
router.put('/Requete/Accepte/:id',authenticateToken,admin_con.TraiterRequette)
router.put('/Requete/Refuser/:id',authenticateToken,admin_con.RefuserRequette)
router.get('/AllRequette',authenticateToken,admin_con.GetAllRequette)
router.get('/OneRequette/:id',authenticateToken,admin_con.GetOneRequette)



//ROUTE MODULE PROTEJER
router.post('/CreateModule',authenticateToken,admin_con.CreateModule)
router.get('/AllModule/:id',authenticateToken,admin_con.getAllModuleParFiliere)
router.get('/OneModule/:id',authenticateToken,admin_con.getOneModule)


//ROUTE EVALUATION && TYPE_EVALUATION
router.post('/CreateTypeEvaluation',authenticateToken,admin_con.CreateTypeEvaluation)
router.post('/CreateEvaluation',authenticateToken,admin_con.CreateEvaluation)
router.put('/UpdateEvaluation/:id',authenticateToken,admin_con.updateEvaluation)
router.delete('/deleteEvaluation/:id',authenticateToken,admin_con.AnnulerEvaluation)

//ROUTE Assigns $ COURSE
router.post('/CreateCourse',authenticateToken,admin_con.Creer_Course)
router.put('/UpdateCourse/:id',authenticateToken,admin_con.ModifierCourse)
router.post('/AssignCourse',authenticateToken,admin_con.affecterCour)
router.post('/Deassigner',authenticateToken,admin_con.de_affecter)
router.delete('/DeleteAssign/:id',authenticateToken,admin_con.SupAssgnation)

//ROUTE DEPARTEMENT & FILIERE
router.post('/AddDepartement',authenticateToken,admin_con.AddDepartement)
router.post('/AffecterEnseignant/:id',authenticateToken,admin_con.AffecterEnseignantDepartement)
router.get('/OneDepartement',authenticateToken,admin_con.getOneDepartement)
router.get('/AllDepartement',authenticateToken,admin_con.getAllDepartement)
router.put('/ModifDepartement/:id',authenticateToken,admin_con.Modif_Department)
router.delete('/DeleteDepartement/:id',authenticateToken,admin_con.DeleteDepartement)
router.get('/AllFiliereDepartement/:id',authenticateToken,admin_con.ListFiliereParDepartement)
router.get('/NombreFilierDepartement/:id',authenticateToken,admin_con.NombreFiliereParDepartement)
router.post('/GenererPvEvaluation',authenticateToken,admin_con.genererPdfEvaluation)



router.post('/login',admin_con.login)

module.exports = router