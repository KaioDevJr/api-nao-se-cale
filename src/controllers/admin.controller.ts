import { Request, Response } from 'express';

export async function listUsers(req: Request, res: Response) {
  // TODO: Implementar a lógica para listar usuários
  res.status(200).send('Listar usuários');
}

export async function createUser(req: Request, res: Response) {
  // TODO: Implementar a lógica para criar um usuário
  res.status(201).send('Criar usuário');
}

export async function deleteUser(req: Request, res: Response) {
  // TODO: Implementar a lógica para deletar um usuário
  const { userId } = req.params;
  res.status(200).send(`Deletar usuário com ID: ${userId}`);
}

export async function promoteUser(req: Request, res: Response) {
  // TODO: Implementar a lógica para promover um usuário
  res.status(200).send('Promover usuário');
}
