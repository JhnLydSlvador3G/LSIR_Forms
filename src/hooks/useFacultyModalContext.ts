import { createContext, useContext } from "react";

// 1️⃣ Define the context type
type FacultyRosterModalContextType = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
};

// 2️⃣ Create the context
export const FacultyRosterModalContext = createContext<FacultyRosterModalContextType | undefined>(undefined);

// 5️⃣ Custom hook to consume context
export const useFacultyRosterModal = () => {
    const context = useContext(FacultyRosterModalContext);
    if (!context) {
        throw new Error(
            "useFacultyRosterModal must be used within a FacultyRosterModalProvider"
        );
    }
    return context;
};