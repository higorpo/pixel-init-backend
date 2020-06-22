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

Route.resource('/users', 'UserController');
Route.resource('/sessions', 'SessionController');
Route.resource('/pixelthon/groups', 'PixelthonGroupController').middleware(['auth']);
Route.resource('/pixelthon/participant', 'PixelthonParticipantController').middleware(['auth']);
Route.resource('/notifications', 'NotificationController').middleware(['auth']);
Route.resource('/publications', 'PublicationController').middleware(['auth']);
Route.post('/publications/:id/likes', 'PublicationLikeController.store').middleware(['auth']);
Route.delete('/publications/:id/likes', 'PublicationLikeController.destroy').middleware(['auth']);
Route.resource('/publications/:postId/comments', 'PublicationCommentController').middleware(['auth']);
