import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, User, Mail, AlertCircle, FileText, Check } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// Mock function for now, will replace with real Firebase logic
const uploadFile = async (file) => {
    return new Promise(resolve => setTimeout(() => resolve(`url_for_${file.name}`), 1000));
};

const STEPS = [
    {
        id: 'name',
        question: "¿Cómo se llama el nuevo cliente?",
        tip: "Un nombre claro es la base de toda relación comercial.",
        type: 'text',
        icon: User
    },
    {
        id: 'email',
        question: "¿Cuál es su correo electrónico?",
        tip: "Vital para el envío automático de reportes mensuales.",
        type: 'email',
        icon: Mail
    },
    {
        id: 'priority',
        question: "Asigna un nivel de prioridad",
        tip: "La 'Prioridad Alta' dispara alertas inmediatas al equipo de soporte.",
        type: 'select',
        options: [
            { value: 'high', label: 'Alta', color: 'text-electric-magenta border-electric-magenta' },
            { value: 'medium', label: 'Media', color: 'text-yellow-400 border-yellow-400' },
            { value: 'low', label: 'Baja', color: 'text-neon-green border-neon-green' }
        ],
        icon: AlertCircle
    },
    {
        id: 'document',
        question: "¿Deseas adjuntar un Contrato o Factura inicial?",
        tip: "Los documentos se clasifican automáticamente en Storage con metadatos.",
        type: 'file',
        icon: FileText,
        accept: '.pdf,.png,.jpg'
    }
];

const ChatbotLoader = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [history, setHistory] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, currentStep]);

    // Initial greeting
    useEffect(() => {
        if (history.length === 0) {
            setHistory([{
                type: 'bot',
                text: "Hola. Estoy listo para registrar un nuevo cliente en el sistema.",
                stepId: 'intro'
            }]);
            setTimeout(() => {
                askQuestion(0);
            }, 500);
        }
    }, []);

    const askQuestion = (stepIndex) => {
        if (stepIndex >= STEPS.length) return;
        const step = STEPS[stepIndex];
        setHistory(prev => [
            ...prev,
            {
                type: 'bot',
                text: step.question,
                tip: step.tip,
                stepId: step.id
            }
        ]);
    };

    const handleNext = async (value, label = null) => {
        if (!value && currentStep !== 3) return; // Allow skipping file upload if we wanted, but let's enforce or make optional. Let's enforce for now or handle optional.

        const step = STEPS[currentStep];
        const displayValue = label || (step.type === 'file' ? value.name : value);

        setHistory(prev => [
            ...prev,
            { type: 'user', text: displayValue }
        ]);

        setAnswers(prev => ({ ...prev, [step.id]: value }));

        if (currentStep < STEPS.length - 1) {
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                askQuestion(currentStep + 1);
            }, 500);
            setInputValue('');
        } else {
            // Finished
            setLoading(true);
            await onComplete({ ...answers, [step.id]: value });
            setLoading(false);
            setHistory(prev => [
                ...prev,
                { type: 'bot', text: "¡Cliente registrado exitosamente! Redirigiendo...", success: true }
            ]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            handleNext(inputValue);
        }
    };

    const handleOptionSelect = (option) => {
        handleNext(option.value, option.label);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app we might upload here or later. 
            // For the chat flow visualization, we just show the name.
            handleNext(file);
        }
    };

    const currentStepData = STEPS[currentStep];

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col h-[600px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-neon-green/5">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {history.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                            "flex flex-col gap-1 max-w-[80%]",
                            msg.type === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                    >
                        <div className={clsx(
                            "p-4 rounded-2xl text-sm md:text-base",
                            msg.type === 'user'
                                ? "bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-tr-none"
                                : "bg-white/5 text-gray-200 border border-white/10 rounded-tl-none"
                        )}>
                            {msg.text}
                        </div>

                        {msg.tip && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 ml-1 animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-electric-magenta"></div>
                                {msg.tip}
                            </div>
                        )}

                        {msg.success && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mt-2 text-neon-green"
                            >
                                <Check size={24} />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/60">
                {!loading && currentStep < STEPS.length && (
                    <div className="relative">
                        {currentStepData.type === 'text' || currentStepData.type === 'email' ? (
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type={currentStepData.type}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Escribe tu respuesta..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-green/50 transition-colors text-white placeholder:text-gray-600"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="bg-neon-green/10 hover:bg-neon-green/20 text-neon-green p-3 rounded-xl border border-neon-green/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        ) : currentStepData.type === 'select' ? (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {currentStepData.options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleOptionSelect(opt)}
                                        className={clsx(
                                            "px-4 py-2 rounded-xl border bg-black/50 hover:bg-white/5 transition-all",
                                            opt.color
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        ) : currentStepData.type === 'file' ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex justify-center">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept={currentStepData.accept}
                                        onChange={handleFileUpload}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 text-gray-300 px-6 py-3 rounded-xl border border-dashed border-gray-600 hover:border-neon-green transition-all"
                                    >
                                        <Upload size={20} />
                                        <span>Seleccionar Archivo</span>
                                    </label>
                                </div>
                                <button
                                    onClick={() => handleNext(null, "Sin documento adjunto")}
                                    className="text-gray-500 hover:text-white text-sm underline underline-offset-4"
                                >
                                    Omitir este paso
                                </button>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatbotLoader;
