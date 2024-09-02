import db from '@/lib/db';
import bcrypt from 'bcrypt';
import User from '@/models/usermodel';
import Request from '@/models/requestmodel'; // Assuming there's a Request model for admin requests

export async function POST(request) {
    await db.connect();

    try {
        const body = await request.json();
        const { email } = body;

        // Improved logging for debugging
        console.log("Request body:", body);

        if (!email) {
            console.log("Missing required fields");
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const requestRecord = await Request.findOne({ email });
        if (!requestRecord) {
            console.log("Request not found");
            return new Response(JSON.stringify({ error: 'Request not found' }), { status: 404 });
        }

        const isExisting = await User.findOne({ email: requestRecord.email });
        console.log("Existing user:", isExisting);

        if (isExisting) {
            console.log("User already exists");
            return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(requestRecord.password, 10);
        console.log("Hashed Password:", hashedPassword);

        const newUser = new User({
            name: requestRecord.name,
            email: requestRecord.email,
            password: hashedPassword,
            Role: requestRecord.Role // Assuming role is stored in the request
        });

        console.log("New User:", JSON.stringify(newUser));

        await newUser.save();
        await Request.deleteOne({email:requestRecord.email});

        console.log("User created successfully");

        return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}

export async function GET(request) {
    await db.connect();

    try {
        const user = await User.find();

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
export async function PUT(request) {
    await db.connect();

    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const body = await request.json();
        const { role } = body;

        if (!email || !role) {
            return new Response(JSON.stringify({ error: 'Email and role are required' }), { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        user.Role = role;
        await user.save();

        return new Response(JSON.stringify({ message: 'User role updated successfully' }), { status: 200 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}

export async function DELETE(request) {
    await db.connect();

    try {
        const url = new URL(request.url);
        const email = url.searchParams.get('email');

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
        }

        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}