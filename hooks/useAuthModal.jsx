import { create } from "zustand";

const useAuthModal = create((set) => ({
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