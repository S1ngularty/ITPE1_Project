import { useState,useEffect } from "react";
import axios from "axios"
import {getToken} from "../utils/authUtil"

function SearchBar(){
const [dataToSearch, setDataToSearch] = useState("")
const [results,setResults] = useState([])

   async function handleSearch(e){
        setDataToSearch(e.target.value)
    }

    async function fetchScrews(){
         axios(`${import.meta.env.VITE_APP_API}api/v1/screw?keyword=${dataToSearch}`,{
        headers:{
            Authorization: `Bearer ${getToken()}`
        }
        }).then(response=>{
            console.log(response.data)
            setResults(response.data)
        }).catch(error=>{
            console.log(error)
        })

    }

    useEffect(()=>{
        fetchScrews()
    },[dataToSearch])

   return (
  <>
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => handleSearch(e)}
        className="search-input"
      />
    </div>
  </>
);

}

export default SearchBar