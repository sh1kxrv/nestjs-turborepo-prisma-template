import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length } from 'class-validator'

/**
 * DTO for requesting email verification code
 */
export class AuthRequestCodeDto {
  @ApiProperty({
    description: 'Email address to send verification code',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string
}

/**
 * DTO for confirming email verification code
 */
export class AuthConfirmCodeDto {
  @ApiProperty({
    description: 'Token received from requestCode endpoint',
  })
  @IsString()
  token!: string

  @ApiProperty({
    description: '6-digit verification code',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  code!: string
}
