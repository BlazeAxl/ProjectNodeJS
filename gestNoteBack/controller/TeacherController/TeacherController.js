const db = require('../../config/bd')
const util = require('../../utils/utils')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const InscriptionEnseigant = async (req, res) => {
    try {
        const { nom, email, password } = req.body
        if (!nom || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const ExistTeacher = await util.ExistTeacherByEmail(email)
        if (ExistTeacher) {
            return res.status(400).json({
                success: false,
                error: "User Exist Already"
            })
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                error: "Password : 8 caracters with 1 Capital Letter,A small Letter And One Digit"
            })
        }
        const hashedPassword = await util.hashPassword(password)
        const data = await db.query(`INSERT INTO enseignant(nom,email,password)VALUES(?,?,?)`, [nom, email, hashedPassword])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec Lors de L'insertion"
            })
        }
        res.status(200).json({
            success: true,
            message: "Insertion Reussie"
        })
    } catch (error) {
        console.error("Inscription error:", error); // Log the error
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

const ConnexionTeacher = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const ExistAccount = await util.ExistStudentByEmail(email);
        if(ExistAccount){
            return res.status(400).json({
                success:false,
                error:"Attention Ce Compte est Un Compte Etudiant"
            })
        }
        const Exist_Teacher = await util.ExistTeacherByEmail(email)
        if (!Exist_Teacher) {
            return res.status(400).json({
                success: false,
                error: "User Not Exist"
            })
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Password"
            })
        }

        const [data] = await db.query(`SELECT * FROM enseignant WHERE email = ?`, [email]);

        if (!data || data.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Student doesn't Exist",
            });
        }
        const pass = await util.verifyPassword(password, data[0].password);

        if (!pass) {
            return res.status(400).json({
                success: false,
                error: "Password Invalid",
            });
        }
        //removed id from token
        const token = jwt.sign({ email: data[0].email, }, process.env.KEY, { expiresIn: '2h' }); // Setting a more reasonable expiration time
        res.status(200).json({
            success: true,
            message: "User Connected",
            role: data[0].role,
            token: token
        });
    } catch (error) {
        console.error("Login error:", error); // Log the error
        return res.status(500).json({
            success: false,
            error: "Server Disconnected",
        });
    }
}


const ListeCourParFiliere = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Filiere Not Found"
            })
        }
        const email = await util.ReturnEmail(req)
        if (!email) {
            return res.status(400).json({
                success: false,
                error: "Not Autorised"
            })
        }
        const ExistTeacher = await util.ExistTeacherByEmail(email)
        const data = await util.getCourAssignToTeacherByFiliere(id, ExistTeacher.id,ExistTeacher.id_departement)
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Cour Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Course Loaded Successfully",
            result: data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const getTypeEvaluation = async (req, res) => {
    try {
        const data = await db.query(`SELECT * FROM type_evaluation`)
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Data Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Data Loaded",
            result: data[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const Get_One_Filiere = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Id Required"
            })
        }
        const email = await util.ReturnEmail(req)
        if (!email) {
            return res.status(400).json({
                success: false,
                error: "Not Autorised"
            })
        }
        const ExistTeacher = await util.ExistTeacherByEmail(email)
        const data = await db.query(`SELECT f.* FROM filiere f where f.id_filiere = ? and f.id_departement = ?`, [id,ExistTeacher.id_departement])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Filiere Not Found"
            })
        }
        res.status(201).json({
            success: true,
            result: data[0],
            message: "Filiere Found Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Loading........"
        })
    }
}

const Get_All_filiere = async (req, res) => {
    try {
        const email = await util.ReturnEmail(req)
        if (!email) {
            return res.status(400).json({
                success: false,
                error: "Not Autorised"
            })
        }
        const ExistTeacher = await util.ExistTeacherByEmail(email)
        const data = await db.query(`SELECT f.* FROM filiere f where f.id_departement = ? `,[ExistTeacher.id_departement])
        if (!data) {
            return res.status(404).json({
                success: false,
                error: "Filiere Loading........."
            })
        }
        res.status(201).json({
            success: true,
            message: "Filiere Loaded Sucessfully",
            result: data[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Loading......."
        })
    }
}

const ListerEtudiantParFiliere = async (req, res) => {
    try {
        const { id } = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Filiere Required"
            })
        }
        const email = await util.ReturnEmail(req)
        if (!email) {
            return res.status(400).json({
                success: false,
                error: "Not Autorised"
            })
        }
        const ExistTeacher = await util.ExistTeacherByEmail(email)
        const data = await db.query(`SELECT e.* from etudiant e inner join filiere f on e.id_filiere = f.id_filiere where f.id_filiere = ? and f.id_departement = ?`, [id,ExistTeacher.id_departement])
        if (!data) {
            return res.statu(400).json({
                success: false,
                error: "Cannot Load Data"
            })
        }
        res.status(200).json({
            success: true,
            message: "Data Loaded Successfully",
            result: data[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Loading......."
        })
    }
}

const AttribuerNote = async (req, res) => {
    try {
        const email = await util.ReturnEmail(req)
        if (!email) {
            return res.status(400).json({
                success: false,
                error: "Non Autorisee"
            })
        }
        const Exist_Teacher = await util.ExistTeacherByEmail(email)
        if (!Exist_Teacher) {
            return res.status(400).json({
                success: false,
                error: "Vous etes pas enseignant"
            })
        }
        const { id } = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Filiere Required"
            })
        }

        const { type, label_cour, note } = req.body
        if (!type || !label_cour || !note) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const ExistTypeEvaluation = await util.getTypeEvaluationParNom(type)
        if (!ExistTypeEvaluation) {
            return res.status(400).json({
                success: false,
                error: "Evaluation Existe Pas"
            })
        }

        const ExistCour = await util.getCourParNom(label_cour)
        if (!ExistCour) {
            return res.status(400).json({
                success: false,
                error: "Course Not Existing"
            })
        }

        const ExistCourse = await util.getCourAssignToTeacherByFiliere(id, Exist_Teacher.code, Exist_Teacher.id_departement)
        if (!ExistCourse) {
            return res.status(400).json({
                success: false,
                error: "Ce Cour Vous etes pas Assigner"
            })
        }

        for (const id_etudiant in note) {
            const ExistEtudiant = await util.getStudentById(id_etudiant)
            if (!ExistEtudiant) {
                return res.status(400).json({
                    success: false,
                    error: "Some Student Do Exist"
                })
            }
            const data = await db.query(`INSERT INTO note(id_filiere,type_evaluation,id_cour,id_etudiant,note)values(?,?,?,?,?)`, [id, ExistTypeEvaluation.id, ExistCour.id_cour, ExistEtudiant.id_etud, note])
            if (!data) {
                return res.status(400).json({
                    success: false,
                    error: "Insertion Refusee"
                })
            }
        }
        res.status(200).json({
            success: true,
            message: "Insertion Reussie"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Loading......."
        })
    }
}

module.exports = {
    InscriptionEnseigant,
    ListeCourParFiliere,
    Get_One_Filiere,
    Get_All_filiere,
    ListerEtudiantParFiliere,
    AttribuerNote,
    ConnexionTeacher,
    getTypeEvaluation
}