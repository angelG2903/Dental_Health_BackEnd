/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea una nueva cuenta de usuario para pacientes o doctores toma en cuenta que son datos diferentes dependiendo del tipo de usuario los datos son diferentes.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Juan"
 *                   lastName:
 *                     type: string
 *                     example: "Pérez"
 *                   gender:
 *                     type: string
 *                     enum: [femenino, masculino]
 *                     example: "masculino"
 *                   birthDate:
 *                     type: string
 *                     format: date
 *                     example: "1990-01-01"
 *                   phoneNumber:
 *                     type: string
 *                     example: "1234567890"
 *                   profilePicture:
 *                     type: string
 *                     format: uri
 *                     example: "http://example.com/profile.jpg"
 *                   email:
 *                     type: string
 *                     example: "juan.perez@example.com"
 *                   password:
 *                     type: string
 *                     example: "securepassword"
 *                   role:
 *                     type: string
 *                     enum: [patient]
 *                     example: "patient"
 *                   maritalStatus:
 *                     type: string
 *                     example: "single"
 *                   occupation:
 *                     type: string
 *                     example: "Engineer"
 *                   address:
 *                     type: string
 *                     example: "123 Street Name, City"
 *                   origin:
 *                     type: string
 *                     example: "City Name"
 *                 required:
 *                   - name
 *                   - lastName
 *                   - gender
 *                   - birthDate
 *                   - email
 *                   - password
 *                   - role
 *               - type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "María"
 *                   lastName:
 *                     type: string
 *                     example: "González"
 *                   gender:
 *                     type: string
 *                     enum: [femenino, masculino]
 *                     example: "femenino"
 *                   birthDate:
 *                     type: string
 *                     format: date
 *                     example: "1985-05-15"
 *                   phoneNumber:
 *                     type: string
 *                     example: "0987654321"
 *                   profilePicture:
 *                     type: string
 *                     format: uri
 *                     example: "http://example.com/profile2.jpg"
 *                   email:
 *                     type: string
 *                     example: "maria.gonzalez@example.com"
 *                   password:
 *                     type: string
 *                     example: "anothersecurepassword"
 *                   role:
 *                     type: string
 *                     enum: [doctor]
 *                     example: "doctor"
 *                   degree:
 *                     type: string
 *                     example: "Doctorate in Medicine"
 *                   professionalLicense:
 *                     type: string
 *                     example: "12345678"
 *                   specialty:
 *                     type: string
 *                     example: "Orthodontics"
 *                   specialtyLicense:
 *                     type: string
 *                     example: "87654321"
 *                   clinicName:
 *                     type: string
 *                     example: "Health Clinic"
 *                   clinicLogo:
 *                     type: string
 *                     format: uri
 *                     example: "http://example.com/cliniclogo.png"
 *                   clinicAddress:
 *                     type: string
 *                     example: "456 Avenue, City"
 *                   authorizationFile:
 *                     type: string
 *                     format: uri
 *                     example: "http://example.com/auth.pdf"
 *                 required:
 *                   - name
 *                   - lastName
 *                   - gender
 *                   - birthDate
 *                   - email
 *                   - password
 *                   - role
 *                   - degree
 *                   - professionalLicense
 *                   - specialty
 *                   - specialtyLicense
 *                   - clinicName
 *                   - clinicAddress
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 loginId:
 *                   type: integer
 *                   example: 1
 *                 role:
 *                   type: string
 *                   example: "patient"
 *       400:
 *         description: Datos inválidos o faltantes
 *       500:
 *         description: Error del servidor
 */
