import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /appeals:
 *   post:
 *     summary: Create a new appeal
 *     tags: [Appeals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - description
 *             properties:
 *               subject:
 *                 type: string
 *                 description: Appeal subject
 *               description:
 *                 type: string
 *                 description: Appeal description
 *     responses:
 *       201:
 *         description: Appeal created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/', async (req, res) => {
  try {
    const { subject, description } = req.body;
    
    if (!subject || !description) {
      return res.status(400).json({ error: 'Subject and description are required' });
    }
    
    const appeal = await prisma.appeal.create({
      data: {
        subject,
        description,
        status: 'new',
      }
    });
    
    res.status(201).json(appeal);
  } catch (error) {
    console.error('Error creating appeal:', error);
    res.status(500).json({ error: 'Failed to create appeal' });
  }
});

/**
 * @swagger
 * /appeals/{id}/process:
 *   patch:
 *     summary: Take an appeal into processing
 *     tags: [Appeals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appeal ID
 *     responses:
 *       200:
 *         description: Appeal status updated successfully
 *       404:
 *         description: Appeal not found
 *       400:
 *         description: Appeal is not in 'new' status
 */
router.patch('/:id/process', async (req, res) => {
  try {
    const { id } = req.params;
    
    const appeal = await prisma.appeal.findUnique({ where: { id: Number(id) } });
    
    if (!appeal) {
      return res.status(404).json({ error: 'Appeal not found' });
    }
    
    if (appeal.status !== 'new') {
      return res.status(400).json({ error: 'Only appeals with "new" status can be processed' });
    }
    
    const updatedAppeal = await prisma.appeal.update({
      where: { id: Number(id) },
      data: { status: 'in_progress' }
    });
    
    res.status(200).json(updatedAppeal);
  } catch (error) {
    console.error('Error processing appeal:', error);
    res.status(500).json({ error: 'Failed to process appeal' });
  }
});

/**
 * @swagger
 * /appeals/{id}/complete:
 *   patch:
 *     summary: Complete an appeal
 *     tags: [Appeals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appeal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - solution
 *             properties:
 *               solution:
 *                 type: string
 *                 description: Solution description
 *     responses:
 *       200:
 *         description: Appeal completed successfully
 *       404:
 *         description: Appeal not found
 *       400:
 *         description: Invalid request or appeal is not in 'in_progress' status
 */
router.patch('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { solution } = req.body;
    
    if (!solution) {
      return res.status(400).json({ error: 'Solution is required' });
    }
    
    const appeal = await prisma.appeal.findUnique({ where: { id: Number(id) } });
    
    if (!appeal) {
      return res.status(404).json({ error: 'Appeal not found' });
    }
    
    if (appeal.status !== 'in_progress') {
      return res.status(400).json({ error: 'Only appeals with "in_progress" status can be completed' });
    }
    
    const updatedAppeal = await prisma.appeal.update({
      where: { id: Number(id) },
      data: { 
        status: 'completed',
        solution
      }
    });
    
    res.status(200).json(updatedAppeal);
  } catch (error) {
    console.error('Error completing appeal:', error);
    res.status(500).json({ error: 'Failed to complete appeal' });
  }
});

/**
 * @swagger
 * /appeals/{id}/cancel:
 *   patch:
 *     summary: Cancel an appeal
 *     tags: [Appeals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appeal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancelReason
 *             properties:
 *               cancelReason:
 *                 type: string
 *                 description: Cancellation reason
 *     responses:
 *       200:
 *         description: Appeal cancelled successfully
 *       404:
 *         description: Appeal not found
 *       400:
 *         description: Invalid request or appeal is already completed/cancelled
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    
    if (!cancelReason) {
      return res.status(400).json({ error: 'Cancellation reason is required' });
    }
    
    const appeal = await prisma.appeal.findUnique({ where: { id: Number(id) } });
    
    if (!appeal) {
      return res.status(404).json({ error: 'Appeal not found' });
    }
    
    if (appeal.status === 'completed' || appeal.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel a completed or already cancelled appeal' });
    }
    
    const updatedAppeal = await prisma.appeal.update({
      where: { id: Number(id) },
      data: { 
        status: 'cancelled',
        cancelReason
      }
    });
    
    res.status(200).json(updatedAppeal);
  } catch (error) {
    console.error('Error cancelling appeal:', error);
    res.status(500).json({ error: 'Failed to cancel appeal' });
  }
});

/**
 * @swagger
 * /appeals/cancel-all-in-progress:
 *   patch:
 *     summary: Cancel all appeals in progress
 *     tags: [Appeals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancelReason
 *             properties:
 *               cancelReason:
 *                 type: string
 *                 description: Cancellation reason for all appeals
 *     responses:
 *       200:
 *         description: Appeals cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of appeals cancelled
 *       400:
 *         description: Cancellation reason is required
 */
router.patch('/cancel-all-in-progress', async (req, res) => {
  try {
    const { cancelReason } = req.body;
    
    if (!cancelReason) {
      return res.status(400).json({ error: 'Cancellation reason is required' });
    }
    
    const result = await prisma.appeal.updateMany({
      where: { status: 'in_progress' },
      data: { 
        status: 'cancelled',
        cancelReason
      }
    });
    
    res.status(200).json({ count: result.count, message: `${result.count} appeals have been cancelled` });
  } catch (error) {
    console.error('Error cancelling appeals:', error);
    res.status(500).json({ error: 'Failed to cancel appeals' });
  }
});

/**
 * @swagger
 * /appeals:
 *   get:
 *     summary: Get all appeals with optional date filtering
 *     tags: [Appeals]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date (YYYY-MM-DD)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of appeals
 */
router.get('/', async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let whereClause = {};
    
    if (date) {
      // Filter by specific date
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      whereClause = {
        createdAt: {
          gte: targetDate,
          lt: nextDay
        }
      };
    } else if (startDate && endDate) {
      // Filter by date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Include the end date
      
      whereClause = {
        createdAt: {
          gte: start,
          lt: end
        }
      };
    } else if (startDate) {
      // Filter from start date onwards
      whereClause = {
        createdAt: {
          gte: new Date(startDate)
        }
      };
    } else if (endDate) {
      // Filter up to end date
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Include the end date
      
      whereClause = {
        createdAt: {
          lt: end
        }
      };
    }
    
    const appeals = await prisma.appeal.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(appeals);
  } catch (error) {
    console.error('Error fetching appeals:', error);
    res.status(500).json({ error: 'Failed to fetch appeals' });
  }
});

export default router;