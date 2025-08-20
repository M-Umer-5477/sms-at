import { NextResponse } from "next/server";

export async function POST(req){
console.log(req);    
const data =await req.formData();
console.log(data);
const file=data.get('submissionFile');
console.log('file',file);
return NextResponse.json({success:true, file});

}
//const byteData= await file.arrayBuffer();
//const buffer=Buffer.from(byteData);
//const path=`./public/${file.name}`;