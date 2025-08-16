import { Response } from "express";
import { admin } from "../services/firebase.js";
import { AuthedRequest } from "../types/express.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
export const createAdminUser = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  const userRecord = await admin.auth().createUser({
    email: email,
    password: password,
  });

  await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

  res.status(201).json({
    message: `Usuário administrador criado com sucesso: ${userRecord.email}`,
    uid: userRecord.uid,
  });
});

/**
 * Lista todos os usuários do Firebase Authentication.
 * Idealmente chamado por GET /api/admin/users
 */
export const listAllUsers = asyncHandler(async (_req: AuthedRequest, res: Response) => {
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
  res.status(200).json(users);
});

/**
 * Promove um usuário EXISTENTE para o status de administrador.
 * Chamado por PUT /api/admin/users/promote
 */
export const promoteUserToAdmin = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "O e-mail é obrigatório." });
  }

  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });

  res
    .status(200)
    .json({ message: `Sucesso! ${email} agora é um administrador.` });
});

/**
 * Deleta um usuário do Firebase Authentication pelo seu UID.
 * Chamado por DELETE /api/admin/users/:id
 */
export const deleteUser = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { id } = req.params; // O ID aqui é o UID do Firebase
  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  await admin.auth().deleteUser(id);

  res.status(204).send();
});
