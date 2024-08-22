import axios from 'axios'

export default {
    async line() {
        try {
            const response = await axios.get('/ganglia/line')
            return response.data

        } catch (e) {
            throw e
        }
    },

    async bar() {
        try {
            let response = await axios.get('/ganglia/bar')
            return response.data[0]
        } catch (error) {
            throw e
        }
    },
}