interface IButtonProp {
    btnName: string;
    btnDisable?: boolean; 
    handleClick?: () => void;   
}  

const Button = ({ btnName, btnDisable, handleClick }: IButtonProp) => {
    return (
        <button className={`w-[346px] h-[46px] rounded-xl ${btnDisable}? text-gray-20 bg-light-purple-disable : text-common-black bg-light-purple-able `}
            disabled={btnDisable}
            onClick={ handleClick }
            
            >{btnName}</button>
    )
}

export default Button;