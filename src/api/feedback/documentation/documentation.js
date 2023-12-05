//Esquema de Feedback

/**
* @openapi 
*components:
*  schemas:
*    FeedbackSchema:
*      type: object
*      properties:
*        assignmentId:
*          type: string
*          description: "ID of the assignment."
*        deliveries:
*          type: array
*          items:
*            type: object
*            properties:
*              emailStudent:
*                type: string
*                description: "Email of the student."
*              videoURL:
*                type: string
*                description: "URL of the video."
*              feedback:
*                type: object
*                properties:
*                  skills:
*                    type: object
*                    properties:
*                      communication:
*                        type: number
*                        description: "Communication skills rating (0-5)."
*                      collaboration:
*                        type: number
*                        description: "Collaboration skills rating (0-5)."
*                      creativity:
*                        type: number
*                        description: "Creativity skills rating (0-5)."
*                      criticalThinking:
*                        type: number
*                        description: "Critical thinking skills rating (0-5)."
*                  comment:
*                    type: string
*                    description: "Additional comments."
*              qualified:
*                type: boolean
*                description: "Qualification status."
*      required:
*        - assignmentId
*        - deliveries
*/ 


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
 *    Refresh-Token:
 *     type: apiKey
 *     in: header
 *     name: Refresh-Token
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
 * /api/delivery/{id}:
 *  post:
 *    securitySchemes:
 *      - bearerAuth: []
 *      - RefreshToken: []
 *    summary: Creates the deliverable to a given project assignment
 *    tags: [FeedbackSchema]
 *    parameters:
 *    -  in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: ID of the Assignment
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        $ref: '#/components/schemas/FeedbackSchema'
 *       example:
 *        emailStudent: some1@example.com 
 *        videoURL: https://www.youtube.com/watch?v=T85b4E-piVE&t=224s
 *    responses:
 *     201:
 *      description: Project delivered
 *     401:
 *      $ref: '#/components/responses/UauthorizedError'
 *     404:
 *      description: Assignment not Found or project not assigned to student
 *     422:
 *      description: Id Not Valid
 *     500:
 *      description: Unknown error
 */

// API GET

/**
 * @openapi
 * /api/deliveries:
 *  get:
 *    security:
 *      - bearerAuth: []
 *      - Refresh-Token: []
 *    summary: Return all deliveries and qualified projects
 *    tags: [FeedbackSchema]
 *    parameters:
 *     - in: query
 *       name: assignmentId
 *       description: Query for assignmentId
 *       schema:
 *         type: string
 *     - in: query
 *       name: emailStudent
 *       description: Query for emailStudent
 *       schema:
 *         type: string
 *     - in: query
 *       name: course
 *       description: Query for course
 *       schema:
 *         type: string
 *     - in: query
 *       name: title
 *       description: Query for title
 *       schema:
 *         type: string
 *     - in: query
 *       name: qualified
 *       description: Query for qualified
 *       schema:
 *         type: string
 *    responses:
 *     200:
 *      description: Deliveries found successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/FeedbackSchema'
 *     400:
 *      description: Something went wrong
 *     401:
 *      $ref: '#/components/responses/UauthorizedError'
 *     404:
 *      description: Deliveries Not Found
 *     500:
 *      description: Unknown error 
 */

// API GET

/**
 * @openapi
 * /api/deliveries/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Return count of qualified deliverables over the total quantity of a project
 *    tags: [FeedbackSchema]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: string
 *       required: true
 *       description: ID of the Assignment
 *    responses:
 *     200:
 *      description: Count found successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *          $ref: '#/components/schemas/FeedbackSchema'
 *     400:
 *      description: Something went wrong
 *     401:
 *      $ref: '#/components/responses/UauthorizedError'
 *     422:
 *      description: Id Not Valid
 *     500:
 *      description: Unknown error 
 */

// API PATCH
/**
 * @openapi
 * /api/delivery/{id}/feedback:
 *  patch:
 *   summary: Project qualified
 *   tags: [FeedbackSchema]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: The id de la delivery
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       $ref: '#/components/schemas/FeedbackSchema'
 *      example:
 *       feedback:
 *         skills:
 *           communication: 4
 *           collaboration: 5
 *           creativity: 5
 *           criticalThinking: 5
 *         comment: "Lo estas haciendo excelente, sigue así"
 *   responses:
 *    201:
 *     description: Successfully classified project
 *    400:
 *     description: Qualification must not be empty
 *    404:
 *     description: Delivery Not Found 
 *    422:
 *     description: Id Not Valid
 *    500:
 *     description: UnKwnown Error 
 */



// API DELETE

/**
 * @openapi
 * /api/delivery/{id}:
 *  delete:
 *   summary: Delete a delivery with their specific ID
 *   tags: [FeedbackSchema]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: Delete a delivery with their specific ID
 *   responses:
 *    200:
 *     description: User
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        items:
 *         $ref: '#/components/schemas/FeedbackSchema'
 *    400:
 *     description: Something went wrong
 *    404:
 *     description: Delivery Not Found
 *    422:
 *     description: Id Not Valid
 *    500:
 *     description: Unknown error
 */