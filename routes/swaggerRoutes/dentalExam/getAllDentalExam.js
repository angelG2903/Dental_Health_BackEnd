/**
 * @swagger
 * /api/dentalExam/get/{id}:
 *   get:
 *     summary: Get all dental exams for a patient
 *     tags:
 *       - DentalExam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the patient
 *     responses:
 *       200:
 *         description: List of dental exams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   patientId:
 *                     type: integer
 *                     example: 1
 *                   lifeStage:
 *                     type: string
 *                     example: adult
 *                   toothNumber:
 *                     type: integer
 *                     example: 12
 *                   state:
 *                     type: string
 *                     example: sano
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Patient not found
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
