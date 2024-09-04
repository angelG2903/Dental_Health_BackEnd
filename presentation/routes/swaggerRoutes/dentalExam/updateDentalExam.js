/**
 * @swagger
 * /api/dentalExam/update/{id}/{examId}:
 *   put:
 *     summary: Update a dental exam for a patient
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lifeStage:
 *                 type: string
 *                 description: Life stage of the patient
 *                 example: child
 *               toothNumber:
 *                 type: integer
 *                 description: Tooth number being examined
 *                 example: 12
 *               state:
 *                 type: string
 *                 description: State of the tooth
 *                 example: cariado
 *     responses:
 *       200:
 *         description: Dental exam updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dental exam updated successfully
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid lifeStage or Invalid State
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