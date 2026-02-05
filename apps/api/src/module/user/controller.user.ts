import { UserService } from '#/module/user/service.user'
import { UUIDParam } from '#/pipe/pipe.uuid-param'
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { CreateUserDto, UpdateUserDto } from '@repo/common'

@ApiTags('Users')
@ApiCookieAuth('token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user with the provided data.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'User created successfully.' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all active users.',
  })
  @ApiOkResponse({ description: 'List of users.' })
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns a single user by ID.',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiOkResponse({ description: 'User found.' })
  async findOne(@UUIDParam('id') id: string) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates user data by ID.',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'User updated successfully.' })
  async update(@UUIDParam('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Soft deletes user by ID (sets isActive to false).',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiOkResponse({ description: 'User deleted successfully.' })
  async remove(@UUIDParam('id') id: string) {
    return this.userService.remove(id)
  }
}
