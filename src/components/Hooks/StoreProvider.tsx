import { createContext, useContext, useMemo } from "react";
import { Store } from "../../stores";

const StoreContext = createContext<Store | undefined>(undefined)

export function useStore(): Store {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider')
  }

  return context
}

interface IStoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: IStoreProviderProps) {
  const store = useMemo(() => new Store(), [])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}