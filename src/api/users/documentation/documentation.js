//Esquema de user

/**
 * @openapi 
 *  components:
 *   schemas:
 *    UserSchema:
 *     type: object
 *     properties:
 *      name:
 *        type: string
 *      lastName:
 *        type: string
 *      birthdayDate:
 *        type: date
 *      email:
 *        type: string
 *      password:
 *        type: string
 *      password2:
 *        type: string
 *      securityQuestion:
 *        type: string
 *      securityResponse:
 *        type: string
 *      rol:
 *        type: string
 *      acceptedTerms:
 *        type: boolean
 *      course:
 *        type: string
 *     required:
 *      - name
 *      - lastName
 *      - email
 *      - password
 *      - password2
 *      - securityQuestion
 *      - securityResponse
 *      - rol
 *      - acceptedTerms
 *     example:
 *      name: Samuel 
 *      lastName: Reyes
 *      birthdayDate: 26-05-2005
 *      email: some@example.com
 *      password: 1234?Do
 *      password2: 1234?Do
 *      securityQuestion: Nombre de tu mascota 
 *      securityResponse: zoe
 *      rol: Soy Docente
 *      acceptedTerms: True
 *      course: SegundoA
 */

//Authorization

/**
 * @openapi 
 *  components:
 *   securitySchemes:
 *    bearerAuth:
 *     type: apiKey
 *     in: header
 *     name: Authorization
 *     scheme: bearer
 *     bearerFormat: JWT
 */

//Response

/**
 * @openapi 
 *  components:
 *   responses:
 *    UauthorizedError:
 *     description: Acess token is missing or invalid
 */

//API POST

/**
 * @openapi
 * /api/register:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: The following route creates, stores and sends a verification email to the provided email
 *    tags: [UserSchema]
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/UserSchema'
 *    responses:
 *     201:
 *      description: User Created
 *     400:
 *      description: Bad Request
 *     401:
 *      $ref: '#/components/responses/UauthorizedError'
 *     422:
 *      description: Validation error, wrong date format
 *     409:
 *      description: Email is assigned to another user, The password do not match
 *     500:
 *      description: Unknown error
 */

// API GET

/**
 * @openapi
 * /api/users:
 *  get:
 *    summary: Return all users
 *    tags: [UserSchema]
 *    parameters:
 *      - in: query
 *        name: name
 *        description: Query for name
 *        schema:
 *          type: string
 *      - in: query
 *        name: lastName
 *        description: Query for lastName
 *        schema:
 *          type: string
 *      - in: query
 *        name: email
 *        description: Query for email
 *        schema:
 *          type: string
 *      - in: query
 *        name: securityQuestion
 *        description: Query for securityQuestion
 *        schema:
 *          type: string
 *      - in: query
 *        name: securityResponse
 *        description: Query for securityResponse
 *        schema:
 *          type: string
 *      - in: query
 *        name: rol
 *        description: Query for rol
 *        schema:
 *          type: string
 *      - in: query
 *        name: course
 *        description: Query for course
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: All users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/UserSchema'
 *      400:
 *       description: Something went wrong
 *      401:
 *       $ref: '#/components/responses/UauthorizedError'
 *      404:
 *       description: User Not Found
 *      500:
 *       description: Unknown error 
 */

// API DELETE

/**
 * @openapi
 * /api/users/{id}:
 *  delete:
 *   summary: Delete a user with their specific ID
 *   tags: [UserSchema]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: The user id
 *   responses:
 *    200:
 *     description: User
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/UserSchema'
 *    400:
 *     description: Something went wrong
 *    404:
 *     description: User Not Found
 *    422:
 *     description: Id Not Valid
 *    500:
 *     description: Unknown error 
 */

//API PATCH

/**
 * @openapi 
 *  components:
 *   schemas:
 *    UserEVreset:
 *     type: object
 *     properties:
 *      email:
 *        type: string
 *     required:
 *      - email
 *      - securityResponse
 *     example:
 *      email: some@example.com
 *      securityResponse: zoe
 */

/**
 * @openapi
 * /api/resetPassword:
 *  patch:
 *   summary: The following route, send an email to reset the password, if the email provided matches the one registered on the platform.
 *   tags: [UserEVreset]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       $ref: '#/components/schemas/UserEVreset'
 *   responses:
 *    200:
 *     description: Message sent succesfully
 *    403:
 *     description: Unregistered Email or Incorrect security response
 */

//API LOGIN

/**
 * @openapi 
 *  components:
 *   schemas:
 *    Login:
 *     type: object
 *     properties:
 *      email:
 *        type: string
 *      password:
 *        type: string
 *     required:
 *      - email
 *      - password
 *     example:
 *      email: some@example.com
 *      password: 1234?Do
 */

/**
 * @openapi
 * /api/login:
 *  post:
 *   summary: The following route verifies the matching of the email with the password, and is blocked after 3 failed attempts, eventually where a password reset email was sent. Otherwise it gives access to the user.
 *   tags: [Login]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       $ref: '#/components/schemas/Login'
 *   responses:
 *    200:
 *     description: Access a user
 *    400:
 *     description: Bad Request
 *    403:
 *     description: Unauthorized Access
 *    500:
 *     description: UnKwnown Error 
 * 
 */
