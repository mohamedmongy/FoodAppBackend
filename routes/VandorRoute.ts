
import express, { Request, Response , NextFunction } from "express";
import { EditVandorInput, VandorLoginInput } from "../dto/vandor.dto";
import { authenticateUser } from "../middlewares/CommonAuth";
import { Food } from "../models/Food";
import { Vandor } from "../models/vandor";
import { generateToken, validateUserPassword } from "../utility/passwordUtiltiy";
import { findVandor } from "./AdminRoute";
import { CreateVandorInput } from "../dto/vandor.dto"; 
import { CreateFoodInputs } from "../dto/Food.dto";
import multer from "multer";
 
const VandorRouter = express.Router(); 



let imageStorage = multer.diskStorage({ 
    destination: function(req, file, cb) { 
        cb(null, 'images')
    }, 
    filename: function(req, file , cb) { 
        cb(null, new  Date().toISOString()+"_"+file.originalname);
    }

})

let images = multer({ storage: imageStorage }).array('images', 10);

VandorRouter.post("/login",async (req: Request, res: Response, next: NextFunction) => {
  let { email , password } = <VandorLoginInput>req.body;

   let existingVandor = await findVandor("", email); 

   if (existingVandor !== null) { 

    let isValidCredentials = await validateUserPassword(password, existingVandor.salt, existingVandor.password);
      
    if  (isValidCredentials) { 
        let token =  generateToken({ 
               _id: existingVandor.id,
               email: existingVandor.email,
               name: existingVandor.name 
            })

        return res.json(token)
    } else { 
        return res.json({ "message": "invalid user password !!!!"})
    }
   }

   return res.json({"mesasge": "log in credentials is not valild !!!"})
  
})

// Authecticate the user for all the following routes 

VandorRouter.use(authenticateUser)

VandorRouter.get("/profile", async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) { 
        let vandor = await findVandor(req.user._id); 
        return res.json(vandor);
    }
    
    return res.json({ "message": "vandor not found !!!"})
})

VandorRouter.patch("/profile" ,async (req: Request, res: Response, next: NextFunction) => {

    let { name, address, phone, foodType } = <EditVandorInput>req.body; 

    if (req.user) { 
        let existingVandor = await findVandor(req.user._id); 

        if (existingVandor !== null) {
            existingVandor.name = name
            existingVandor.address = address
            existingVandor.phone = phone 
            existingVandor.foodType = foodType

            let savedResult = await existingVandor.save();
            return res.json(savedResult);
        }

        return res.json(existingVandor);
    }
    
    return res.json({ "message": "vandor not found, can't update vandor profile !!!"})
})


VandorRouter.patch("/coverimage", images,async (req: Request, res: Response, next: NextFunction) => {

    if (req.user) { 
        let existingVandor = await findVandor(req.user._id); 
         
        if (existingVandor !== null) {
            
            let files = req.files as [Express.Multer.File]
            let images = files.map((file: Express.Multer.File) => file.filename )
           
            existingVandor.coverImages.push(...images);
            let savedResult = await existingVandor.save();
            return res.json(savedResult);
        }

        return res.json(existingVandor);
    }
    
    return res.json({ "message": "vandor not found, can't update vandor profile !!!"})
})


VandorRouter.patch("/service" ,async (req: Request, res: Response, next: NextFunction) => {

    if (req.user) { 
        let existingVandor = await findVandor(req.user._id); 

        if (existingVandor !== null) {
            existingVandor.serviceAvailable = !existingVandor.serviceAvailable 
            let savedResult = await existingVandor.save();
            return res.json(savedResult);
        }

        return res.json(existingVandor);
    }
    
    return res.json({ "message": "vandor not found , can't update vandor service !!!"})
    
})

VandorRouter.post("/food", images, async (req: Request , res: Response , next: any) => {
    
    let { 
        name, 
        description, 
        category,
        foodType, 
        readyTime,
        price 
    } = <CreateFoodInputs>req.body;


    let files = req.files as [Express.Multer.File]
    let images = files.map((file: Express.Multer.File) => file.filename )

    if (req.user) { 

        let vandor = await findVandor(req.user._id);

        if (vandor !== null) {
            
            let createFood =  await Food.create({ 
                vandorId: vandor.id, 
                name: name, 
                description: description, 
                category: category, 
                foodType: foodType, 
                readyTime: readyTime,
                price: price,
                rating: 0,
                images: images
            })

            vandor.foods.push(createFood);
            let updatedResult = await vandor.save();

            return res.json(updatedResult);
        }       
    }
     
    return res.json({ "message": "can't create food and update vandor !!!"})
})

VandorRouter.get("/foods", async (req: Request , res: Response, next: any) => {
    if (req.user) { 
        let foods = await Food.find( { vandorId: req.user._id })

        if (foods !== null ) { 
             return res.json(foods)
        }
    }
    
    return res.json({ "message": "vandor not found , can't get it's foods !!!"})
})

export  {VandorRouter}; 