import { Request, Response } from 'express';
import * as NaoSeCaleService from '../services/naoSeCale.service.js';
import { createNaoSeCaleSchema, updateNaoSeCaleSchema } from '../schemas/naoSeCale.schema.js';

/**
 * Controlador para a criação de um novo item da seção NaoSeCale.
 * Responsável por lidar com a requisição HTTP POST, validar os dados de entrada
 * e chamar a camada de serviço para criar o recurso no banco de dados.
 * @param req - O objeto de requisição do Express, contendo o corpo (body) com os dados do item.
 * @param res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
 */
export const createNaoSeCale = async (req: Request, res: Response) => {
    try {
        // 1. Validação: O corpo da requisição (req.body) é validado contra o schema do Zod.
        const validation = createNaoSeCaleSchema.safeParse(req.body);
        if (!validation.success) {
            // Se a validação falhar, retorna um status 400 (Bad Request) com os detalhes do erro.
            return res.status(400).json({ error: validation.error.format() });
        }

        // 2. Chamada ao Serviço: Se a validação passar, os dados validados são enviados
        // para a função `createNaoSeCale` no serviço, que contém a lógica de negócio.
        const naoSeCaleItem = await NaoSeCaleService.createNaoSeCale(validation.data);

        // 3. Resposta de Sucesso: Retorna um status 201 (Created), que é o padrão para criação de novos
        // recursos, e envia o objeto do item recém-criado de volta para o cliente.
        res.status(201).json(naoSeCaleItem);
    } catch (e: any) {
        // 4. Tratamento de Erro: Se ocorrer qualquer erro inesperado durante o processo
        console.error("Error creating NaoSeCale item:", e);
        res.status(500).json({ error: 'Failed to create NaoSeCale item.' });
    }
};

/**
 * Controlador para buscar todos os itens da seção NaoSeCale.
 * Lida com a requisição GET para listar todos os recursos.
 */
export const getNaoSeCaleItems = async (_req: Request, res: Response) => {
    try {
        console.log("Fetching NaoSeCale items...");
        // Delega a busca de todos os itens para a camada de serviço.
        const naoSeCaleItems = await NaoSeCaleService.getNaoSeCaleItems();
        console.log(`Found ${naoSeCaleItems.length} NaoSeCale items`);
        // Retorna a lista de itens com um status 200 (OK).
        res.json(naoSeCaleItems);
    } catch (e: any) {
        console.error("Error fetching NaoSeCale items:", e);
        res.status(500).json({ error: 'Failed to fetch NaoSeCale items.' });
    }
};

/**
 * Controlador para buscar um item específico da seção NaoSeCale pelo seu ID.
 * Lida com a requisição GET para um recurso específico.
 */
export const getNaoSeCaleById = async (req: Request, res: Response) => {
    try {
        // Extrai o `id` dos parâmetros da URL
        const { id } = req.params;
        // Chama o serviço para buscar o item pelo ID fornecido.
        const naoSeCaleItem = await NaoSeCaleService.getNaoSeCaleById(id);

        // Se o serviço retornar `null`, significa que o item não foi encontrado.
        if (!naoSeCaleItem) {
            // Retornamos um status 404 (Not Found) para indicar que o recurso não existe.
            return res.status(404).json({ error: 'NaoSeCale item not found' });
        }

        // Se encontrado, retorna o objeto do item.
        res.json(naoSeCaleItem);
    } catch (e: any) {
        console.error(`Error fetching NaoSeCale item ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to fetch NaoSeCale item.' });
    }
};

/**
 * Controlador para atualizar um item existente da seção NaoSeCale.
 * Lida com a requisição PUT para modificar um recurso.
 */
export const updateNaoSeCale = async (req: Request, res: Response) => {
    try {
        // Extrai o ID da URL e os dados para atualização do corpo da requisição.
        const { id } = req.params;
        const validation = updateNaoSeCaleSchema.safeParse(req.body);

        // Valida os dados de entrada.
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        // Chama o serviço para realizar a atualização.
        const updatedNaoSeCaleItem = await NaoSeCaleService.updateNaoSeCale(id, validation.data);

        // Se o serviço retornar `null`, o item com o ID fornecido não existe.
        if (!updatedNaoSeCaleItem) {
            return res.status(404).json({ error: 'NaoSeCale item not found' });
        }

        // Retorna o item atualizado.
        res.json(updatedNaoSeCaleItem);
    } catch (e: any) {
        console.error(`Error updating NaoSeCale item ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to update NaoSeCale item.' });
    }
};

/**
 * Controlador para deletar um item da seção NaoSeCale.
 * Lida com a requisição DELETE para remover um recurso.
 */
export const deleteNaoSeCale = async (req: Request, res: Response) => {
    try {
        // Extrai o ID do item a ser deletado da URL.
        const { id } = req.params;
        // Chama o serviço para deletar o item. O serviço retorna `true` se foi deletado, `false` se não foi encontrado.
        const wasDeleted = await NaoSeCaleService.deleteNaoSeCale(id);

        // Se o item não foi encontrado para ser deletado, retorna 404.
        if (!wasDeleted) {
            return res.status(404).json({ error: 'NaoSeCale item not found' });
        }

        // Se a exclusão for bem-sucedida, retorna um status 204 (No Content).
        res.status(204).send();
    } catch (e: any) {
        console.error(`Error deleting NaoSeCale item ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to delete NaoSeCale item.' });
    }
};
