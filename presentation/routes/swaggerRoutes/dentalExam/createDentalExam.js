/**
 * @swagger
 * /api/dentalExam/create/{id}:
 *   post:
 *     summary: Create a new dental exam for a patient
 *     tags:
 *       - DentalExam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID of the patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lifeStage
 *               - toothNumber
 *               - state
 *             properties:
 *               lifeStage:
 *                 type: string
 *                 description: Life stage of the patient
 *                 example: adult
 *                 enum: ['adult', 'child']
 *               toothNumber:
 *                 type: integer
 *                 description: Tooth number being examined
 *                 example: 12
 *               state:
 *                 type: string
 *                 description: State of the tooth
 *                 example: sano
 *                 enum: ['sano', 'cariado', 'obturado', 'od_perdido', 'protesis_parcial_r', 'od_reemplazado', 'protesis_fija', 'ext_indicada']
 *     responses:
 *       201:
 *         description: Dental exam created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patientId:
 *                   type: integer
 *                   example: 1
 *                 lifeStage:
 *                   type: string
 *                   example: adult
 *                 toothNumber:
 *                   type: integer
 *                   example: 12
 *                 state:
 *                   type: string
 *                   example: sano
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: lifeStage, toothNumber and state are required
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