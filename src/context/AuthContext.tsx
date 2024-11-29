import { createContext, ProviderProps, useContext, useState } from "react"

interface UserProps {
    token: string
    username: string
    id: string
}


export const AuthContext = createContext({})

export const AuthContextProvider = (props: ProviderProps<unknown>) => {

    const [auth, setAuth] = useState<UserProps | null>(() => JSON.parse(localStorage.getItem('symetria-user') || ''))

    const value = [auth, setAuth]

    return <AuthContext.Provider {...props} value={value} />
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider.')

    return context
}