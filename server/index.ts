import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";

const port_num = 8000;
const app = express();

//역할
app.use(cors({
    origin: `http://localhost:${port_num}/`, // vite 개발 서버 허용,
    credentials: true
}));

//json 요청 파싱
app.use(express.json());

//웹 서버 시작
app.listen(port_num, ()=> {
    console.log(`
        ############################################
            Kanban Server Listening on port ${port_num}
        ############################################
        `);
});

// 로그인 api
app.post('/auth/login', (req, res) => {
    const { inputId, inputPw } = req.body;
    console.log(req.body);

    var query = `SELECT * FROM users WHERE email = ?;`
    db.query(query, [inputId], (err, rslt) => {
        if(err) {
            console.error('ERROR::LOGIN::SELECT', err);
            return;
        }

        console.log("result :: ", res);
    })
})


// 회원가입 api
app.post('/auth/regist', (req, res) => {
    const { userName, userPw, userEmail } = req.body;
    const userPwHash = bcrypt.hashSync(userPw, 12);
    const query = "INSERT INTO USERS(name, password, email) VALUES(?, ?, ?)";
    db.query(query, [userName, userPwHash, userEmail], (err, rslt) => {
        if(err) {
            console.error('ERROR::REGISTER::INSERT', err);
            res.status(500).json({ success: false, message: 'Database INSERT Error'});
            return;
        }
        console.log(userPw, " / " , userPwHash);
        res.status(200).json({ success: true });
    } )
});

const db = mysql.createConnection( {
    host: 'localhost',
    user: 'eunae',
    password: 'wpfflWpf2!',
    database: 'kanban_db'
});

db.connect((err) => {
    if(err) {
        console.error('ERROR :: MYSQL 연결 오류!', err);
        return;
    } 

    console.log("MYSQL 연결 성공!");
})

//홈 진입 시 
app.get('/', (req, res) => {
    return res.send("메인 화면");
});

//홈 진입 시 
app.get('/regist', (req, res) => {
    return res.send("회원가입 화면");
});


