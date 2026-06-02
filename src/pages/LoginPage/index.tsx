import { useEffect, useState } from "react";
import Button from "@src/components/Button";
import InputText from "@src/components/TextInput";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

    //id&&password 라면, enable=true로 변경해서 버튼 클릭이 가능하게 만들기
    const [disable, setDisable] = useState(true);

    const params = { 
        inputId: id, 
        inputPw: password, 
    };

    const onClickLogin = async() => {
        await axios.post('/api/auth/login', params)
            .then(res => {
                if(res.status==200) {
                    //1. localStorage 로그인 토큰 저장
                    localStorage.setItem("Access Token", res.data.accessToken);
                    localStorage.setItem("Refresh Token", res.data.refreshToken);

                    //2. main 페이지로 이동(로그인 과정이 인증과정이라 따로 인증 필요없음)
                    navigate('/main')
                }
            } 
          )
        .catch(err => {
            console.error(err)
            if(err.status==400) alert('유효한 로그인 정보를 입력해주세요!');
            else if(err.status==500) alert('아이디/비밀번호를 확인해주세요');

            setId('')
            setPassword('')
        });
    }

    useEffect(()=> {
        if(id&&password) 
            setDisable(false);
        else
            setDisable(true);

        console.log(disable);
    }, [id, password])

    return (
        <div className="flex-c w-[723px] h-[512px] bg-white rounded-2xl place-items-center place-content-center">
            <div className="mb-[64px]">
                <InputText inputId="input-id" 
                        inputText="아이디" 
                        holderText="이메일을 입력해 주세요" 
                        value={id} 
                        handleChange={setId}/>
                <InputText inputId="input-pw" 
                        inputText="비밀번호" 
                        holderText="비밀번호를 입력해 주세요" 
                        value={password} 
                        handleChange={setPassword}/>
            </div>

            <div>
                <Button btnDisable={disable} btnName="로그인" handleClick={ ()=> onClickLogin() }/>
                <NavLink to="/regist">
                    <p className="mt-[20px] underline decoration-solid place-self-center">회원가입하기</p>
                </NavLink>
            </div>
        </div>
    );
}

export default LoginPage;