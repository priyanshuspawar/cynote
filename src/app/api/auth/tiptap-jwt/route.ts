import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

if(!process.env.TIPTAP_COLLAB_SECRET){
    throw new Error("TIPTAP_COLLAB_SECRET is not set")
}

export async function POST(req:NextRequest){
    // const {fileId} = req.json()
    const token = jwt.sign({},process.env.TIPTAP_COLLAB_SECRET!)
    return new NextResponse(JSON.stringify({token}))
}