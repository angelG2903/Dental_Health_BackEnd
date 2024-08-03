/**
 * @swagger
 * /api/promotion/delete/{id}:
 *   delete:
 *     summary: Delete a promotion
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
 *         description: Promotion deleted successfully
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Server error
 */
