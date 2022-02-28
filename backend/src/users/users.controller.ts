import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile, HttpCode, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import  { diskStorage } from 'multer';
import { UpdateResult, DeleteResult } from 'typeorm';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from './users.service';
import * as dotenv from 'dotenv';
import { editFileName, fileFilter } from './utils/file-upload.utils';
import { User } from './entities/user.entity';

dotenv.config()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @HttpCode(200)
  create(@Body() data: UserDto) : Promise<UserDto> {
    return this.usersService.create(data);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findAll() : Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  login(@Req() _req: any) {
    return this.usersService.findOne( _req.user.id );
  }

  // @Get(':id')
  // @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // findOne(@Param('id', ParseIntPipe) id: string): Promise<UserDto> {
  //   return this.usersService.findOne(Number(id));
  // }

  @Patch('update-profile')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.env.DESTINATION,
      filename: editFileName,
    }),
    fileFilter: fileFilter,
  }),
  )
  update(@Req() _req: any, @UploadedFile() file: Express.Multer.File): Promise<UserDto> {
    return this.usersService.updateProfile( Number(_req.user.id), _req.body.user_name ,file);
  }

  /* Route delete user 
    http://${host}:${port}/users/remove-user/:userId
  */ 
  @Delete('/remove-user/:userID')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  remove(@Param('userId', ParseIntPipe) userId: string) : Promise<DeleteResult> {
    return this.usersService.remove( Number(userId));
  }

  /* User friends section */
  /* Route: send friend request
    http://${host}:${port}/users/friend-request/:recipientId
    add to friends with pending status
    */
  @Patch('/friend-request/:recipientId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  sendReqFriend(@Req() _req: any, @Param('recipientId') recipientId: number | string): Promise<User> {
    return this.usersService.insertToFriends( Number(_req.user.id), Number(recipientId))
  }

  /* Route: accept friend
    http://${host}:${port}/users/friend-accepte/:applicantId
    user who logged is the recipeint
    */
  @Patch('/friend-accept/:applicantId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  acceptReqFriend(@Req() _req: any, @Param('applicantId') applicantId: number | string): Promise<User> {
    return this.usersService.acceptFriend( Number(_req.user.id), Number(applicantId));
  }

  /* Route: block friend
    http://${host}:${port}/users/friend-accept/:applicantId
    */
  @Patch('/friend-block/:blockId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  blockFriend(@Req() _req: any, @Param('blockId') blockId: number | string): Promise<User> {
    return this.usersService.blockFriend(Number(_req.user.id), Number(blockId));
  }

  /* Route: unblock friend
    http://${host}:${port}/users/friend-unblock/:unblockId
  */
  @Patch('/friend-unblock/:unblockId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  unblockFriend(@Req() _req: any, @Param('unblockId') unblockId: number | string): Promise<User> {
    return this.usersService.unblockFriend(Number(_req.user.id) ,Number(unblockId));
  }

  /* Route: get pending requests 
    http://${host}:${port}/users/pending-friends/
  */
  @Get('/pending-friends')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  pendingFriends(@Req() _req: any): Promise<User[]> {
    return this.usersService.getPendingRequests(_req.user.id);
  }

  /* Route friends:
    http://${host}:${port}/users/friends
    -> return all friends of the logged user
  */
  @Get('/friends')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getFriends(@Req() _req: any): Promise<User[]> {
    return this.usersService.getUserFriends(Number(_req.user.id))
  }

  /* Route blocked friends 
    http://${host}:${port}/users/blocked-friends
    -> return all the blocked friends from the user
  */
  @Get('/blocked-friends')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getBlockedFriends(@Req() _req: any): Promise<User[]> {
    return this.usersService.getBlockedFriends(Number(_req.user.id));
  }

  /* Route no relation users
    http://${host}:${port}/users/no_rolation
    -> return all users that does not has any relation with the logged user.
  */
  @Get('/no_relation')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getNoRelationUsers(@Req() _req: any): Promise<User[]> {
    return this.usersService.getNoRelationUsers(Number(_req.user.id));
  }
}
