import axios from 'axios'

export default {
    async list() {
        try {
            const response = await axios.get(`/out`)
            console.log(response.data)
            return response.data
        } catch (e) {
            throw e
        }
    },

    async read(dir, name) {
        try {
            const response = await axios.get(`/out/read?dir=${dir}&file=${name}`)

            return response.data
        } catch (e) {
            throw e
        }
    },

}