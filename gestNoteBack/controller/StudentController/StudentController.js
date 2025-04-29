const { errorMonitor } = require('nodemailer/lib/xoauth2');
const db = require('../../config/bd')
const util = require('../../utils/utils')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



const ConnexionEtudiant = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const Exist_Student = await util.ExistStudentByEmail(email)
        if (!Exist_Student) {
            return res.status(400).json({
                success: false,
                error: "Student Not Exist"
            })
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Password"
            })
        }
        const hashedPassword = await util.hashPassword(password)
        if (!hashedPassword) {
            return res.status(400).json({
                success: false,
                error: "Loading..........."
            })
        }
        console.log(hashedPassword)
        const PreExist = await db.query(`UPDATE etudiant SET password = ? WHERE id_etud = ?`, [hashedPassword, Exist_Student.id_etud])
        if (!PreExist) {
            return res.status(400).json({
                success: false,
                error: "Loading............"
            })
        }

        const [data] = await db.query(`SELECT * FROM etudiant WHERE email = ?`, [email]);

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

const ListeCourParModule = async (req, res) => {
    try {
        const id = req.params.id
        if(!id){
            return res.status(400).json({
                success:false,
                error:"Id Required"
            })
        }
        const data = await db.query(`SELECT c.label_cour,c.duree,c.credit,m.nom_module from cour c inner join module m on c.id_module = m.id_mod INNER join etudiant e on e.id_filiere = c.id_filiere where m.id_mod = ?`,[id])
        if (!data) {
            return res.status(400).json({
                success: false,
                error: "Loading.........."
            })
        }
        res.status(200).json({
            success: true,
            message: "Loaded Successfully",
            result: data[0]
        })
    } catch (error) {
        console.error("Login error:", error); // Log the error
        return res.status(500).json({
            success: false,
            error: "Server Disconnected",
        });
    }
}

const Notifier = async (req, res) => {
    try {
        const { email, to, obj } = req.body
        if (!email || !to || !obj) {
            return res.status(400).json({
                success: false,
                error: "Fields Required"
            })
        }
        const Exist_Student = await util.ExistStudentByEmail(email)
        if (!Exist_Student) {
            return res.status(400).json({
                success: false,
                error: "Loading............"
            })
        }
        if (email != Exist_Student.email) {
            return res.status(400).json({
                success: false,
                error: "Wrong Email Addresse"
            })
        }
        // Créer un objet transporteur
        const transporter = nodemailer.createTransport({
            service: process.env.PasswordMail,
            port: process.env.portEmail,
            secure: true, // utilise SSL
            auth: {
                user: process.env.AuthMail,
                pass: process.env.Password
            }
        });

        // Configurer l'objet mailOptions
        const mailOptions = {
            from: `${email}`,
            to: `${to}`,
            subject: `Requette: ${obj} `,
            text: 'From nodejs AppV1'
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
        console.error("Login error:", error); // Log the error
        return res.status(500).json({
            success: false,
            error: "Server Disconnected",
        });
    }
}

const ListeModule = async(req,res)=>{
    try {
        const email = await util.ReturnEmail(req)
        if(!email){
            return res.status(400).json({
                success:false,
                error:"Loading........."
            })
        }
        const data = await db.query(`SELECT m.* from module m inner join filiere f on m.id_filiere = f.id_filiere INNER join etudiant e on e.id_filiere = f.id_filiere where e.email = ?`,[email])
        if(!data){
            return res.status(400).json({
                success:false,
                error:"Loading............."
            })
        }
        res.status(200).json({
            success:true,
            message:"Loaded Successfully...",
            result:data[0]
        })
    } catch (error) {
        console.error("Login error:", error); // Log the error
        return res.status(500).json({
            success: false,
            error: "Server Disconnected",
        });
    }
}

const Depot_Requette = async(req,res)=>{
    try {
        const email = await util.ReturnEmail(req)
        const {intit,just} = req.body
        if(!intit||!just){
            return res.status(400).json({
                success:false,
                error:"Fields Required"
            })
        }
        const Exist_Student = await util.ExistStudentByEmail(email)
        if(!Exist_Student){
            return res.status(400).json({
                success:false,
                error:"Loading............."
            })
        }
        const data = await db.query(`INSERT INTO requette(intitule,justification,heure_depot,date_depot,id_etud)Values(?,?,?,?,?)`,[intit,just,new Date().getHours(),new Date().getDate()])
        if(!data){
            return res.status(400).json({
                success:false,
                error:"Validation Refusser"
            })
        }
        res.status(200).json({
            success:true,
            message:"Validation Accepte"
        })
    } catch (error) {
        console.error("Login error:", error); // Log the error
        return res.status(500).json({
            success: false,
            error: "Server Disconnected",
        });
    }
}



module.exports = {
    ConnexionEtudiant,
    Notifier,
    ListeCourParModule,
    ListeModule,
    Depot_Requette
}
