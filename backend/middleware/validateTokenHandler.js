import JWT from "jsonwebtoken"

const validateToken = (req, res, next) => {
    // Extract token from request headers or other sources
    console.log("Validate Token called")
    const accessToken = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

    if (!accessToken) {
        return res.status(401).json({ message: "No access token provided" });
    }

    try {
        const payload = JWT.verify(accessToken, process.env.SECRET);
        console.log("Decoded Payload:", payload);
        // Attach the payload to the request object for further use
        req.user = payload;
        console.log(req.user)
        next(); // Call the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid access token" });
    }
};

export default validateToken;
