import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, updateMetadata } from 'firebase/storage';

// Mock storage for demo purposes when Firebase is not configured
const mockCustomers = [];

export const addCustomer = async (data) => {
    // Fallback if Firebase is not initialized (db is undefined)
    if (!db) {
        console.warn("Firebase not initialized. Using Mock Service.");
        const newCustomer = {
            id: `mock_${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        mockCustomers.push(newCustomer);
        return new Promise(resolve => setTimeout(() => resolve(newCustomer.id), 1000));
    }

    try {
        const docRef = await addDoc(collection(db, "customers"), {
            name: data.name,
            email: data.email,
            priority: data.priority,
            createdAt: serverTimestamp(),
            status: 'active'
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding customer: ", e);
        throw e;
    }
};

export const uploadCustomerDocument = async (customerId, file, type = 'Contrato') => {
    // Fallback if file is missing
    if (!file) return null;

    // Fallback if Firebase Storage is not initialized
    if (!storage) {
        console.warn("Firebase Storage not initialized. Using Mock Service.");
        return new Promise(resolve => setTimeout(() => resolve(`https://mock-url.com/${file.name}`), 1000));
    }

    try {
        const storageRef = ref(storage, `customers/${customerId}/${file.name}`);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file);

        // Set metadata
        await updateMetadata(storageRef, {
            customMetadata: {
                type: type,
                customerId: customerId
            }
        });

        const downloadURL = await getDownloadURL(snapshot.ref);

        // Only try to add to Firestore if db is available
        if (db) {
            await addDoc(collection(db, `customers/${customerId}/documents`), {
                name: file.name,
                url: downloadURL,
                type: type,
                uploadedAt: serverTimestamp()
            });
        }

        return downloadURL;
    } catch (e) {
        console.error("Error uploading file: ", e);
        throw e;
    }
};
