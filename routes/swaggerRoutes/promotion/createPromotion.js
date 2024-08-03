/**
 * @swagger
 * /api/promotion/create/{id}:
 *   post:
 *     summary: Register a new promotion
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Doctor's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               promotionalImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Promotion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctorId:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Title and description are required
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server error
 */
