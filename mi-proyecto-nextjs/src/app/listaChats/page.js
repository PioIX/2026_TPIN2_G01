import { useState } from "react"

export default function listaChatsPage(){
    const [chats,setChats]=useState([])
    const [usuario,setUsuaro] = useState("")
    fetch(`http://localhost:4000/listachats?usuario=${usuario.id_usuario}`)
    .then(response => response.json())
    .then(data => {console.log(data);
    setChats(data)}
);
    return(
        <>
        
        </>

    )

}