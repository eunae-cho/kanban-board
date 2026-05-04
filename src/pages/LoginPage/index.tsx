import { useEffect, useState } from "react";
import Button from "@src/components/Button";
import InputText from "@src/components/TextInput";
import { NavLink } from "react-router-dom";
import axios from "axios";

function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    
    //id&&password 라면, enable=true로 변경해서 버튼 클릭이 가능하게 만들기
    const [disable, setDisable] = useState(true);


    const params = { 
        inputId: id, 
        inputPw: password, 
    };

    const onClickLogin = async() => {
        console.log(id, password);

        await axios.post('/api/auth/login', params)
        .then(res => console.log('front:', res.data))
        .catch(err => console.error(err));
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