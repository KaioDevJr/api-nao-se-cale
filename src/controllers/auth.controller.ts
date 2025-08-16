import { Response } from "express";
import { admin } from "../services/firebase.js";
import { AuthedRequest } from "../types/express.js";

// Um "type guard" para verificar se o erro é um erro do Firebase Auth com código.
// Isso nos dá autocompletar e segurança de tipo dentro do bloco if.
const isFirebaseAuthError = (
  error: unknown
): error is { code: string; message: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
};

/**
 * Cria um novo usuário JÁ com permissões de administrador.
 * Chamado por POST /api/admin/users
 */
export const createAdminUser = async (req: AuthedRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    return res.status(201).json({
      message: `Usuário administrador criado com sucesso: ${userRecord.email}`,
      uid: userRecord.uid,
    });
  } catch (error: unknown) {
    console.error("Erro ao criar usuário admin:", error);
    if (isFirebaseAuthError(error)) {
      if (error.code === "auth/email-already-exists") {
        return res
          .status(409)
          .json({ error: "O endereço de e-mail já está em uso." });
      }
      return res
        .status(500)
        .json({ error: "Erro Interno do Servidor", details: error.message });
    }
    return res.status(500).json({ error: "Ocorreu um erro inesperado." });
  }
};

/**
 * Lista todos os usuários do Firebase Authentication.
 * Idealmente chamado por GET /api/admin/users
 */
export const listAllUsers = async (_req: AuthedRequest, res: Response) => {
  try {
    const listUsersResult = await admin.auth().listUsers(); // Por padrão, busca até 1000 usuários
    const users = listUsersResult.users.map((userRecord) => {
      // Mapeia para um formato mais limpo, evitando expor dados desnecessários
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        disabled: userRecord.disabled,
        customClaims: userRecord.customClaims,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      };
    });
    return res.status(200).json(users);
  } catch (error: unknown) {
    console.error("Erro ao listar usuários:", error);
    if (isFirebaseAuthError(error)) {
      return res.status(500).json({ error: "Erro Interno do Servidor ao listar usuários", details: error.message });
    }
    return res.status(500).json({ error: "Ocorreu um erro inesperado ao listar usuários." });
  }
};

/**
 * Promove um usuário EXISTENTE para o status de administrador.
 * Chamado por PUT /api/admin/users/promote
 */
export const promoteUserToAdmin = async (req: AuthedRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "O e-mail é obrigatório." });
    }

    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    return res
      .status(200)
      .json({ message: `Sucesso! ${email} agora é um administrador.` });
  } catch (error: unknown) {
    console.error("Erro ao promover usuário para admin:", error);
    if (isFirebaseAuthError(error)) {
      if (error.code === "auth/user-not-found") {
        return res.status(404).json({
          error: `Usuário com e-mail ${req.body.email} não encontrado.`,
        });
      }
      return res
        .status(500)
        .json({ error: "Erro Interno do Servidor", details: error.message });
    }
    return res.status(500).json({ error: "Ocorreu um erro inesperado." });
  }
};
