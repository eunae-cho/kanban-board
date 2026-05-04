type InputTextProps = {
    inputId: string;
    inputText: string;
    holderText: string;
    value: string;
    handleChange: (str:string)=> void;
};

const InputText = ({inputId, inputText, holderText, value, handleChange }: InputTextProps) => {
    return (
        <div className="w-[346px] mb-[16px]">
            <section className="mb-[6px]">
                <div className="inline">{inputText}</div>
                <div className="inline m-[2px] text-common-red">*</div>
            </section>
            <input type="text" 
                    id={inputId}
                    className="pl-3 block w-[346px] h-[46px] bg-gray-20 rounded-xl 
                    placeholder:text-[12px] placeholder:text-gray-300"
                    placeholder={holderText}
                    value={value}
                    onChange={ (e)=>handleChange(e.target.value) }
            />
        </div>
    );
};

export default InputText;