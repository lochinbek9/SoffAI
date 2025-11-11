
import React from 'react';
import { CancelIcon, GoogleIcon, FacebookIcon, TelegramIcon } from './icons';

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const socialButtons = [
        { name: 'Google', icon: <GoogleIcon />, color: 'hover:bg-gray-700' },
        { name: 'Facebook', icon: <FacebookIcon className="text-[#1877F2]" />, color: 'hover:bg-gray-700' },
        { name: 'Telegram', icon: <TelegramIcon className="text-[#2AABEE]" />, color: 'hover:bg-gray-700' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={onClose}>
            <div className="relative bg-gray-900/80 border border-gray-700 rounded-2xl w-full max-w-sm p-8" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <CancelIcon className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Kirish yoki Ro'yxatdan o'tish</h2>
                    <p className="text-gray-400 mb-6">SoffAI-ga xush kelibsiz!</p>
                </div>

                <div className="flex flex-col gap-3">
                    {socialButtons.map((btn) => (
                        <button key={btn.name} className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-gray-800/60 border border-gray-700 ${btn.color} transition-colors`}>
                            {btn.icon}
                            <span className="font-semibold text-sm">{btn.name} orqali davom etish</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-700" />
                    <span className="mx-4 text-xs text-gray-500">YOKI</span>
                    <hr className="flex-grow border-gray-700" />
                </div>

                <div className="flex flex-col gap-4">
                    <input
                        type="tel"
                        placeholder="Telefon raqamingiz"
                        className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#87e64b] focus:outline-none"
                    />
                    <button className="w-full bg-[#87e64b] text-black font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                        Davom etish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
