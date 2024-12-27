import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
    isOpen: boolean;
    onChange: (open: boolean) => void;
    title: string;
    description: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onChange,
    title,
    description,
    children
}) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className="fixed inset-0 bg-neutral-900/90 backdrop-blur-sm"
                />
                <Dialog.Content
                    className="
                        fixed
                        drop-shadow-md
                        border
                        border-neutral-700
                        top-[50%]
                        left-[50%]
                        max-h-full
                        h-full
                        md: h-auto
                        md:max-h-[85vh]
                        w-full
                        md:w-[90vw]
                        md:max-w-[450px]
                        translate-x-[-50%]
                        translate-y-[-50%]
                        rounded-md
                        bg-neutral-100
                        p-[25px]
                        focus:outline-none
                    "
                >
                    <Dialog.Title
                        className="text-xl font-bold text-center mb-4"
                    >
                        {title}
                    </Dialog.Title>
                    <Dialog.Description
                        className="text-sm text-center leading-normal mb-5"
                    >
                        {description}
                    </Dialog.Description>
                    <div>{children}</div>
                    <Dialog.Close asChild>
                        <button
                            className="absolute top-[10px] right-[10px] 
                                text-neutral-900 hover:text-neutral-500 
                                h-[25px] w-[25px] rounded-full 
                                flex items-center justify-center 
                                focus:outline-none"
                        >
                            <IoMdClose />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;
