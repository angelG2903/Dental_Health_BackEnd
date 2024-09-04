/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión
 *     description: Autentica un usuario con email y contraseña.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "example@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 loginId:
 *                   type: integer
 *                 role:
 *                   type: string
 *       401:
 *         description: Email o contraseña inválidos
 *       500:
 *         description: Error del servidor
 */
