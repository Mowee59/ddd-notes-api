import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";
import { DeleteUserDTO } from "src/user/application/use-cases/delete-user/delete-user.dto";

export class DeleteUserRequestDTO implements DeleteUserDTO {
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The UUID of the user to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;
}