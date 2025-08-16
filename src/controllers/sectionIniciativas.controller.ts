import { Request, Response } from 'express';
import * as IniciativaService from '../services/sectionIniciativas.service.js';
import { createIniciativaSchema, updateIniciativaSchema } from '../schemas/sectionIniciativas.schema.js';

/**
 * Controlador para a criação de uma nova iniciativa.
 * Responsável por lidar com a requisição HTTP POST, validar os dados de entrada
 * e chamar a camada de serviço para criar o recurso no banco de dados.
 * @param req - O objeto de requisição do Express, contendo o corpo (body) com os dados da iniciativa.
 * @param res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
 */
export const createIniciativa = async (req: Request, res: Response) => {
    try {
        const validation = createIniciativaSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        const iniciativa = await IniciativaService.createIniciativa(validation.data);
        res.status(201).json(iniciativa);
    } catch (e: any) {
        console.error("Error creating iniciativa:", e);
        res.status(500).json({ error: 'Failed to create iniciativa.' });
    }
};

/**
 * Controlador para buscar todas as iniciativas.
 * Lida com a requisição GET para listar todos os recursos.
 */
export const getIniciativas = async (_req: Request, res: Response) => {
    try {
        const iniciativas = await IniciativaService.getIniciativas();
        res.json(iniciativas);
    } catch (e: any) {
        console.error("Error fetching iniciativas:", e);
        res.status(500).json({ error: 'Failed to fetch iniciativas.' });
    }
};

/**
 * Controlador para buscar uma iniciativa específica pelo seu ID.
 * Lida com a requisição GET para um recurso específico.
 */
export const getIniciativaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const iniciativa = await IniciativaService.getIniciativaById(id);

        if (!iniciativa) {
            return res.status(404).json({ error: 'Iniciativa not found' });
        }

        res.json(iniciativa);
    } catch (e: any) {
        console.error(`Error fetching iniciativa ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to fetch iniciativa.' });
    }
};

/**
 * Controlador para atualizar uma iniciativa existente.
 * Lida com a requisição PUT para modificar um recurso.
 */
export const updateIniciativa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validation = updateIniciativaSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        const updatedIniciativa = await IniciativaService.updateIniciativa(id, validation.data);

        if (!updatedIniciativa) {
            return res.status(404).json({ error: 'Iniciativa not found' });
        }

        res.json(updatedIniciativa);
    } catch (e: any) {
        console.error(`Error updating iniciativa ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to update iniciativa.' });
    }
};

/**
 * Controlador para deletar uma iniciativa.
 * Lida com a requisição DELETE para remover um recurso.
 */
export const deleteIniciativa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const wasDeleted = await IniciativaService.deleteIniciativa(id);

        if (!wasDeleted) {
            return res.status(404).json({ error: 'Iniciativa not found' });
        }

        res.status(204).send();
    } catch (e: any) {
        console.error(`Error deleting iniciativa ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to delete iniciativa.' });
    }
};
