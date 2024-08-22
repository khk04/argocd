import axios from 'axios'

export default {
    async power(type){
        try{
            const response = await axios.get(`/ipmi/power?type=${type}`)        
            return response.data

        }catch (e) { 
            throw e 
        }
    },

    async powerUpdate(host,state){
        try{
            await axios.get(`/ipmi/powerUpdate?host=${host}&state=${state}`)        
        }catch (e) { 
            throw e 
        }
    },

    
}