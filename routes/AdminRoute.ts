import express, { Request , Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto/vandor.dto";
import { Vandor } from "../models/vandor";
import { generatePassword, generateSalt } from "../utility/passwordUtiltiy";

// admin router will be responsinle for creating new vandor and fetching them 

const AdminRouter = express.Router(); 

const findVandor = async (id: string | undefined , email?: string) => {

    if (email) { 
        return await Vandor.findOne({ email: email })
    }

    return await Vandor.findById(id);
    
} 

AdminRouter.post("/vandor", async (req: Request , res: Response , next: NextFunction) => {
    const { name, password, phone, address , ownerName, foodType, email, pinCode } = <CreateVandorInput>req.body; 

    const existingVandor =  await findVandor("", email) 

    if (existingVandor !== null) {
         return res.json({ "message": "user is already exist"})
    }


    let salt = await generateSalt()
    let hashedPassword = await generatePassword(password, salt)

    const createVandor = await Vandor.create({
            name: name,
            ownerName: ownerName,
            foodType: foodType,
            pinCode: pinCode,
            address: address,
            phone: phone,
            email: email ,
            password: hashedPassword,  
            salt: salt,
            serviceAvailable: false , 
            coverImages: [],
            rating: 0,
            foods: []
        })
            
    res.json(createVandor);
})

AdminRouter.get("/vandors", async (req: any , res: any , next: any) => {

     let vandors = await Vandor.find();

     if (vandors !== null) {
        return  res.json(vandors)
      }

    return  res.json( { "message": "vandors data not available "})
})

AdminRouter.get("/vandor/:id", async (req: Request , res: Response , next: any) => {
   let vandorId = req.params.id 
 
   let vandor = await findVandor(vandorId);

   if (vandor != null) { 
       return  res.json(vandor)
   }

   return res.json({"message": " vandor data not available !!!!"})
})


export {AdminRouter, findVandor }; 