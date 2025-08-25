import express from "express";
import mongoose from "mongoose";
import Shift from "../models/shiftsModel.js";
import requireAuth from "../middleware/requireAuth.js";
import { getShifts, createShift, updateShift, deleteShift } from "../controllers/shiftController.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Shifts
 *   description: Retrieve and manage user shifts
 */

/**
 * @swagger
 * /shifts:
 *   get:
 *     summary: Retrieve all shifts for a given user
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ObjectId of the user whose shifts to fetch
 *     responses:
 *       200:
 *         description: A list of shifts, populated with user and location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60f7a3e5b4dcb826d8fe1234
 *                   title:
 *                     type: string
 *                     example: Short Day
 *                   role:
 *                     type: string
 *                     example: Support Worker
 *                   typeOfShift:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: [ "Weekdays" ]
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6876ecb642df0376491dd254
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: john@example.com
 *                   location:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6876ec09d260b087559e5fff
 *                       name:
 *                         type: string
 *                         example: Clippers House, Clippers Quay
 *                       postCode:
 *                         type: string
 *                         example: M50 3XP
 *                       distance:
 *                         type: number
 *                         example: 0
 *                       constituency:
 *                         type: string
 *                         example: Salford and Eccles
 *                       adminDistrict:
 *                         type: string
 *                         example: Salford
 *                       cordinates:
 *                         type: object
 *                         properties:
 *                           longitude:
 *                             type: number
 *                             example: -2.286226
 *                           latitude:
 *                             type: number
 *                             example: 53.466921
 *                           useRotaCloud:
 *                             type: boolean
 *                             example: true
 *                   startTime:
 *                     type: string
 *                     example: "13:00"
 *                   finishTime:
 *                     type: string
 *                     example: "18:00"
 *                   numOfShiftsPerDay:
 *                     type: number
 *                     example: 1
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-06-17"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Bad request – userId missing or invalid
 *       403:
 *         description: Forbidden – userId does not match authenticated user
 *       500:
 *         description: Internal server error
 */

  router.get("/", requireAuth, getShifts);

/**
 * @swagger
 * /shifts:
 *   post:
 *     summary: Create a new shift
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - startTime
 *               - finishTime
 *               - location
 *               - user
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Morning Shift"
 *               role:
 *                 type: string
 *                 example: "Support Worker"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-06"
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               finishTime:
 *                 type: string
 *                 example: "17:00"
 *               location:
 *                 type: string
 *                 description: Location ID
 *                 example: "6876ec09d260b087559e5fff"
 *               user:
 *                 type: string
 *                 description: User ID
 *                 example: "6876ecb642df0376491dd254"
 *               typeOfShift:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Weekdays"]
 *     responses:
 *       201:
 *         description: Shift created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60f7a3e5b4dcb826d8fe1234"
 *                 title:
 *                   type: string
 *                 role:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 startTime:
 *                   type: string
 *                 finishTime:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6876ecb642df0376491dd254"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john@example.com"
 *                 location:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6876ec09d260b087559e5fff"
 *                     name:
 *                       type: string
 *                       example: "Clippers House, Clippers Quay"
 *                     postCode:
 *                       type: string
 *                       example: "M50 3XP"
 *                     distance:
 *                       type: number
 *                       example: 0
 *                     constituency:
 *                       type: string
 *                       example: "Salford and Eccles"
 *                     adminDistrict:
 *                       type: string
 *                       example: "Salford"
 *                     cordinates:
 *                       type: object
 *                       properties:
 *                         longitude:
 *                           type: number
 *                           example: -2.286226
 *                         latitude:
 *                           type: number
 *                           example: 53.466921
 *                         useRotaCloud:
 *                           type: boolean
 *                           example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid input or missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User cannot create shifts for other users
 *       500:
 *         description: Internal server error
 */
  router.post("/", requireAuth, createShift);

/**
 * @swagger
 * /shifts/{id}:
 *   put:
 *     summary: Update an existing shift
 *     description: Update shift details. Only accessible by the shift owner.
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the shift to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Morning Shift"
 *               role:
 *                 type: string
 *                 example: "Support Worker"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-25"
 *               startTime:
 *                 type: string
 *                 example: "10:00"
 *               finishTime:
 *                 type: string
 *                 example: "18:00"
 *               location:
 *                 type: string
 *                 description: Location ID
 *                 example: "6876ec09d260b087559e5fff"
 *               typeOfShift:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Weekdays"]
 *               numOfShiftsPerDay:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 24
 *                 example: 1
 *     responses:
 *       200:
 *         description: Shift updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60f7a3e5b4dcb826d8fe1234"
 *                 title:
 *                   type: string
 *                 role:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 startTime:
 *                   type: string
 *                 finishTime:
 *                   type: string
 *                 typeOfShift:
 *                   type: array
 *                   items:
 *                     type: string
 *                 numOfShiftsPerDay:
 *                   type: number
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6876ecb642df0376491dd254"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john@example.com"
 *                 location:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6876ec09d260b087559e5fff"
 *                     name:
 *                       type: string
 *                       example: "Clippers House, Clippers Quay"
 *                     postCode:
 *                       type: string
 *                       example: "M50 3XP"
 *                     distance:
 *                       type: number
 *                       example: 0
 *                     constituency:
 *                       type: string
 *                       example: "Salford and Eccles"
 *                     adminDistrict:
 *                       type: string
 *                       example: "Salford"
 *                     cordinates:
 *                       type: object
 *                       properties:
 *                         longitude:
 *                           type: number
 *                           example: -2.286226
 *                         latitude:
 *                           type: number
 *                           example: 53.466921
 *                         useRotaCloud:
 *                           type: boolean
 *                           example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User cannot edit other users' shifts
 *       404:
 *         description: Not Found - Shift does not exist
 *       500:
 *         description: Internal server error
 */
  router.put("/:id", requireAuth, updateShift)

/**
 * @swagger
 * /shifts/{id}:
 *   delete:
 *     summary: Delete a shift
 *     description: Remove an existing shift. Only accessible by the shift owner.
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the shift to delete
 *         example: "60f7a3e5b4dcb826d8fe1234"
 *     responses:
 *       200:
 *         description: Shift deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Shift deleted successfully"
 *                 deletedShift:
 *                   type: object
 *                   required:
 *                    - title
 *                    - role
 *                    - date
 *                    - startTime
 *                    - finishTime
 *                    - location
 *                    - user
 *                   properties:
 *                    _id:
 *                      type: string
 *                      example: "60f7a3e5b4dcb826d8fe1234"
 *                    title:
 *                      type: string
 *                      example: "Morning Shift"
 *                    role:
 *                      type: string
 *                      example: "Nurse"
 *                    date:
 *                      type: string
 *                      format: date
 *                      example: "2023-03-15"
 *                    startTime:
 *                      type: string
 *                      format: time
 *                      example: "08:00"
 *                    finishTime:
 *                      type: string
 *                      format: time
 *                      example: "16:00"
 *                    location:
 *                      type: string
 *                      description: Location ID
 *                      example: "6876ec09d260b087559e5fff"
 *                    user:
 *                      type: string
 *                      description: User ID
 *                      example: "6876ecb642df0376491dd254"
 *                    typeOfShift:
 *                      type: array
 *                      items:
 *                        type: string
 *                      example: ["Weekdays"]
 *       400:
 *         description: Bad request - Invalid shift ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid shift ID format"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User cannot delete other users' shifts
 *         
 *       404:
 *         description: Not Found - Shift does not exist
 *        
 *       500:
 *         description: Internal server error
 
 */
  router.delete("/:id", requireAuth, deleteShift);

export default router;
