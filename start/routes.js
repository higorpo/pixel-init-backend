'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/users', 'UserController.store');
Route.get('/users/:id', 'UserController.show').middleware(['auth']);
Route.put('/users', 'UserController.update').middleware(['auth']);
Route.post('/uploads', 'UploadController.store').middleware(['auth']);
Route.delete('/uploads', 'UploadController.destroy').middleware(['auth']);
Route.resource('/sessions', 'SessionController');
Route.resource('/pixelthon/groups', 'PixelthonGroupController').middleware(['auth']);
Route.resource('/pixelthon/participant', 'PixelthonParticipantController').middleware(['auth']);
Route.resource('/notifications', 'NotificationController').middleware(['auth']);
Route.resource('/publications', 'PublicationController').middleware(['auth']);
Route.post('/publications/:id/likes', 'PublicationLikeController.store').middleware(['auth']);
Route.delete('/publications/:id/likes', 'PublicationLikeController.destroy').middleware(['auth']);
Route.resource('/publications/:id/comments', 'PublicationCommentController').middleware(['auth']);
Route.resource('/users/:id/connections', 'UserConnectionController').middleware(['auth']);