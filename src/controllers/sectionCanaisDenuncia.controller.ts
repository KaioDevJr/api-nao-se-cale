import { Request, Response } from 'express';
import * as CanalDenunciaService from '../services/sectionCanaisDenuncia.service.js';
import { createCanalDenunciaSchema, updateCanalDenunciaSchema } from '../schemas/sectionCanaisDenuncia.schema.js';

/**
 * Controlador para a criação de um novo canal de denúncia.
 * Responsável por lidar com a requisição HTTP POST, validar os dados de entrada
 * e chamar a camada de serviço para criar o recurso no banco de dados.
 * @param req - O objeto de requisição do Express, contendo o corpo (body) com os dados do canal de denúncia.
 * @param res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
 */
export const createCanalDenuncia = async (req: Request, res: Response) => {
    try {
        // 1. Validação: O corpo da requisição (req.body) é validado contra o schema do Zod.
        const validation = createCanalDenunciaSchema.safeParse(req.body);
        if (!validation.success) {
            // Se a validação falhar, retorna um status 400 (Bad Request) com os detalhes do erro.
            return res.status(400).json({ error: validation.error.format() });
        }

        // 2. Chamada ao Serviço: Se a validação passar, os dados validados são enviados
        // para a função `createCanalDenuncia` no serviço, que contém a lógica de negócio.
        const canalDenuncia = await CanalDenunciaService.createCanalDenuncia(validation.data);

        // 3. Resposta de Sucesso: Retorna um status 201 (Created) e envia o objeto do canal de denúncia recém-criado.
        res.status(201).json(canalDenuncia);
    } catch (e: any) {
        // 4. Tratamento de Erro: Se ocorrer qualquer erro inesperado durante o processo.
        console.error("Error creating canal de denúncia:", e);
        res.status(500).json({ error: 'Failed to create canal de denúncia.' });
    }
};

/**
 * Controlador para buscar todos os canais de denúncia.
 * Lida com a requisição GET para listar todos os recursos.
 */
export const getCanaisDenuncia = async (_req: Request, res: Response) => {
    try {
        // Delega a busca de todos os canais de denúncia para a camada de serviço.
        const canaisDenuncia = await CanalDenunciaService.getCanaisDenuncia();
        // Retorna a lista de canais de denúncia com um status 200 (OK).
        res.json(canaisDenuncia);
    } catch (e: any) {
        console.error("Error fetching canais de denúncia:", e);
        res.status(500).json({ error: 'Failed to fetch canais de denúncia.' });
    }
};

/**
 * Controlador para buscar um canal de denúncia específico pelo seu ID.
 * Lida com a requisição GET para um recurso específico.
 */
export const getCanalDenunciaById = async (req: Request, res: Response) => {
    try {
        // Extrai o `id` dos parâmetros da URL.
        const { id } = req.params;
        // Chama o serviço para buscar o canal de denúncia pelo ID fornecido.
        const canalDenuncia = await CanalDenunciaService.getCanalDenunciaById(id);

        // Se o serviço retornar `null`, significa que o canal de denúncia não foi encontrado.
        if (!canalDenuncia) {
            // Retornamos um status 404 (Not Found) para indicar que o recurso não existe.
            return res.status(404).json({ error: 'Canal de denúncia not found' });
        }

        // Se encontrado, retorna o objeto do canal de denúncia.
        res.json(canalDenuncia);
    } catch (e: any) {
        console.error(`Error fetching canal de denúncia ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to fetch canal de denúncia.' });
    }
};

/**
 * Controlador para atualizar um canal de denúncia existente.
 * Lida com a requisição PUT para modificar um recurso.
 */
export const updateCanalDenuncia = async (req: Request, res: Response) => {
    try {
        // Extrai o ID da URL e os dados para atualização do corpo da requisição.
        const { id } = req.params;
        const validation = updateCanalDenunciaSchema.safeParse(req.body);

        // Valida os dados de entrada.
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        // Chama o serviço para realizar a atualização.
        const updatedCanalDenuncia = await CanalDenunciaService.updateCanalDenuncia(id, validation.data);

        // Se o serviço retornar `null`, o canal de denúncia com o ID fornecido não existe.
        if (!updatedCanalDenuncia) {
            return res.status(404).json({ error: 'Canal de denúncia not found' });
        }

        // Retorna o canal de denúncia atualizado.
        res.json(updatedCanalDenuncia);
    } catch (e: any) {
        console.error(`Error updating canal de denúncia ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to update canal de denúncia.' });
    }
};

/**
 * Controlador para deletar um canal de denúncia.
 * Lida com a requisição DELETE para remover um recurso.
 */
export const deleteCanalDenuncia = async (req: Request, res: Response) => {
    try {
        // Extrai o ID do canal de denúncia a ser deletado da URL.
        const { id } = req.params;
        // Chama o serviço para deletar o canal de denúncia. O serviço retorna `true` se foi deletado, `false` se não foi encontrado.
        const wasDeleted = await CanalDenunciaService.deleteCanalDenuncia(id);

        // Se o item não foi encontrado para ser deletado, retorna 404.
        if (!wasDeleted) {
            return res.status(404).json({ error: 'Canal de denúncia not found' });
        }

        // Se a exclusão for bem-sucedida, retorna um status 204 (No Content).
        res.status(204).send();
    } catch (e: any) {
        console.error(`Error deleting canal de denúncia ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to delete canal de denúncia.' });
    }
};
