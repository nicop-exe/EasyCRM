import React from 'react';
import ChatbotLoader from '../features/customers/ChatbotLoader';
import { addCustomer, uploadCustomerDocument } from '../services/customerService';
import { useNavigate } from 'react-router-dom';

const CustomerLoadPage = () => {
    const navigate = useNavigate();

    const handleComplete = async (data) => {
        try {
            console.log("Saving customer...", data);
            // 1. Create customer
            const customerId = await addCustomer({
                name: data.name,
                email: data.email,
                priority: data.priority
            });

            // 2. Upload document if exists
            if (data.document) {
                // We assume 'document' is the File object. 
                // In the ChatbotLoader we need to ensure we pass the File object.
                await uploadCustomerDocument(customerId, data.document, 'Contrato');
            }

            // Redirect after short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            console.error("Error saving customer:", error);
            alert("Hubo un error al guardar el cliente.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-satoshi font-bold text-white mb-6">
                Nuevo Cliente <span className="text-neon-green">.</span>
            </h2>
            <ChatbotLoader onComplete={handleComplete} />
        </div>
    );
};

export default CustomerLoadPage;
