import { Response } from 'express';
import { admin } from '../services/firebase.js'; // Assumindo que seu admin do Firebase é inicializado aqui
import { AuthedRequest } from '../types/express';

/**
 * Controlador para criar um novo usuário com permissões de administrador no Firebase.
 * Esta rota deve ser protegida para ser acessível apenas por administradores existentes.
 * @param req - O objeto de requisição do Express, contendo email, password e name no corpo.
 * @param res - O objeto de resposta do Express.
 */
export const createAdminUser = async (req: AuthedRequest, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, senha e nome são obrigatórios.' });
    }

    try {
        // 1. Cria o usuário no Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
            emailVerified: true, // Opcional: marcar o email como verificado
            disabled: false,
        });

        // 2. Adiciona a "claim" (permissão) de administrador ao novo usuário
        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

        console.log(`Usuário administrador criado com sucesso: ${userRecord.uid}`);

        // Retorna uma resposta de sucesso sem informações sensíveis
        return res.status(201).json({
            message: 'Usuário administrador criado com sucesso.',
            uid: userRecord.uid,
        });

    } catch (error: any) {
        console.error('Erro ao criar usuário administrador:', error);

        if (error.code === 'auth/email-already-exists') {
            return res.status(409).json({ error: 'O endereço de e-mail já está em uso por outra conta.' });
        }
        if (error.code === 'auth/invalid-password') {
            return res.status(400).json({ error: 'A senha deve ser uma string com pelo menos 6 caracteres.' });
        }

        return res.status(500).json({ error: 'Falha ao criar usuário administrador.' });
    }
};

