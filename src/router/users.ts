import express from 'express';
import {deleteUser, getAllUsers, updateUser} from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares/index';

export default (router: express.Router) => {
    router.get('/users',isAuthenticated, getAllUsers);
    router.delete('/users/:id',isAuthenticated ,isOwner, deleteUser);
    router.patch('/users/:id',isAuthenticated, isOwner, updateUser); // we use path instead of put because we are only updating the username if we were to update the password we would use put
}