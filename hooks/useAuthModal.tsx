import { create } from "zustand";

interface AuthModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
    isOpen: false,
    onOpen: () => {
        console.log('Opening modal from store');
        set({ isOpen: true });
    },
    onClose: () => {
        console.log('Closing modal from store');
        set({ isOpen: false });
    },
}));

export default useAuthModal;