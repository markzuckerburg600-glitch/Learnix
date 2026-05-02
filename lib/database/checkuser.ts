import { Types } from "mongoose";

export default function checkValidId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID");
    }
    return true;
}
