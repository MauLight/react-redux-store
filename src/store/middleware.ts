import { Middleware } from 'redux'
import axios from 'axios'

const url = import.meta.env.VITE_BACKEND_URL
const clientId = import.meta.env.VITE_CLIENT_ID

const errorReportingMiddleware: Middleware = store => next => (action: any) => {
    const result = next(action)

    // Check if the action indicates an error
    if (action.type.endsWith('rejected')) {
        const state = store.getState()
        const error = action.error
        const errorDetails = {
            clientId,
            message: error.message,
            stack: error.stack,
            actionType: action.type,
            state,
        }

        console.log(errorDetails, 'these are the details.')

        // Send error details to the error reporting service
        axios.post(`${url}/errorReport`, errorDetails)
            .then(response => {
                console.log('Error reported successfully:', response.data)
            })
            .catch(err => {
                console.error('Error reporting failed:', err)
            })
    }

    return result
}

export default errorReportingMiddleware