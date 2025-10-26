import {toast} from "react-toastify"

const notify = (type,message)=>{
    toast[type](message,{
        position:'top-right',
        autoClose:3000,
        closeOnClick:true,
        pauseOnHover:false,
        draggable:true,
        theme:"colored",
    })
}


export default notify