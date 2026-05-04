interface IButtonProp {
    btnName: string;
    btnDisable?: boolean; 
    handleClick?: () => void;   
}  

const Button = ({ btnName, btnDisable, handleClick }: IButtonProp) => {
    return (
        <button className="w-[346px] h-[46px] bg-light-purple-100 rounded-xl text-light-purple-disable" 
            disabled={btnDisable}
            onClick={ handleClick }
            
            >{btnName}</button>
    )
}

export default Button;