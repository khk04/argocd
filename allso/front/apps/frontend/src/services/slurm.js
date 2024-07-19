import axios from 'axios'

export default {
    async nodes(type) {
        try {
            const response = await axios.get(`/slurm/nodes?type=${type}`)
            return response.data

        } catch (e) {
            throw e
        }
    },

    async squeue() {
        try {
            const response = await axios.get('/slurm/squeue')
            return response.data

        } catch (e) {
            throw e
        }
    },

    async runtime() {
        try {
            const response = await axios.get('/slurm/runtime')
            return response.data

        } catch (e) {
            throw e
        }
    },

    async jobHistory(type) {
        try {
            const response = await axios.get(`/slurm/job-history?type=${type}`)
            return response.data

        } catch (e) {
            throw e
        }
    },
}