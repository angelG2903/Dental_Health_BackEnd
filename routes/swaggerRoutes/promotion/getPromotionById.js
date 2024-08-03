/**
 * @swagger
 * /api/promotion/get/{id}:
 *   get:
 *     summary: Get a promotion by ID
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: A promotion object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 promotionalImage:
 *                   type: string
 *                 doctor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     login:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Server error
 */
