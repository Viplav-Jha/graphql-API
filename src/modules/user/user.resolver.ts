import { Query, Resolver } from "type-graphql";
import { User } from "./user.dto";

@Resolver(()=> User) 
class UserResolver{
   
     @Query(()=>User)
     user(){
         return{
            id:'2116786',
            email:'viplav.jha@gmail.com',
            username:'12344'
         }
     }
}

export default UserResolver;