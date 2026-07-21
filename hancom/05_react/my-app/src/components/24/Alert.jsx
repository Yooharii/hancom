const Alert = ({type, text}) =>{
    const map = { 
        success : {icon:'🍀', color: 'green'},
        error : {icon:'❌', color: 'red'},
        warning : {icon:'❕', color: 'yellow'},
        hint : {icon:'⭐', color : 'black'}
    }
    const cfg = map[type]
    return <p style={{color:cfg.color}}>{cfg.icon} {text}</p>
}

export default Alert