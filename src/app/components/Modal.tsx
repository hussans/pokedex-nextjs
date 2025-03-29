import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end">
            <div className="bg-white m-4 w-full lg:w-1/2 h-[calc(100%-2rem)] rounded-xl shadow-[1px_2px_2px_0px_#2d3748]">
                <div className="font-['Inter'] font-semibold text-xl p-10 flex justify-between items-center">
                    <p className="text-black">{title}</p>
                    <button onClick={onClose} className="text-red-500 hover:text-red-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="bg-[#dddddd] font-['Inter'] text-xl rounded-xl overflow-y-scroll m-10 h-[70%] p-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;