import express from "express";
import cors from "cors";
import mysql, {ResultSetHeader} from "mysql2";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import  jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../src/types";
import { useReducer } from "react";

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

const REFRESH_KEY = getEnv("REFRESH_TOKEN");
const REFRESH_IN = getEnv("REFRESH_EXPIRES_IN") as SignOptions["expiresIn"];

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
        
        // 1. 로그인 아이디가 없는 경우
        if(!rslt[0]) {              
            console.error('결과 없음');
            res.status(400).json({ success: false, message: `LOGIN FAIL - 로그인 정보가 없습니다`});
            return;
        }

        // 2. 로그인 아이디가 있는 경우
        const userData:IUser = {
            idx: rslt[0].idx,
            name: rslt[0].name,
            email: rslt[0].email,
            password: rslt[0].password
        }

        // 2-1. 로그인 비밀번호 비교
        bcrypt.compare(inputPw, rslt[0].password, async (err, compareRes) => {
            if(!compareRes) {
                console.error("비밀번호 동일하지 않음")
                res.status(500).json({ success: false, message: `LOGIN FAIL - ${userData.name}님 로그인 실패`});
            } else {
                const accessToken = generateAccessToken(userData)
                const refreshToken = generateRefreshToken(userData)

                const isSaveToken = await saveRefreshToken(refreshToken, userData.idx);
                
                if(isSaveToken) {
                    res.status(200).json({ success: true, message: `LOGIN SUCCESS - ${userData.name}님 로그인 성공`, accessToken: accessToken, refreshToken: refreshToken});
                }
            }
        })
    })
})

//JWT 생성 함수
function generateAccessToken(userPayload: IUser):string {
    const token = jwt.sign(
        {
            idx: userPayload.idx,
            name: userPayload.name,
            email: userPayload.email
        },
        SECRET_KEY,
        { expiresIn: EXPIRES_IN }
    );

    return token;
}

function generateRefreshToken(userPayload: IUser):string {
    const token = jwt.sign(
        {
            idx: userPayload.idx,
            name: userPayload.name,
            email: userPayload.email
        },
        REFRESH_KEY,
        { expiresIn: REFRESH_IN }
    );

    return token;
}

function saveRefreshToken(token: string, idx: number): Promise<boolean> {    
        return new Promise((resolve, reject) => {
            var query = "UPDATE users SET refresh_token = (?) where idx = (?)"
            db.query(query, [token, idx], (err, rslt:ResultSetHeader) => {
                if(err) {
                    console.error("SaveRefreshToken 에러 발생 : ", err);
                    reject(err);
                } else if(rslt.affectedRows>0) {
                    resolve(rslt.affectedRows>0);
                }
            });
        });
}


// 회원가입 api
app.post('/auth/regist', (req, res) => {
    const { userName, userPw, userEmail } = req.body;

    const checkId = "SELECT * FROM users WHERE email = (?)";
    db.query(checkId, [userEmail], (err, rslt)=> {
        console.log(rslt[0]);
        
        if(rslt[0])     //아이디가 존재하는 경우
        {
            console.error('INAVAILABLE ID');
            res.status(501).json({success: false, message: `중복된 아이디 ${userEmail} 입니다`});
            return;
        }
        else {      //존재하지 않는 경우
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
        }
    })

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