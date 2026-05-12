import Button from "@src/components/Button";
import InputText from "@src/components/TextInput";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function RegistPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const params = { 
        userName: name, 
        userPw: password, 
        userEmail: email
    };

    const onClickRegist = async() => {
        await axios.post('/api/auth/regist', params)
        .then(res => {
                if(res.status==200) navigate('/')
            } 
          )
        .catch(err => console.error(err));
    }

    return (
        <div className="flex-c w-[723px] h-[512px] bg-white rounded-2xl place-items-center place-content-center">
            <div className="mb-[64px]">
                <InputText inputId="input-name" inputText="이름" holderText="이름을 입력해 주세요" 
                            value={name} handleChange={ setName } />
                <InputText inputId="input-email" inputText="이메일" holderText="이메일을 입력해 주세요" 
                            value={email} handleChange={ setEmail } />
                <InputText inputId="input-password" inputText="비밀번호" holderText="비밀번호를 입력해 주세요" 
                            value={password} handleChange={ setPassword } />
            </div>

            <div>
                <Button btnName="계정 만들기" handleClick={()=>onClickRegist()}/>
              
            </div>
        </div>
    )
}

export default RegistPage; 