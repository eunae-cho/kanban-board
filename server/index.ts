import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import  jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../src/types";

// .env
dotenv.config();

// express server settings
const port_num = process.env.EXPRESS_PORT;
const app = express();

//json 요청 파싱
app.use(express.json());

//역할
app.use(cors({
    origin: `http://localhost:${port_num}/`, // vite 개발 서버 허용,
    credentials: true
}));

//웹 서버 시작
app.listen(port_num, ()=> {
    console.log(`
        ############################################
            Kanban Server Listening on port ${port_num}
        ############################################
        `);
});

const SECRET_KEY = getEnv("JWT_SECRET_KEY");
const EXPIRES_IN = getEnv("JWT_EXPIRES_IN") as SignOptions["expiresIn"] ;

//환경변수 가져오기
function getEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing env: ${key}`);
    }

    return value;
}


// 로그인 api
app.post('/auth/login', (req, res) => {
    const { inputId, inputPw } = req.body;

    var query = `SELECT * FROM users WHERE email = ?;`
    db.query(query, [inputId], (err, rslt) => {
        const userData:IUser = {
            idx: rslt[0].idx,
            name: rslt[0].name,
            email: rslt[0].email,
            password: rslt[0].password
        }

        if(err) {
            console.error('ERROR::LOGIN::SELECT', err);
            return;
        }
        else {
            bcrypt.compare(inputPw, rslt[0].password, (err, compareRes) => {
                if(!compareRes) {
                    console.error("password diff!")
                    res.status(500).json({ success: false, message: `LOGIN FAIL - ${userData.name}님 로그인 실패`});
                } else {
                    generateToken(userData)
                    res.status(200).json({ success: true, message: `LOGIN SUCCESS - ${userData.name}님 로그인 성공`});
                }
            })
            
        }
        
    })
})

//JWT 생성 함수
function generateToken(userPayload: IUser):string {
    const token = jwt.sign(
        {
            idx: userPayload.idx,
            name: userPayload.name,
            email: userPayload.email
        },
        SECRET_KEY,
        { expiresIn: EXPIRES_IN }
    );

    console.log(token);
    return token;
}


// 회원가입 api
app.post('/auth/regist', (req, res) => {
    const { userName, userPw, userEmail } = req.body;
    const userPwHash = bcrypt.hashSync(userPw, 12);
    const query = "INSERT INTO USERS(name, password, email) VALUES(?, ?, ?)";
    db.query(query, [userName, userPwHash, userEmail], (err, rslt) => {
        if(err) {
            console.error('ERROR::REGISTER::INSERT', err);
            res.status(500).json({ success: false, message: `DB FAIL - ${userName}님 회원가입 실패`});
            return;
        }
        console.log(userPw, " / " , userPwHash);
        res.status(200).json({ success: true, message: `DB SUCCESS - ${userName}님 회원가입 완료` });
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


