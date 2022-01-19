import { createContext, useState, useEffect } from "react";
import { loadFactoryContract } from '../utils/factory'

export const FactoryContext = createContext()

const FactoryContextProvider = ({ children }) => {
    const [factory, setFactory] = useState(undefined)

    useEffect(() => {
      getFactoryContract()
    }, [])
  
    const getFactoryContract = async () => {
      const contract = await loadFactoryContract()
      setFactory(contract)
    }

    return (
        <FactoryContext.Provider value={factory}>
            {children}
        </FactoryContext.Provider>
    )
}

export default FactoryContextProvider