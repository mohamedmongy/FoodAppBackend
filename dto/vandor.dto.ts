interface CreateVandorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pinCode: string;
    address: string;
    phone: string;
    email: string;
    password: string; 
}

interface VandorLoginInput {
    email: string;
    password: string;
}

interface VandorPayload { 
    _id: string;
    email: string; 
    name: string;
}


interface EditVandorInput {
    name: string;
    address: string;
    phone: string;
    foodType: [string];
}

export { EditVandorInput ,CreateVandorInput, VandorLoginInput, VandorPayload };