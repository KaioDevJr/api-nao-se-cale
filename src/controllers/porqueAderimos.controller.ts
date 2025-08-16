import { Request, Response } from 'express';
import * as PorqueAderimosService from '../services/porqueAderimos.service.js';
import { createPorqueAderimosSchema, updatePorqueAderimosSchema } from '../schemas/porqueAderimos.schema.js';

/**
 * Controlador para a criação de um novo item "Porque Aderimos".
 * @param req - O objeto de requisição do Express, contendo o corpo (body) com os dados do item.
 * @param res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
 */
export const createPorqueAderimos = async (req: Request, res: Response) => {
    try {
        const validation = createPorqueAderimosSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        const porqueAderimos = await PorqueAderimosService.createPorqueAderimos(validation.data);
        res.status(201).json(porqueAderimos);
    } catch (e: any) {
        console.error("Error creating porque aderimos:", e);
        res.status(500).json({ error: 'Failed to create porque aderimos.' });
    }
};

/**
 * Controlador para buscar todos os itens "Porque Aderimos".
 */
export const getPorqueAderimos = async (_req: Request, res: Response) => {
    try {
        const porqueAderimos = await PorqueAderimosService.getPorqueAderimos();
        res.json(porqueAderimos);
    } catch (e: any) {
        console.error("Error fetching porque aderimos:", e);
        res.status(500).json({ error: 'Failed to fetch porque aderimos.' });
    }
};

/**
 * Controlador para buscar um item "Porque Aderimos" específico pelo seu ID.
 */
export const getPorqueAderimosById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const porqueAderimos = await PorqueAderimosService.getPorqueAderimosById(id);

        if (!porqueAderimos) {
            return res.status(404).json({ error: 'Porque Aderimos not found' });
        }

        res.json(porqueAderimos);
    } catch (e: any) {
        console.error(`Error fetching porque aderimos ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to fetch porque aderimos.' });
    }
};

/**
 * Controlador para atualizar um item "Porque Aderimos" existente.
 */
export const updatePorqueAderimos = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validation = updatePorqueAderimosSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.format() });
        }

        const updatedPorqueAderimos = await PorqueAderimosService.updatePorqueAderimos(id, validation.data);

        if (!updatedPorqueAderimos) {
            return res.status(404).json({ error: 'Porque Aderimos not found' });
        }

        res.json(updatedPorqueAderimos);
    } catch (e: any) {
        console.error(`Error updating porque aderimos ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to update porque aderimos.' });
    }
};

/**
 * Controlador para deletar um item "Porque Aderimos".
 */
export const deletePorqueAderimos = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const wasDeleted = await PorqueAderimosService.deletePorqueAderimos(id);

        if (!wasDeleted) {
            return res.status(404).json({ error: 'Porque Aderimos not found' });
        }

        res.status(204).send();
    } catch (e: any) {
        console.error(`Error deleting porque aderimos ${req.params.id}:`, e);
        res.status(500).json({ error: 'Failed to delete porque aderimos.' });
    }
};
