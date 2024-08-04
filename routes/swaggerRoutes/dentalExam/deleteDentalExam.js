/**
 * @swagger
 * /api/dentalExam/delete/{id}/{examId}:
 *   delete:
 *     summary: Delete a dental exam for a patient
 *     tags:
 *       - DentalExam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the patient
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the dental exam
 *     responses:
 *       200:
 *         description: Dental exam deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dental exam deleted successfully
 *       404:
 *         description: Patient or Dental exam not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Patient not found or Dental exam not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: server error
 *                 details:
 *                   type: string
 *                   example: Error message
 */
