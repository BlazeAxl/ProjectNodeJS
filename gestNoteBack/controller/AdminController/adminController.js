const db = require('../../config/bd')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const util = require('../../utils/utils')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pwd = util.generateValidPassword()

//Enregistrer Une filiere
const Ajout_filiere = async (req, res) => {
    try {
        const { nom_fil, nom_depart } = req.body
        if (!nom_fil || !nom_depart) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const GetFiliere = await util.GetOneFiliere(nom_fil);
        if (GetFiliere) {
            return res.status(400).json({
                success: false,
                error: "Filiere Already Exist"
            })
        }
        const ExistDepartment = await util.getDepartment(nom_depart)
        if (!ExistDepartment) {
            return res.status(400).json({
                success: false,
                error: "Departement Not Exist"
            })
        }
        const data = await db.query(`INSERT INTO filiere(nom_fil,id_departement) VALUES(?,?)`, [nom_fil, ExistDepartment.id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec De Creation"
            })
        }
        res.status(200).json({
            success: true,
            message: "Insertion Reussie"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Loading............."
        })
    }
}

const AddDepartement = async (req, res) => {
    try {
        const { nom } = req.body
        if (!nom) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const Exist_Depart = await util.getDepartment(nom)
        if (Exist_Depart) {
            return res.status(400).json({
                success: false,
                error: "Department Exist Already"
            })
        }
        const data = await db.query(`INSERT INTO departement(nom)values(?)`, [nom])
        if (!data) {
            return res.status(400).json({
                success: true,
                error: "Echec Lors De l'enregistrement"
            })
        }
        res.status(200).json({
            success: true,
            message: "Departement Creer Avec Success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const Modif_Department = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Departement Required"
            })
        }
        const { nom } = req.body
        if (!nom) {
            return res.status(400).json({
                success: false,
                error: "Field Required"
            })
        }
        const data = await db.query(`UPDATE departement SET nom = ? WHERE id = ?`, [nom, id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec de Mise A Jour"
            })
        }
        res.status(200).json({
            success: true,
            message: "Mise A Jour Reussie"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const CreateTypeEvaluation = async (req, res) => {
    try {
        const { type } = req.body
        if (!type) {
            return res.status(400).json({
                success: false,
                error: 'Field Required'
            })
        }
        const ExistTypeEvaluation = await util.getTypeEvaluationParNom(type)
        if(ExistTypeEvaluation){
            return res.status(400).json({
                success:false,
                error:"Already Exist"
            })
        }
        const data = await db.query(`INSERT INTO type_evaluation(type)VALUES(?)`, [type])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec Lors De L'Insertion"
            })
        }
        res.status(200).json({
            success: true,
            message: "Creer Avec Success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const ListFiliereParDepartement = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Departement Not Found"
            })
        }
        const data = await util.getFiliereParDepartemnt(id)
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Filiere Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Filiere Found",
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

const NombreFiliereParDepartement = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Departement Not Found"
            })
        }
        const data = await util.getNombreFilierParDepartement(id)
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Filiere Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Filiere Found",
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

const DeleteDepartement = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Departement Not Found :("
            })
        }
        const data = await db.query(`DELETE FROM departement WHERE id = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec De Suppression"
            })
        }
        res.status(200).json({
            success: true,
            message: "Suppresion Reussie"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const getOneDepartement = async (req, res) => {
    try {
        const { id } = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Departement Not Found"
            })
        }
        const data = await util.getDepartmentById(id)
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Departement Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Departemnt Trouve",
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

const getAllDepartement = async (req, res) => {
    try {
        const data = await util.getAllDepartment()
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Departements Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Departement Trouve",
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

//Modification Filiere
const Modif_Filiere = async (req, res) => {
    try {
        const id = req.params.id
        const { nom_fil } = req.body
        if (!id || !nom_fil) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const data = await db.query(`UPDATE filiere SET nom_fil = ? WHERE id_filiere = ?`, [nom_fil, id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Mise A Jour Impossible"
            })
        }
        res.status(200).json({
            success: true,
            message: "Filiere Mise A Jour"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Loading........"
        })
    }
}

//Lister Une Filiere

const Get_One_Filiere = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Id Required"
            })
        }
        const data = await db.query(`SELECT * FROM filiere where id_filiere = ? `, [id])
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

// Get All Filiere

const Get_All_filiere = async (req, res) => {
    try {
        const data = await db.query(`SELECT * FROM filiere`)
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

//Login de l'admin
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Incomplete Fields"
            });
        }
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // Exemple : au moins 8 caractères, une majuscule, une minuscule et un chiffre
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                error:
                    "Invalid Password",
            });
        }
        const [data] = await db.query(`SELECT * FROM admin WHERE email = ?`, [email]);

        if (!data || data.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Admin doesn't Exist",
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
};

const DeleteFiliere = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Id Required"
            })
        }
        const data = await db.query(`DELETE FROM filiere where id = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Filiere Cannot be Deleted"
            })
        }
        res.status(200).json({
            success: true,
            message: "Filiere Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading ................"
        })
    }
}

///CLASSES  
const CreateClass = async (req, res) => {
    try {
        const { label_class } = req.body
        if (!label_class) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const ExistClass = await util.ExistClass(label_class)
        if (ExistClass) {
            return res.status(400).json({
                success: false,
                error: 'Class Exist Already'
            })
        }
        const data = await db.query(`INSERT INTO classe(label_class)VALUES(?)`, [label_class])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Insertion Not FulFilled"
            })
        }
        res.status(201).json({
            success: true,
            message: "Insertion FulFilled SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading............."
        })
    }
}
const Delete_Class = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Id Required"
            })
        }
        const data = await db.query(`DELETE FROM classe WHERE id_classe = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Classroom Cannot Be Deleted"
            })
        }
        res.status(200).json({
            success: true,
            message: "Classroom Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading .................."
        })
    }
}
//ETUDIANT 
const CreateEtudiant = async (req, res) => {
    try {
        const { Mat, nom, prenom, sexe, date_naiss, email, tel, email_p, nom_filiere, level, nom_salle } = req.body
        if (!Mat || !nom || !prenom || !sexe || !date_naiss || !email || !tel || !email_p || !nom_filiere || !level || !nom_salle) {
            return res.status(400).json({
                success: false,
                error: "All Fileds Required"
            })
        }
        const ExistClass = await util.ExistClass(nom_salle)
        if (!ExistClass) {
            return res.status(400).json({
                success: false,
                error: "Classe Cannot be Loaded"
            })
        }
        const Exist_FIliere = await util.GetOneFiliere(nom_filiere)
        if (!Exist_FIliere) {
            return res.status(400).json({
                success: false,
                error: "Fliere Cannot be Loaded"
            })
        }
        const ExistStudent = await util.ExistStudent(Mat, email)
        if (ExistStudent) {
            return res.status(400).json({
                success: false,
                error: "Student Exist Already"
            })
        }
        const data = await db.query(`INSERT INTO etudiant(matricule,nom,prenom,sexe,date_naiss,email,tel,email_parent,id_filiere,niveau,id_classe)VALUES(?,?,?,?,?,?,?,?,?,?,?)`, [Mat, nom, prenom, sexe, date_naiss, email, tel, email_p, Exist_FIliere.id_filiere, level, ExistClass.id_classe])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Student Cannot Be Created"
            })
        }
        res.status(200).json({
            success: true,
            message: "Student Created Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading ..............."
        })
    }
}


const DeleteEtudiant = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Student Inexistente"
            })
        }
        const ExisteStudent = await util.getStudentById(id)
        if (!ExisteStudent) {
            return res.status(400).json({
                success: false,
                error: "Etudiant Existe Pas"
            })
        }
        const data = await db.query(`DELETE FROM etudiant where id_etud = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Cannot be Deleted"
            })
        }
        res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const CreateModule = async (req, res) => {
    try {
        const { nom_mod, coef_mod, nom_filiere } = req.body
        if (!nom_mod || !coef_mod || !nom_filiere) {
            return res.status(400).json({
                success: false,
                error: "Fileds Required"
            })
        }
        const getMod = await util.getModule(nom_mod)
        if (getMod) {
            return res.status(400).json({
                success: false,
                error: "Module Exist"
            })
        }
        const GetFiliere = await util.GetOneFiliere(nom_filiere);
        if (!GetFiliere) {
            return res.status(400).json({
                success: false,
                error: "Filiere Does Not Exist"
            })
        }
        const data = await db.query(`INSERT INTO module(nom_module,coef_module,id_filiere)VALUES(?,?,?)`, [nom_mod, coef_mod, GetFiliere.id_filiere])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec Lors De L'enregistrement"
            })
        }
        res.status(200).json({
            success: true,
            message: "Module Creer Avec Success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const getAllModuleParFiliere = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const data = await db.query(`SELECT m.* from module m inner join filiere f on m.id_filiere = f.id_filiere where f.id_filiere = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Data Not Found :("
            })
        }
        res.status(200).json({
            success: true,
            message: "Data Loaded",
            reuslt: data[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const getOneModule = async (req, res) => {
    try {
        const { id } = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Module Required"
            })
        }
        const data = await db.query(`SELECT * FROM module where id_mod = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Data Not Found"
            })
        }
        res.status(200).json({
            success: true,
            result: data[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const DeleteModule = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Module Inexistente"
            })
        }
        const data = await db.query(`DELETE FROM module where id_mod = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Cannot be Deleted"
            })
        }
        res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const affecterCour = async (req, res) => {
    try {
        const { nom_E, nom_C,nom_fil,nom_mod } = req.body
        if (!nom_E||! nom_C) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const ExistCour = await util.ExistCourse(nom_C)
        if (!ExistCour) {
            return res.status(400).json({
                success: false,
                error: "Course Inexistante"
            })
        }
        const ExistModule = await util.getModule(nom_mod)
        if(!ExistModule){
            return res.status(400).json({
                success:false,
                error:"Filiere Exist Pas"
            })
        }
        const ExistFiliere = await util.GetOneFiliere(nom_fil)
        if(!ExistFiliere){
            return res.status(400).json({
                success:false,
                error:"Filiere Exist Pas"
            })
        }
        const ExistTeacher = await util.ExistTeacher(nom_E)
        if (!ExistTeacher) {
            return res.status(400).json({
                success: false,
                error: "Teacher Inexistent"
            })
        }
        const data = await db.query(`INSERT INTO assignation(id_cour,id_enseignant,id_fil,id_mod,date)values(?,?,?)`, [ExistCour.id_cour, ExistTeacher.code,ExistFiliere.id_filiere,ExistModule.id_mod,new Date().toLocaleString()])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Insertion Refuser"
            })
        }
        res.status(200).json({
            success: true,
            message: "Course Assign Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const de_affecter = async (req, res) => {
    try {
        const { nom_E, nom_C,nom_fil,nom_mod } = req.body
        if (nom_E, nom_C) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const ExistCour = await util.ExistCourse(nom_C)
        if (!ExistCour) {
            return res.status(400).json({
                success: false,
                error: "Course Inexistante"
            })
        }
        const ExistModule = await util.getModule(nom_mod)
        if(!ExistModule){
            return res.status(400).json({
                success:false,
                error:"Filiere Exist Pas"
            })
        }
        const ExistFiliere = await util.GetOneFiliere(nom_fil)
        if(!ExistFiliere){
            return res.status(400).json({
                success:false,
                error:"Filiere Exist Pas"
            })
        }
        const ExistTeacher = await util.ExistTeacher(nom_E)
        if (!ExistTeacher) {
            return res.status(400).json({
                success: false,
                error: "Teacher Inexistent"
            })
        }
        const data = await db.query(`UPDATE assignation SET id_cour = ?,id_enseignant = ?,id_fil = ?,id_mod = ?,date = ?`, [ExistCour.id_cour, ExistTeacher.id_code,ExistFiliere.id_filiere,ExistModule.id_mod,new Date().toLocaleString()])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Insertion Refuser"
            })
        }
        res.status(200).json({
            success: true,
            message: "Course Assign Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const SupAssgnation = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Assignation Inexistant"
            })
        }
        const data = await db.query(`DELETE FROM assignation where id_assign = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Assignation Cannot be Deleted"
            })
        }
        res.status(200).json({
            success: true,
            message: "Deleted Successfuly"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const Creer_Course = async (req, res) => {
    try {
        const { label_cour, duree, credit, nom_mod, nom_fil } = req.body
        if (!label_cour || !duree || !credit || !nom_mod || !nom_fil) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        if (duree < 0) {
            return res.status(400).json({
                success: false,
                error: "Duree AtLeast 1h"
            })
        }
        const ExistModule = await util.getModule(nom_mod)
        if (!ExistModule) {
            return res.status(400).json({
                success: false,
                error: "Module Inexistante"
            })
        }
        const ExistFiliere = await util.GetOneFiliere(nom_fil)
        if (!ExistFiliere) {
            return res.status(400).json({
                success: false,
                error: "Filiere Inexistante"
            })
        }
        const ExistCourse = await util.ExistCourse(label_cour)
        if (ExistCourse) {
            return res.status(400).json({
                success: false,
                error: "Course Existe Already"
            })
        }
        const nombreC_C = await util.getSumCreditCourParModule(ExistModule.id_mod)
        if (ExistModule.coef_module < nombreC_C) {
            return res.status(400).json({
                success: false,
                error: "Quota De Coefficient Du Module deja Attient"
            })
        }
        if (ExistModule.coef_module <= credit) {
            return res.status(400).json({
                success: false,
                error: "Nombre Credit Du Cour N'est Egale ou Superieur au Coefficient Du Module"
            })
        }
        const data = await db.query(`INSERT INTO cour(label_cour,duree,credit,id_module,id_filiere)VALUES(?,?,?,?,?)`, [label_cour, duree, credit, ExistModule.id_mod, ExistFiliere.id_filiere])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Insertion Refuser"
            })
        }
        res.status(400).json({
            success: true,
            message: "Insertion Reussir"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const ModifierCourse = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Id Required"
            })
        }
        const { label_cour, duree, credit, nom_mod, nom_fil } = req.body
        if (!label_cour || !duree || !credit || !nom_mod, nom_fil) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        if (duree < 0) {
            return res.status(400).json({
                success: false,
                error: "Duree AtLeast 1h"
            })
        }
        const ExistModule = await util.getModule(nom_mod)
        if (!ExistModule) {
            return res.status(400).json({
                success: false,
                error: "Module Inexistante"
            })
        }
        const ExistFiliere = await util.GetOneFiliere(nom_fil)
        if (!ExistFiliere) {
            return res.status(400).json({
                success: false,
                error: "Filiere Inexistante"
            })
        }
        const ExistCourse = await util.ExistCourse(label_cour)
        if (ExistCourse) {
            return res.status(400).json({
                success: false,
                error: "Course Existe Already"
            })
        }
        const data = await db.query(`UPDATE cour SET label_cour = ?,duree = ?, credit = ?, id_module = ?,id_filiere = ?`, [label_cour, duree, credit, ExistModule.id_mod, ExistFiliere.id_filiere])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Mise A jour Refuser"
            })
        }
        res.status(400).json({
            success: true,
            message: "Mise A Jour Reussir"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const EnvoiMail = async (req, res) => {
    try {
        const { id } = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Student Required"
            })
        }
        const ExistStudent = await util.getStudentById(id)
        if (!ExistStudent) {
            return res.status(400).json({
                success: false,
                error: "Student Inexistent"
            })
        }
        // Créer un objet transporteur
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false, // utilise SSL
            auth: {
                user: 'yvanmelchior37@gmail.com',
                pass: 'wwav jipq ojmn wyaw'
            }
        });

        // Configurer l'objet mailOptions
        const mailOptions = {
            from: 'yvanmelchior37@gmail.com',
            to: `${ExistStudent.email}`,
            subject: `Votre Mot de Passe est:${pwd}`,
            text: 'Votre Mot de Passe est Confidentiel'
        };

        // Envoyer l'email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Erreur : ' + error);
                res.status(400).json({
                    success: false,
                    error: "Loading.........."
                })
            } else {
                console.log('Email envoyé : ' + info.response);
                res.status(200).json({
                    success: true,
                    message: "Recu Avec Sucess"
                })
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const AffecterEnseignantDepartement = async (req, res) => {
    try {
        const  id  = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Enseignant Introuvable"
            })
        }
        const { nom_depart, type } = req.body
        if (!nom_depart) {
            return res.status(400).json({
                success: false,
                error: "Field Required"
            })
        }
        const ExistDepartment = await util.getDepartment(nom_depart)
        if (!ExistDepartment) {
            return res.status(400).json({
                success: false,
                error: "Department Not Found"
            })
        }
        const data = await db.query(`UPDATE enseignant SET id_departement = ? , type = ? WHERE code = ?`, [ExistDepartment[0].id, type, id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Cannot Be Affected"
            })
        }
        res.status(200).json({
            success: true,
            message: "Affecter Avec success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Loading........."
        })
    }
}

const CreateEvaluation = async (req, res) => {
    try {
        const { type, date, nom_cour, nom_fil } = req.body
        if (!type || !date || !nom_cour || !nom_fil) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const ExistEvaluation = await util.getTypeEvaluationParNom(type)
        if (!ExistEvaluation) {
            return res.status(400).json({
                success: false,
                error: "Cour Existe Pas"
            })
        }
        const ExistCourse = await util.ExistCourse(nom_cour)
        if (!ExistCourse) {
            return res.status(400).json({
                success: false,
                error: "Cour Existe Pas"
            })
        }
        const ExistFiliere = await util.GetOneFiliere(nom_fil)
        if (!ExistFiliere) {
            return res.status(400).json({
                success: false,
                error: "Filiere Existe Pas"
            })
        }
        const data = await db.query(`INSERT INTO evaluation(id_type,date,id_cour,id_filiere)VALUES(?,?,?,?)`, [ExistEvaluation.id, date, ExistCourse.id_cour, ExistFiliere.id_filiere])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec D'enregistrement"
            })
        }
        res.status(200).json({
            success: true,
            message: "Insertion Reussie"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const updateEvaluation = async (req, res) => {
    try {
        const { id } = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Evaluation Required"
            })
        }
        const { type, date, nom_cour, nom_fil } = req.body
        if (!type || !date || !nom_cour || !nom_fil) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const ExistEvaluation = await util.getTypeEvaluationParNom(type)
        if (!ExistEvaluation) {
            return res.status(400).json({
                success: false,
                error: "Cour Existe Pas"
            })
        }
        const ExistCourse = await util.ExistCourse(nom_cour)
        if (!ExistCourse) {
            return res.status(400).json({
                success: false,
                error: "Cour Existe Pas"
            })
        }
        const ExistFiliere = await util.GetOneFiliere(nom_fil)
        if (!ExistFiliere) {
            return res.status(400).json({
                success: false,
                error: "Filiere Existe Pas"
            })
        }
        const data = await db.query(`UPDATE evaluation SET id_type = ?,date = ?,id_cour = ?,id_filiere = ? WHERE id_eva = ?`, [ExistEvaluation.id, date, ExistCourse.id_cour, ExistFiliere.id_filiere, id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec D'enregistrement"
            })
        }
        res.status(200).json({
            success: true,
            message: "Insertion Reussie"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const AnnulerEvaluation = async (req, res) => {
    try {
        const { id } = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Evalation Requise"
            })
        }
        const data = await db.query(`DELETE FROM evaluation where id_eva = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec De Suppression"
            })
        }
        res.status(200).json({
            success: true,
            message: "Suppression Avec Success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}
//REQUETTE ETUDIANT
const TraiterRequette = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Field Required"
            })
        }
        const data = await db.query(`UPDATE requette SET statut = "Accepte" WHERE id_req = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec De Traitement"
            })
        }
        res.status(200).json({
            success: true,
            message: "Traite Avec Success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const RefuserRequette = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Field Required"
            })
        }
        const data = await db.query(`UPDATE requette SET statut = "Refuse" WHERE id_req = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Echec De Traitement"
            })
        }
        res.status(200).json({
            success: true,
            message: "Traite Avec Success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

const GetAllRequette = async (req, res) => {
    try {
        const data = await db.query(`SELECT * FROM requette`)
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Loading....."
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

const GetOneRequette = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Required Requette"
            })
        }
        const data = await db.query(`SELECT * FROM requette WHERE id_req = ?`, [id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Loading....."
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

const genererPdfEvaluation = async (req, res) => {
    try {
        const {type,fil} = req.body
        if(!type||!fil){
            return res.status(400).json({
                success:false,
                error:"Fields Required"
            })
        }
        const ExistFiliere = await util.GetOneFiliere(fil)
        if(!ExistFiliere){
            return res.status(400).json({
                success:false,
                error:"Filiere Inexistant"
            })
        }
        const ExistTypeEvaluation = await util.getTypeEvaluationParNom(type)
        if(!ExistTypeEvaluation){
            return res.status(400).json({
                success:false,
                error:"Type Evaluation Existe Pas"
            })
        }
        const [rows] = await db.query('SELECT * FROM departement LIMIT 100');
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream('rapport.pdf'));
        doc.fontSize(20).text('PV EVALUATION ', { align: 'center' });
        doc.moveDown();
        const table = {
          headers: Object.keys(rows[0] || {}),
          rows: rows.map(row => Object.values(row))
        };
    
        // Dessiner le tableau
        util.drawTable(doc, table);
    
        // Pied de page
        doc.fontSize(10).text(`Généré le ${new Date().toLocaleString()}`, { align: 'right' });
    
        doc.end();
        console.log('PDF généré avec succès!');
        res.status(200).json({
            success:true,
            message:"PV Creer Avec Success"
        })
      } catch (error) {
        console.error('Erreur:', error);
      }
}

const CalculNoteParFiliere = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}




module.exports = {
    login,
    Ajout_filiere,
    Get_All_filiere,
    Get_One_Filiere,
    Modif_Filiere,
    DeleteFiliere,
    CreateClass,
    Delete_Class,
    CreateEtudiant,
    CreateModule,
    affecterCour,
    de_affecter,
    SupAssgnation,
    DeleteEtudiant,
    DeleteModule,
    Creer_Course,
    ModifierCourse,
    EnvoiMail,
    getAllDepartement,
    getOneDepartement,
    AddDepartement,
    Modif_Department,
    DeleteDepartement,
    ListFiliereParDepartement,
    NombreFiliereParDepartement,
    AffecterEnseignantDepartement,
    getAllModuleParFiliere,
    getOneModule,
    CreateTypeEvaluation,
    CreateEvaluation,
    AnnulerEvaluation,
    updateEvaluation,
    TraiterRequette,
    RefuserRequette,
    GetAllRequette,
    GetOneRequette,
    genererPdfEvaluation
}