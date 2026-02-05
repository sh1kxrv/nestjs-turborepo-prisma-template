import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator'

/**
 * DTO for creating a new user
 * @example
 * {
 *   "email": "user@example.com",
 *   "name": "John Doe"
 * }
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string

  @ApiPropertyOptional({
    description: 'User display name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string
}

/**
 * DTO for updating an existing user
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User display name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string
}
