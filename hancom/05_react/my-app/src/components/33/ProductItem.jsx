import {useState} from 'react'

const ProductItem = ({ name }) => {
    const [count, setCount] = useState(0)
    return(
        <div>
            <div style ={{
                backgroundColor:'black',
                color:'white',
            }}className="product">
                <h3>{name}</h3>
                <p>{count}개 닫음</p>
             </div>
            <button style={{
                borderColor:'black',
                backgroundColor :'red',
                color:'white',
                borderRadius:'16px',
                padding :'8px',
                fontSize:'18px',
                fontWeight:'bold'
            }} onClick={()=>setCount(c =>c+1)}>
            Product 담기</button>
           
        </div>
    )
}
export default ProductItem