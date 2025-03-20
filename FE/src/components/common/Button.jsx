const Button = ({ text, onClick, type = "button" }) => (
    <button onClick={onClick} type={type}>
        {text}
    </button>
);

export default Button;
