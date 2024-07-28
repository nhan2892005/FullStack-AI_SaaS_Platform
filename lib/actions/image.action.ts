"use server"

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils"
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";
import { model } from "mongoose";

const populateUser = (query:any) => query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName"
});

// ADD IMAGE

export async function addImage({ image, userId, path} : AddImageParams) {
    try {
        await connectToDatabase();

        const author = await User.findById(userId);

        if (!author) {
            throw new Error("User not found");
        }

        const newImage = await Image.create({
            ...image,
            author: author._id,
        })

        revalidatePath(path);

        return JSON.parse(JSON.stringify(newImage));
    } catch (error) {
        handleError(error);
    }
}

// UPDATE IMAGE

export async function updateImage({ image, userId, path} : UpdateImageParams) {
    try {
        await connectToDatabase();

        const updateImage = await Image.findById(image._id);

        if (! updateImage || updateImage.author.toHexString() !== userId) {
            throw new Error("Unauthorized or image not found");
        }

        const updated = await Image.findByIdAndUpdate(
            updateImage._id,
            image,
            { new: true }
        )

        revalidatePath(path);

        return JSON.parse(JSON.stringify(updated));
    } catch (error) {
        handleError(error);
    }
}

// DELETE IMAGE
export async function deleteImage(imageId:string) {
    try {
        await connectToDatabase();

        // ! TO DO: Check if user is authorized to delete image
        // const image = await Image.findById(imageId);

        await Image.findByIdAndDelete(imageId);

        return JSON.parse(JSON.stringify(imageId));
    } catch (error) {
        handleError(error);
    } finally {
        redirect("/");
    }
}

// GET IMAGE BY ID
export async function getImageById(imageId:string) {
    try {
        await connectToDatabase();

        const image = await populateUser(Image.findById(imageId));

        if (!image) {
            throw new Error("Image not found");
        }

        return JSON.parse(JSON.stringify(image));
    } catch (error) {
        handleError(error);
    }
}