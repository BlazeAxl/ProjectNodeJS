const express = require('express')
const router = express.Router()
const cont = require('../../controller/gestionController/adminController')


router.get('/AllUser',cont.GetALLUser)
router.get('/categorie',cont.GetAllCat)

router.post("/CreateMagasinier",cont.CreateMagasinier)
router.post("/Delete_User/:id",cont.Delete_User)

module.exports = router