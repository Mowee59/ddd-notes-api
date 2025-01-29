import { Injectable } from "@nestjs/common";
import { IUserRepo } from "../../domain/interfaces/user-repository.interface";
import { UserEmail } from "src/user/domain/value-objects/userEmail";
import { User } from "src/user/domain/entities/user";
import { Inject } from "@nestjs/common";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "src/drizzle/schemas";
import { UserMap } from "src/user/mappers/userMap";
import { eq } from "drizzle-orm";


@Injectable()
export class SqlLiteUserRepo implements IUserRepo {

  constructor(
    @Inject(DRIZZLE) private readonly db: LibSQLDatabase<typeof schema>,
    @Inject('USER_MODEL') private readonly userModel: typeof schema.baseUsers
    ) {}

 async exists(userEmail: UserEmail): Promise<boolean> {
  const user = await this.db.select()
    .from(this.userModel)
    .where(eq(this.userModel.user_email,  userEmail.value))
    .get();
  
  return !!user;
 }

 // TODO : Also accept a string 
 async getUserByEmail(userEmail: UserEmail  ): Promise<User> {
  const baseUser = await this.db.select()
    .from(this.userModel)
    .where(eq(this.userModel.user_email, userEmail.value))
    .get();

    if (!baseUser) {
      return null;
    }
  
    return UserMap.toDomain(baseUser);
 }

 async save(user: User): Promise<void> {
  const exists : Boolean = await this.exists(user.props.email);

  if(!exists) {
  const rawUserData = await UserMap.toPersistence(user);
  await this.db.insert(this.userModel).values(rawUserData);
  }
  
  return
 }


}
