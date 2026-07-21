const Rating =({score}) => {
    return(
        <div>
            {
              [...Array(10)].map((_, i)=>
                <span key = {i}>{i<score ? '⭐' : '☆'}</span>
            )}
        </div>
    )
}
export default Rating