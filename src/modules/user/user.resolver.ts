import { Query, Resolver } from "type-graphql";
import { User } from "./user.dto";

@Resolver(()=> User) 
class UserResolver{
   
     @Query(()=>User)
     user(){
         return{
            id:'21312',
            email:'423j4n',
            username:'dshgfyrjrn'
         }
     }
}

export default UserResolver;