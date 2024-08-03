/**
 * @swagger
 * /api/promotion/update/{id}:
 *   put:
 *     summary: Update a promotion
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Promotion ID
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
 *       200:
 *         description: Promotion updated successfully
 *       400:
 *         description: Title and description are required
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Server error
 */
